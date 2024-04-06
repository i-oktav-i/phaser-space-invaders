import { Edge } from "../Edge/Edge";
import { GameObject } from "../GameObject";
import { Vector } from "../Vector";
import { objectEntries, objectFromEntries } from "../utils";

export class Triangle extends GameObject {
  private oneThirdHeight: number;
  readonly _normalVertices: Readonly<Record<"top" | "left" | "right", Vector>>;

  private _edges!: Readonly<Record<"bottom" | "left" | "right", Edge>>;
  public get edges() {
    return this._edges;
  }
  public set edges(value) {
    this._edges = value;
  }

  private _vertices!: typeof this._normalVertices;

  constructor(center: Vector, radius: number) {
    super(center, radius);

    this.oneThirdHeight = radius / 2;

    const edge = Triangle.sqrt3 * radius;

    this._normalVertices = {
      top: new Vector(0, -this.oneThirdHeight * 2),
      left: new Vector(-edge / 2, this.oneThirdHeight),
      right: new Vector(edge / 2, this.oneThirdHeight),
    };

    this.solve();
  }

  move(delta: Vector) {
    super.move(delta);
    this.solve();
  }

  solve() {
    this._vertices = objectFromEntries(
      objectEntries(this._normalVertices).map(([key, value]) => [
        key,
        value.add(this.center),
      ])
    );

    this.edges = {
      bottom: new Edge(this.vertices.left, this.vertices.right),
      left: new Edge(this.vertices.left, this.vertices.top),
      right: new Edge(this.vertices.right, this.vertices.top),
    };
  }

  get vertices() {
    return this._vertices;
  }

  contains = (point: Vector) => {
    return this.distanceToEdges(point).every((distance) => distance <= 0);
  };

  distanceToEdges(point: Vector) {
    return [
      -this.edges.bottom.distanceTo(point),
      this.edges.left.distanceTo(point),
      this.edges.right.distanceTo(point),
    ];
  }

  isCrossing = (edge: Edge) => {
    return Object.values(this.edges).some((selfEdge) =>
      selfEdge.isCrossing(edge)
    );
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();

    ctx.moveTo(this.vertices.left.x, this.vertices.left.y);
    const order: (keyof typeof this.vertices)[] = ["top", "right", "left"];

    order.forEach((key) => {
      ctx.lineTo(this.vertices[key].x, this.vertices[key].y);
    });

    ctx.fill();
  };

  private static sqrt3 = 3 ** 0.5;
}
