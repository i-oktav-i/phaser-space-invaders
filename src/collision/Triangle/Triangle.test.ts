import { Vector } from "../Vector";
import { randomNumber } from "../utils";
import { Triangle } from "./Triangle";

describe("Triangle tests", () => {
  const center = new Vector(randomNumber(1, 10), randomNumber(1, 10));
  const radius = randomNumber(1, 10);
  const height = (radius * 3) / 2;
  const triage = new Triangle(center, radius);

  describe("contains tests", () => {
    it("center", () => {
      expect(triage.contains(triage.center)).toBe(true);
    });

    it("vertices", () => {
      const results = Object.values(triage.vertices).map((point) =>
        triage.contains(point)
      );

      expect(results).not.toContain(false);
    });

    it("point on edge", () => {
      const point = new Vector(
        (triage.vertices.left.x + triage.vertices.right.x) / 2,
        triage.vertices.left.y
      );

      expect(triage.contains(point)).toBe(true);
    });

    it("far", () => {
      const point = new Vector(center.x + radius, center.y);

      expect(triage.contains(point)).toBeFalsy();
    });
  });

  describe("distance to edges tests", () => {
    it("center", () => {
      expect(triage.distanceToEdges(center)).toEqual(
        expect.arrayContaining([
          expect.closeTo(-radius / 2),
          expect.closeTo(-radius / 2),
          expect.closeTo(-radius / 2),
        ])
      );
    });
    it("vertices", () => {
      const results = Object.values(triage.vertices).map((point) =>
        triage.distanceToEdges(point)
      );

      expect(results).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            expect.closeTo(0),
            expect.closeTo(0),
            expect.closeTo(-height),
          ]),
          expect.arrayContaining([
            expect.closeTo(0),
            expect.closeTo(0),
            expect.closeTo(-height),
          ]),
          expect.arrayContaining([
            expect.closeTo(0),
            expect.closeTo(0),
            expect.closeTo(-height),
          ]),
        ])
      );
    });

    it("far", () => {
      const point = new Vector(center.x, center.y + radius + height);

      expect.closeTo(-2 * height);
      expect(triage.distanceToEdges(point)).toEqual(
        expect.arrayContaining([
          expect.closeTo(-2 * height),
          expect.closeTo(height / 2),
          expect.closeTo(height / 2),
        ])
      );
    });
  });
});
