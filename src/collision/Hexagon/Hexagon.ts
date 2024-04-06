import { Edge } from "../Edge/Edge";
import { GameObject } from "../GameObject";
import { Vector } from "../Vector";
import { objectEntries, objectFromEntries } from "../utils";

export class Hexagon extends GameObject {
  private _edge: number;

  public get edge(): number {
    return this._edge;
  }

  private triageHeight: number;
  private halfEdge: number;

  private _normalVertices: Readonly<
    Record<Uncapitalize<`${"bottom" | "" | "top"}${"Left" | "Right"}`>, Vector>
  >;
  private _vertices!: typeof this._normalVertices;

  public get vertices() {
    return this._vertices;
  }

  private _edges!: Readonly<
    Record<Uncapitalize<`${"bottom" | "top"}${"Left" | "" | "Right"}`>, Edge>
  >;

  public get edges() {
    return this._edges;
  }
  private set edges(value) {
    this._edges = value;
  }

  constructor(center: Vector, edge: number) {
    super(center, edge);
    this.triageHeight = (Hexagon.sqrt3 * edge) / 2;
    // this.triageHeight = ((3 / 4) * edge ** 2) ** 0.5 / 2;
    this.halfEdge = edge / 2;

    this._edge = edge;

    this._normalVertices = {
      bottomLeft: new Vector(-this.halfEdge, -this.triageHeight),
      bottomRight: new Vector(this.halfEdge, -this.triageHeight),
      left: new Vector(-edge, 0),
      right: new Vector(edge, 0),
      topLeft: new Vector(-this.halfEdge, this.triageHeight),
      topRight: new Vector(this.halfEdge, this.triageHeight),
    };

    this.solve();
  }

  move(delta: Vector) {
    super.move(delta);
    this.solve();
  }

  solve = () => {
    this._vertices = objectFromEntries(
      objectEntries(this._normalVertices).map(([key, value]) => [
        key,
        value.add(this.center),
      ])
    );

    this.edges = {
      bottom: new Edge(this.vertices.bottomLeft, this.vertices.bottomRight),
      bottomLeft: new Edge(this.vertices.bottomLeft, this.vertices.left),
      bottomRight: new Edge(this.vertices.bottomRight, this.vertices.right),
      top: new Edge(this.vertices.topLeft, this.vertices.topRight),
      topLeft: new Edge(this.vertices.topLeft, this.vertices.left),
      topRight: new Edge(this.vertices.topRight, this.vertices.right),
    };
  };

  contains = (point: Vector) => {
    this.distanceToEdges(point).every((distance) => distance <= 0);
  };

  distanceToEdges(point: Vector) {
    return [
      this.edges.bottom.distanceTo(point),
      -this.edges.top.distanceTo(point),
      this.edges.bottomLeft.distanceTo(point),
      this.edges.bottomRight.distanceTo(point),
      -this.edges.topLeft.distanceTo(point),
      -this.edges.topRight.distanceTo(point),
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
    const order: (keyof typeof this.vertices)[] = [
      "topLeft",
      "topRight",
      "right",
      "bottomRight",
      "bottomLeft",
      "left",
    ];

    order.forEach((key) => {
      ctx.lineTo(this.vertices[key].x, this.vertices[key].y);
    });

    ctx.fill();
  };

  static sqrt3 = 3 ** 0.5;
}
