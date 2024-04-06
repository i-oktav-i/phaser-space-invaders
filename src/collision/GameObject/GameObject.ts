import { Vector } from "../Vector";

export class GameObject {
  private _center: Vector;
  public get center(): Vector {
    return this._center;
  }
  protected set center(value: Vector) {
    this._center = value;
  }

  private _radius: number;
  public get radius(): number {
    return this._radius;
  }
  protected set radius(value: number) {
    this._radius = value;
  }

  constructor(center: Vector, radius: number) {
    this._center = center;
    this._radius = radius;
  }

  move(delta: Vector) {
    this.center = this.center.add(delta);
  }

  setCenter(newCenter: Vector) {
    this.center = newCenter;
  }

  relativeToHorizontal(y: number) {
    if (this.center.y + this.radius < y) return GameObject.Relation.Before;
    if (this.center.y - this.radius > y) return GameObject.Relation.After;

    return GameObject.Relation.Between;
  }

  relativeToVertical(x: number) {
    if (this.center.x + this.radius < x) return GameObject.Relation.Before;
    if (this.center.x - this.radius > x) return GameObject.Relation.After;

    return GameObject.Relation.Between;
  }

  static readonly Relation = {
    Before: "Before",
    After: "After",
    Between: "Between",
  } as const;
}
