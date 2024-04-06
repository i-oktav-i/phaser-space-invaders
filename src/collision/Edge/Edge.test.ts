import { Vector } from "../Vector";
import { Edge } from "./Edge";

describe("Edge tests", () => {
  it("cross on vertices", () => {
    const zeroPoint = new Vector(0, 0);
    const positiveX = new Vector(10, 0);
    const negativeX = new Vector(-10, 0);
    const positiveY = new Vector(0, 10);
    const negativeY = new Vector(0, -10);

    const positiveXPositiveY = new Vector(10, 10);
    const negativeXPositiveY = new Vector(-10, 10);
    const positiveXNegativeY = new Vector(10, -10);
    const negativeXNegativeY = new Vector(-10, -10);

    const points = [
      positiveX,
      negativeX,
      positiveY,
      negativeY,
      positiveXPositiveY,
      positiveXNegativeY,
      negativeXPositiveY,
      negativeXNegativeY,
    ];

    const results = points.flatMap((firstPoint) =>
      points.flatMap((secondPoint) => {
        const firstEdge = new Edge(zeroPoint, firstPoint);
        const secondEdge = new Edge(zeroPoint, secondPoint);

        return [
          firstEdge.isCrossing(secondEdge),
          secondEdge.isCrossing(firstEdge),
        ];
      })
    );

    expect(results).not.toEqual(expect.arrayContaining([false]));
  });

  it("cross between vertices", () => {
    const positiveX = new Vector(10, 0);
    const negativeX = new Vector(-10, 0);
    const positiveY = new Vector(0, 10);
    const negativeY = new Vector(0, -10);

    const positiveXPositiveY = new Vector(10, 10);
    const negativeXPositiveY = new Vector(-10, 10);
    const positiveXNegativeY = new Vector(10, -10);
    const negativeXNegativeY = new Vector(-10, -10);

    const points = [
      positiveX,
      negativeX,
      positiveY,
      negativeY,
      positiveXPositiveY,
      positiveXNegativeY,
      negativeXPositiveY,
      negativeXNegativeY,
    ];

    const results = points.flatMap((firstPoint) =>
      points.flatMap((secondPoint) => {
        const firstEdge = new Edge(firstPoint, firstPoint.scale(-1));
        const secondEdge = new Edge(secondPoint, secondPoint.scale(-1));

        return [
          firstEdge.isCrossing(secondEdge),
          secondEdge.isCrossing(firstEdge),
        ];
      })
    );

    expect(results).not.toEqual(expect.arrayContaining([false]));
  });

  it("does not cross", () => {
    const firstEdgeFirstPoint = new Vector(0, 0);
    const firstEdgeSecondPoint = new Vector(10, 0);

    const secondEdgeFirstPoint = new Vector(0, 10);
    const secondEdgeSecondPoint = new Vector(10, 10);

    const modifiers = [new Vector(0, 0), new Vector(0, 10)];

    const results = modifiers.flatMap((modifier) => {
      const firstEdge = new Edge(
        firstEdgeFirstPoint,
        firstEdgeSecondPoint.add(modifier)
      );
      const secondEdge = new Edge(
        secondEdgeFirstPoint,
        secondEdgeSecondPoint.add(modifier)
      );

      return [
        firstEdge.isCrossing(secondEdge),
        secondEdge.isCrossing(firstEdge),
      ];
    });

    expect(results).not.toEqual(expect.arrayContaining([true]));
  });
});
