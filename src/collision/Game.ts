import { Circle } from "./Circle";
import { Collider } from "./Collider";
import { Hexagon } from "./Hexagon";
import { quadTree } from "./QuadTree";
import { Triangle } from "./Triangle";
import { Vector } from "./Vector";
import { randomNumber } from "./utils";

export class Game {
  private readonly canvas: HTMLCanvasElement;
  private drawContext: CanvasRenderingContext2D;

  private objects: Collider[] = [];

  private lastTick = 0;
  private lastRender = 0;

  private fpsBufferLength = 5;
  private fpsBuffer: number[] = [];

  private animationFrameId = 0;

  private gameObjectsConstructors = [Circle, Triangle, Hexagon];

  private readonly config = {
    radius: { max: 8, min: 2 },
    speed: { max: -2, min: 2 },
    scale: 4,
    tickLength: 15,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    canvas.width = innerWidth * this.config.scale;
    canvas.height = innerHeight * this.config.scale;

    const context = canvas.getContext("2d");

    if (!context) throw new Error("no canvas context");

    this.drawContext = context;

    this.clearCanvas();
    this.drawHud(0);
  }

  run = (count: number) => {
    this.init(count);
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  init = (count: number) => {
    this.fpsBuffer = [];
    this.lastTick = performance.now();
    this.lastRender = performance.now();

    this.createObjects(count);
    this.draw();
  };

  tick = (time = 0) => {
    this.animationFrameId = requestAnimationFrame(this.tick);

    const nextTick = this.lastTick + this.config.tickLength;
    let numTicks = 0;

    if (time > nextTick) {
      const timeSinceTick = time - this.lastTick;
      numTicks = Math.floor(timeSinceTick / this.config.tickLength);
    }
    this.queueUpdates(numTicks);
    this.draw();
    this.processFps(time);
  };

  processFps = (time: number) => {
    const fps = Math.floor(1000 / (time - this.lastRender || 1));

    this.fpsBuffer = [
      fps,
      ...this.fpsBuffer.slice(0, this.fpsBufferLength - 1),
    ];

    const avgFps =
      this.fpsBuffer.reduce((memo, item) => memo + item, 0) /
      this.fpsBuffer.length;

    this.drawHud(avgFps);
    this.lastRender = time;
  };

  drawHud = (fps: number) => {
    this.drawContext.fillStyle = "#00000044";

    const fontSize = 48 * this.config.scale;

    this.drawContext.font = `${fontSize}px serif`;

    this.drawContext.fillText(`fps: ${fps.toFixed(0)}`, fontSize, fontSize);
    this.drawContext.fillText(
      `objects count: ${this.objects.length}`,
      fontSize,
      fontSize * 2.5
    );
    this.drawContext.fillText(`R to Restart`, fontSize, fontSize * 4);
  };

  queueUpdates = (numTicks: number) => {
    for (let i = 0; i < numTicks; i++) {
      this.lastTick = this.lastTick + this.config.tickLength;
      this.update();
    }
  };

  update = () => {
    this.move();
    this.processCollisionsByQuadTree();

    this.objects = this.objects.filter((item) => item.hp > 0);

    this.checkBounds();
  };

  move = () => {
    this.objects.forEach((gm) => gm.move());
  };

  draw = () => {
    this.clearCanvas();
    this.objects.forEach((gm) => gm.draw(this.drawContext));
  };

  checkBounds = () => {
    this.objects.forEach((gm) => {
      if (
        gm.checkBoundsCollision(
          new Vector(0, this.canvas.height),
          new Vector(this.canvas.width, 0)
        )
      ) {
        gm.invertVelocity();
      }
    });
  };

  processCollisionsByQuadTree = () => {
    quadTree(
      this.objects,
      [new Vector(0, this.canvas.height), new Vector(this.canvas.width, 0)],
      (...colliders) => {
        colliders.forEach((collider) => {
          collider.dealDamage();
          collider.invertVelocity();
        });
      }
    );
  };

  processCollisions = () => {
    this.objects.forEach((gameObject, index) => {
      this.objects.slice(index + 1).forEach((otherGameObject) => {
        if (!gameObject.checkCollision(otherGameObject)) return;

        [gameObject, otherGameObject].forEach((collider) => {
          collider.dealDamage();
          collider.invertVelocity();
        });
      });
    });
  };

  createObjects = (count: number) => {
    const params = Array.from(
      Array(count),
      () =>
        [
          new Vector(
            randomNumber(
              this.config.radius.max,
              this.canvas.width - this.config.radius.max
            ),
            randomNumber(
              this.config.radius.max,
              this.canvas.height - this.config.radius.max
            )
          ),
          randomNumber(this.config.radius.min, this.config.radius.max),
          new Vector(
            randomNumber(this.config.speed.min, this.config.speed.max),
            randomNumber(this.config.speed.min, this.config.speed.max)
          ),
        ] as const
    );

    this.objects = params.map(([center, radius, velocity]) => {
      const gmClass = this.randomObjectConstructor;

      return new Collider(new gmClass(center, radius), velocity);
    });
  };

  get randomObjectConstructor() {
    return this.gameObjectsConstructors[
      randomNumber(0, this.gameObjectsConstructors.length - 1)
    ];
  }

  clearCanvas = () => {
    this.canvas.width = this.canvas.width;
  };
}
