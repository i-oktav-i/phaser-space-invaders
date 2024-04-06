import { GameObjects, Scene } from "phaser";
import { sprites } from "./constants";
import "./style.css";
import { getGrid } from "./utils";

import _throttle from "lodash.throttle";
import { Circle } from "./collision/Circle";
import { Collider } from "./collision/Collider";
import { quadTree } from "./collision/QuadTree";
import { Vector } from "./collision/Vector";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BUNKERS_COUNT = 4;
const bunkersGap = GAME_WIDTH / (BUNKERS_COUNT + 1);
const INIT_BUNKER_HP = 10;
const ALIEN_FIRE_CHANCE = 0.1;

const IS_DEBUG = false;

type AliensType = "blue" | "green" | "red";

const gameState = {
  score: 0,
  status: null as "won" | "lose" | null,
};

type ObjectInfo<T, A = {}> = {
  sprite: T;
  position: {
    x: number;
    y: number;
  };
  collider: Collider;
} & A;

class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload = () => {
    this.load.atlas("sprites", sprites.url, {
      frames: sprites.frames,
    });
  };

  create = () => {
    this.scene.start("Level");
  };
}

class Level extends Scene {
  cannon!: ObjectInfo<GameObjects.Image>;
  aliens: ObjectInfo<GameObjects.Sprite, { xIndex: number }>[] = [];
  bullets: ObjectInfo<GameObjects.Arc, { speed: number }>[] = [];
  bunkers: ObjectInfo<
    GameObjects.Image,
    {
      hp: number;
      text: GameObjects.Text;
    }
  >[] = [];
  hitPointsIndicator: GameObjects.Image[] = [];
  moveAliensLeft = true;

  aliensMoveMaxInterval = 1000;
  aliensMoveMinInterval = 100;
  aliensMoveInterval = this.aliensMoveMaxInterval;

  aliensRows = 5;
  aliensColumns = 11;
  aliensGridSize = 40;
  aliensCount = this.aliensRows * this.aliensColumns;

  hp = 3;

  constructor() {
    super("Level");
  }

  preload = () => {
    gameState.score = 0;
    gameState.status = null;

    this.aliens = [];
    this.bullets = [];
    this.bunkers = [];
    this.hitPointsIndicator = [];
    this.hp = 3;
    this.moveAliensLeft = true;
  };

  create() {
    this.createAnimation("blue");
    this.createAnimation("green");
    this.createAnimation("red");

    const firstAlienX =
      (GAME_WIDTH - this.aliensColumns * this.aliensGridSize) / 2;
    const grid = getGrid(
      this.aliensGridSize,
      this.aliensRows,
      this.aliensColumns,
      firstAlienX,
      GAME_HEIGHT * 0.1
    );

    this.aliens = grid.map(({ centerX, centerY, xIndex, yIndex }) => {
      const alienTypeByRow: AliensType[] = [
        "red",
        "green",
        "green",
        "blue",
        "blue",
      ];

      const alienType = alienTypeByRow[yIndex];
      const alienSize = sprites.sizes[alienType];

      const alienPosition = {
        x: centerX - alienSize.w / 2,
        y: centerY - alienSize.h / 2,
      };

      const alienSprite = this.add.sprite(
        centerX,
        centerY,
        "sprites",
        `${alienType}1`
      );

      alienSprite.play(`${alienType}Idle`);

      const collider = new Collider(
        new Circle(
          new Vector(centerX, centerY),
          Math.max(alienSize.w / 2, alienSize.h / 2)
        ),
        new Vector(0, 0),
        "alien"
      );

      return {
        sprite: alienSprite,
        position: alienPosition,
        collider,
        xIndex,
      };
    });

    if (IS_DEBUG) {
      this.aliens.forEach(({ collider }) => {
        this.add.circle(
          collider.gameObject.center.x,
          collider.gameObject.center.y,
          collider.gameObject.radius,
          0xff0000
        );
      });
    }

    const cannonPosition = {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT * 0.9 - sprites.sizes.cannon.h,
    };
    const cannonSprite = this.add.image(
      cannonPosition.x,
      cannonPosition.y,
      "sprites",
      "cannon"
    );

    const cannonCollider = new Collider(
      new Circle(
        new Vector(cannonPosition.x, cannonPosition.y),
        Math.max(sprites.sizes.cannon.w / 2, sprites.sizes.cannon.h / 2)
      ),
      new Vector(0, 0),
      "cannon"
    );

    this.cannon = {
      sprite: cannonSprite,
      position: cannonPosition,
      collider: cannonCollider,
    };

    this.hitPointsIndicator = Array.from({ length: this.hp }, (_, index) => {
      return this.add.image(
        sprites.sizes.cannon.w * 2 * (index + 1),
        GAME_HEIGHT - sprites.sizes.cannon.h - 10,
        "sprites",
        "cannon"
      );
    });

    this.bunkers = Array.from({ length: BUNKERS_COUNT }, (_, index) => {
      const bunker = this.add.image(
        bunkersGap * (index + 1),
        GAME_HEIGHT * 0.9 -
          sprites.sizes.cannon.h -
          sprites.sizes.bunker.h -
          10,
        "sprites",
        "bunker"
      );

      const collider = new Collider(
        new Circle(
          new Vector(bunker.x, bunker.y),
          Math.max(sprites.sizes.bunker.w / 2, sprites.sizes.bunker.h / 2)
        ),
        new Vector(0, 0),
        "bunker"
      );

      const text = this.add.text(
        bunker.x - sprites.sizes.bunker.w,
        bunker.y - sprites.sizes.bunker.h,
        `${INIT_BUNKER_HP}`,
        {
          fontSize: "16px",
          color: "#ffffff",
        }
      );

      return {
        sprite: bunker,
        position: {
          x: bunker.x,
          y: bunker.y,
        },
        collider,
        hp: INIT_BUNKER_HP,
        text,
      };
    });

    this.add
      .rectangle(0, GAME_HEIGHT * 0.9, GAME_WIDTH, 2, 0x00ff00)
      .setOrigin(0, 0);

    const throttledSpawnBullet = _throttle(this.spawnBullet, 100);

    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowRight":
          const xMovement = event.key === "ArrowLeft" ? -5 : 5;

          this.cannon.position.x += xMovement;
          this.cannon.sprite.x += xMovement;
          this.cannon.collider.move(new Vector(xMovement, 0));

          break;
        case " ":
          const bulletPosition = new Vector(
            this.cannon.position.x,
            this.cannon.position.y - sprites.sizes.cannon.h
          );

          throttledSpawnBullet(bulletPosition, -3);
          break;
      }
    });
  }

  createAnimation = (prefix: string) => {
    this.anims.create({
      key: prefix + "Idle",
      frames: this.anims.generateFrameNames("sprites", {
        prefix: prefix,
        start: 1,
        end: 2,
      }),
      frameRate: 2,
      repeat: -1,
    });
  };

  spawnBullet = (center: Vector, speed: number) => {
    const bulletRadius = 4;

    const bullet = this.add.circle(center.x, center.y, bulletRadius, 0xffffff);

    const bulletCollider = new Collider(
      new Circle(center, bulletRadius),
      new Vector(0, 0),
      "bullet"
    );

    this.bullets.push({
      sprite: bullet,
      position: { x: center.x, y: center.y },
      collider: bulletCollider,
      speed,
    });
  };

  update = (time: number, delta: number) => {
    const previousSecond = Math.floor((time - delta) / this.aliensMoveInterval);
    const currentSecond = Math.floor(time / this.aliensMoveInterval);

    if (previousSecond !== currentSecond) {
      const isCollidingBounds = this.aliens.some(({ collider }) => {
        return !collider.inBounds(
          new Vector(GAME_WIDTH * 0.1, GAME_HEIGHT * 0.9),
          new Vector(GAME_WIDTH * 0.9, GAME_HEIGHT * 0.1)
        );
      });

      const isCollidingBottom = this.aliens.some(({ collider }) => {
        return collider.inBounds(
          new Vector(GAME_WIDTH * 0.1, GAME_HEIGHT * 0.9),
          new Vector(GAME_WIDTH * 0.9, GAME_HEIGHT * 0.8)
        );
      });

      if (isCollidingBottom) {
        gameState.status = "lose";
        this.scene.start("GameOver");

        return;
      }

      if (isCollidingBounds) {
        this.moveAliensLeft = !this.moveAliensLeft;
      }

      if (!IS_DEBUG) {
        this.aliens.forEach(({ sprite, position, collider }) => {
          const xMovement = this.moveAliensLeft ? -10 : 10;
          const yMovement = isCollidingBounds ? 20 : 0;

          position.x += xMovement;
          position.y += yMovement;
          sprite.x += xMovement;
          sprite.y += yMovement;
          collider.move(new Vector(xMovement, yMovement));
        });
      }
    }

    this.bullets = this.bullets.filter(({ position, sprite }) => {
      if (position.y < 20 || position.y > GAME_HEIGHT * 0.9) {
        sprite.destroy();

        return false;
      }

      return true;
    });

    this.bullets.forEach(({ sprite, position, collider, speed }) => {
      position.y += speed;
      sprite.y += speed;
      collider.move(new Vector(0, speed));

      if (IS_DEBUG) {
        this.add.circle(
          collider.gameObject.center.x,
          collider.gameObject.center.y,
          collider.gameObject.radius,
          0xff0000
        );
      }
    });

    quadTree(
      [
        ...this.bullets.map((bullet) => bullet.collider),
        ...this.aliens.map((alien) => alien.collider),
        ...this.bunkers.map((bunker) => bunker.collider),
        this.cannon.collider,
      ],
      [new Vector(0, 600), new Vector(800, 0)],
      (first, second) => {
        if (first.name === "bullet") {
          const bullet = this.bullets.find(
            (bullet) => bullet.collider === first
          );

          if (!bullet) return;

          if (second.name === "bullet") {
            const secondBullet = this.bullets.find(
              (bullet) => bullet.collider === second
            );

            if (!secondBullet) return;

            secondBullet.sprite.destroy();
            this.bullets = this.bullets.filter((item) => item !== secondBullet);
          }

          if (second.name === "alien") {
            const alien = this.aliens.find(
              (alien) => alien.collider === second
            );

            if (!alien) return;

            alien.sprite.destroy();

            this.aliens = this.aliens.filter((item) => item !== alien);

            gameState.score += 1;
          }

          if (second.name === "bunker") {
            const bunker = this.bunkers.find(
              (bunker) => bunker.collider === second
            );

            if (!bunker) return;

            bunker.hp -= 1;

            if (bunker.hp === 0) {
              bunker.sprite.destroy();
              bunker.text.destroy();

              this.bunkers = this.bunkers.filter((item) => item !== bunker);
            } else {
              bunker.text.setText(`${bunker.hp}`);
            }
          }

          if (second.name === "cannon") {
            this.hp -= 1;

            if (this.hp === 0) {
              gameState.status = "lose";
              this.scene.start("GameOver");
            } else {
              this.hitPointsIndicator[this.hp].destroy();
            }
          }

          bullet.sprite.destroy();

          this.bullets = this.bullets.filter((item) => item !== bullet);
        }
      }
    );

    if (this.aliens.length === 0) {
      gameState.status = "won";
      this.scene.start("GameOver");

      return;
    }

    for (let i = this.aliens.length - 1; i >= 0; i--) {
      const alien = this.aliens[i];
      const prevAlien = this.aliens[i + 1];

      if (i === this.aliens.length - 1 || alien.xIndex !== prevAlien.xIndex) {
        const fireChance = Math.random();

        if (fireChance < ALIEN_FIRE_CHANCE) {
          this.spawnBullet(
            new Vector(
              alien.position.x,
              alien.position.y + alien.collider.gameObject.radius + 10
            ),
            3
          );
        }
      }
    }

    this.aliensMoveInterval =
      (this.aliensMoveMaxInterval - this.aliensMoveMinInterval) *
        (this.aliens.length / this.aliensCount) +
      this.aliensMoveMinInterval;
  };
}

class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create = () => {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Game Over", {
        fontSize: "32px",
        fontStyle: "bold",
        color: "#00FF00",
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 32 + 10,
        `You ${gameState.status}`,
        {
          fontSize: "24px",
          fontStyle: "bold",
          color: "#00FF00",
        }
      )
      .setOrigin(0.5, 0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + +32 + 10 + 24 + 10,
        `Score: ${gameState.score}`,
        {
          fontSize: "14px",
          color: "#00FF00",
        }
      )
      .setOrigin(0.5, 0.5);

    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        this.scene.start("Level");
      }
    });
  };
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [Boot, Level, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
    },
  },
};

new Phaser.Game(config);
