import { GameObject } from "../GameObject";
import { Vector } from "../Vector";

export class Circle extends GameObject {
  private squareRadius: number;

  constructor(center: Vector, radius: number) {
    super(center, radius);

    this.squareRadius = radius ** 2;
  }

  contains = (point: Vector) => {
    return (
      (point.x - this.center.x) ** 2 + (point.y - this.center.y) ** 2 <=
      this.squareRadius
    );
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
  };
}
