import { Vector } from "../Vector";
import { randomNumber } from "../utils";
import { Hexagon } from "./Hexagon";

describe("Hexagon tests", () => {
  const center = new Vector(randomNumber(1, 10), randomNumber(1, 10));
  const radius = randomNumber(1, 10);
  const height = (radius * Hexagon.sqrt3) / 2;
  const hexagon = new Hexagon(center, radius);

  describe("contains tests", () => {
    it("center", () => {
      expect(hexagon.contains(center)).toBe(true);
    });

    it("vertices", () => {
      expect(
        Object.values(hexagon.vertices).map((point) => hexagon.contains(point))
      ).not.toEqual(expect.arrayContaining([false]));
    });

    it("point on edge", () => {
      const point = new Vector(
        (hexagon.vertices.bottomLeft.x + hexagon.vertices.bottomRight.x) / 2,
        hexagon.vertices.bottomLeft.y
      );

      expect(hexagon.contains(point)).toBe(true);
    });

    it("far", () => {
      const point = new Vector(center.x, center.y + radius);

      expect(hexagon.contains(point)).toBe(false);
    });
  });

  describe("distance to edges tests", () => {
    it("center", () => {
      expect(hexagon.distanceToEdges(center)).toEqual(
        expect.arrayContaining(
          Array.from(Array(6), () => expect.closeTo(-height))
        )
      );
    });

    it("vertices", () => {
      const results = Object.values(hexagon.vertices).map((point) =>
        hexagon.distanceToEdges(point)
      );

      expect(results).toEqual(
        expect.arrayContaining(
          Array.from(Array(6), () =>
            expect.arrayContaining([
              expect.closeTo(0),
              expect.closeTo(0),
              expect.closeTo(-height),
              expect.closeTo(-height),
              expect.closeTo(-2 * height),
              expect.closeTo(-2 * height),
            ])
          )
        )
      );
    });

    it("far", () => {
      const point = new Vector(center.x, center.y + 2 * height);

      expect(hexagon.distanceToEdges(point)).toEqual(
        expect.arrayContaining([
          expect.closeTo(0),
          expect.closeTo(0),
          expect.closeTo(height),
          expect.closeTo(-2 * height),
          expect.closeTo(-2 * height),
          expect.closeTo(-3 * height),
        ])
      );
    });
  });
});
