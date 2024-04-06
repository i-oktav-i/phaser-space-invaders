import { Circle } from "../Circle";
import { Hexagon } from "../Hexagon";
import { Vector } from "../Vector";
import { Triangle } from "../Triangle";
import { GameObject } from "../GameObject";

const colorsMap = {
  3: "#ff0000",
  2: "#00ff00",
  1: "#0000ff",
};

export class Collider {
  private _hp: number = 3;
  public get hp(): number {
    return this._hp;
  }
  private set hp(v: number) {
    this._hp = v;
  }

  constructor(
    readonly gameObject: Triangle | Circle | Hexagon,
    private velocity: Vector,
    readonly name?: string
  ) {}

  checkCollision(other: Collider) {
    if (this.gameObject instanceof Circle) {
      if (other.gameObject instanceof Circle) {
        return (
          this.gameObject.center.distanceTo(other.gameObject.center) <=
          this.gameObject.radius + other.gameObject.radius
        );
      }

      return (
        other.gameObject.contains(this.gameObject.center) ||
        other.gameObject
          .distanceToEdges(this.gameObject.center)
          .every((distance) => distance <= this.gameObject.radius)
      );
    }

    if (
      this.gameObject instanceof Triangle ||
      this.gameObject instanceof Hexagon
    ) {
      if (
        other.gameObject instanceof Triangle ||
        other.gameObject instanceof Hexagon
      ) {
        return Object.values(other.gameObject.edges).some(
          this.gameObject.isCrossing
        );
      }

      return (
        this.gameObject.contains(other.gameObject.center) ||
        this.gameObject
          .distanceToEdges(other.gameObject.center)
          .every((distance) => distance <= other.gameObject.radius)
      );
    }

    console.log("here");

    return false;
  }

  checkBoundsCollision(topLeft: Vector, bottomRight: Vector) {
    return [
      this.gameObject.relativeToHorizontal(topLeft.y),
      this.gameObject.relativeToHorizontal(bottomRight.y),
      this.gameObject.relativeToVertical(topLeft.x),
      this.gameObject.relativeToVertical(bottomRight.x),
    ].some((item) => item === GameObject.Relation.Between);
  }

  inBounds(topLeft: Vector, bottomRight: Vector) {
    return (
      [
        this.gameObject.relativeToHorizontal(topLeft.y),
        this.gameObject.relativeToVertical(bottomRight.x),
      ].every(
        (item) =>
          item === GameObject.Relation.Between ||
          item === GameObject.Relation.Before
      ) &&
      [
        this.gameObject.relativeToHorizontal(bottomRight.y),
        this.gameObject.relativeToVertical(topLeft.x),
      ].every(
        (item) =>
          item === GameObject.Relation.Between ||
          item === GameObject.Relation.After
      )
    );
  }

  relativeToHorizontal = (y: number) => this.gameObject.relativeToHorizontal(y);
  relativeToVertical = (x: number) => this.gameObject.relativeToVertical(x);

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = colorsMap[this.hp as keyof typeof colorsMap] || "#00000000";
    this.gameObject.draw(ctx);
  };

  move = (delta?: Vector) => {
    this.gameObject.move(delta ?? this.velocity);
  };

  setCenter = (newCenter: Vector) => {
    this.gameObject.setCenter(newCenter);
  };

  invertVelocity() {
    this.velocity = new Vector(-this.velocity.x, -this.velocity.y);
  }

  dealDamage() {
    this.hp -= 1;
  }
}
