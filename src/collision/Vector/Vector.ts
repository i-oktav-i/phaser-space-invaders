export class Vector {
  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  distanceTo(other: Vector) {
    return ((this.x - other.x) ** 2 + (this.y - other.y) ** 2) ** 0.5;
  }

  isEqual(other: Vector) {
    return this.x === other.x && this.y === other.y;
  }

  scale(scale: number) {
    return new Vector(this.x * scale, this.y * scale);
  }
}
