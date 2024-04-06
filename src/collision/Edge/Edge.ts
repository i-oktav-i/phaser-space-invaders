import { Vector } from "../Vector";

export class Edge {
  private argumentMultiplier: number | null;
  private constant: number;
  private leftPoint: Vector;
  private rightPoint: Vector;
  private divider: number;

  constructor(firstPoint: Vector, secondPoint: Vector) {
    if (firstPoint.x === secondPoint.x) {
      if (firstPoint.y === secondPoint.y) throw new Error("Same points");
    }

    const [leftPoint, rightPoint] = [firstPoint, secondPoint].sort(
      (left, right) => left.x - right.x || left.y - right.y
    );

    this.leftPoint = leftPoint;
    this.rightPoint = rightPoint;

    if (firstPoint.x === secondPoint.x) {
      this.constant = firstPoint.x;
      this.argumentMultiplier = null;
      this.divider = 1;
    } else {
      this.argumentMultiplier =
        (firstPoint.y - secondPoint.y) / (firstPoint.x - secondPoint.x);

      this.constant = firstPoint.y - this.argumentMultiplier * firstPoint.x;

      this.divider = (1 + this.argumentMultiplier ** 2) ** 0.5;
    }
  }

  isCrossing(other: Edge) {
    if (this.argumentMultiplier === other.argumentMultiplier) {
      if (this.constant !== other.constant) return false;

      return this.argumentMultiplier === null
        ? (this.leftPoint.y <= other.rightPoint.y &&
            this.rightPoint.y >= other.leftPoint.y) ||
            (other.rightPoint.y <= this.leftPoint.y &&
              other.leftPoint.y >= this.rightPoint.y)
        : (this.leftPoint.x <= other.rightPoint.x &&
            this.rightPoint.x >= other.leftPoint.x) ||
            (other.rightPoint.x <= this.leftPoint.x &&
              other.leftPoint.x >= this.rightPoint.x);
    }

    if (this.argumentMultiplier === null || other.argumentMultiplier === null) {
      const [vertical, secondEdge] = [this, other].sort((edge) =>
        edge.argumentMultiplier === null ? -1 : 1
      );

      if (secondEdge.argumentMultiplier === 0) {
        return (
          secondEdge.leftPoint.x <= vertical.constant &&
          secondEdge.rightPoint.x >= vertical.constant &&
          vertical.leftPoint.y <= secondEdge.constant &&
          vertical.rightPoint.y >= secondEdge.constant
        );
      }

      const crossY =
        (-secondEdge.constant / secondEdge.argumentMultiplier! -
          vertical.constant) *
        -secondEdge.argumentMultiplier!;

      return (
        vertical.leftPoint.y <= crossY &&
        vertical.rightPoint.y >= crossY &&
        (secondEdge.leftPoint.y <= secondEdge.rightPoint.y
          ? secondEdge.leftPoint.y <= crossY &&
            secondEdge.rightPoint.y >= crossY
          : secondEdge.leftPoint.y >= crossY &&
            secondEdge.rightPoint.y <= crossY)
      );
    }

    const crossX =
      (other.constant - this.constant) /
      (this.argumentMultiplier - other.argumentMultiplier);

    return (
      this.leftPoint.x <= crossX &&
      this.rightPoint.x >= crossX &&
      other.leftPoint.x <= crossX &&
      other.rightPoint.x >= crossX
    );
  }

  distanceTo(point: Vector) {
    if (this.argumentMultiplier === null) return this.constant - point.x;

    return (
      (-point.y + this.argumentMultiplier * point.x + this.constant) /
      this.divider
    );
  }
}
