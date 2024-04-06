import { Vector } from "../Vector";
import { randomNumber } from "../utils";
import { GameObject } from "./GameObject";

describe("GameObject tests", () => {
  it("Init test", () => {
    const center = new Vector(randomNumber(1, 10), randomNumber(1, 10));
    const radius = randomNumber(1, 10);
    const gm = new GameObject(center, radius);

    expect(gm.center.x).toBe(center.x);
    expect(gm.center.y).toBe(center.y);
    expect(gm.radius).toBe(radius);
  });

  it("Move test", () => {
    const center = new Vector(randomNumber(1, 10), randomNumber(1, 10));
    const radius = randomNumber(1, 10);
    const gm = new GameObject(center, radius);

    const diff = new Vector(randomNumber(1, 10), randomNumber(1, 10));
    const result = center.add(diff);

    gm.move(diff);

    expect(gm.center.x).toBe(result.x);
    expect(gm.center.y).toBe(result.y);
  });

  describe("Relation to line test", () => {
    const center = new Vector(randomNumber(1, 10), randomNumber(1, 10));
    const radius = randomNumber(1, 10);
    const gm = new GameObject(center, radius);

    it("far", () => {
      const leftVertical = center.x - 10 * radius;
      const rightVertical = center.x + 10 * radius;

      const bottomHorizontal = center.y - 10 * radius;
      const topHorizontal = center.y + 10 * radius;

      expect(gm.relativeToHorizontal(bottomHorizontal)).toBe(
        GameObject.Relation.After
      );
      expect(gm.relativeToHorizontal(topHorizontal)).toBe(
        GameObject.Relation.Before
      );

      expect(gm.relativeToVertical(leftVertical)).toBe(
        GameObject.Relation.After
      );
      expect(gm.relativeToVertical(rightVertical)).toBe(
        GameObject.Relation.Before
      );
    });

    it("touch", () => {
      const leftVertical = center.x - radius;
      const rightVertical = center.x + radius;

      const bottomHorizontal = center.y - radius;
      const topHorizontal = center.y + radius;

      expect(gm.relativeToHorizontal(bottomHorizontal)).toBe(
        GameObject.Relation.Between
      );
      expect(gm.relativeToHorizontal(topHorizontal)).toBe(
        GameObject.Relation.Between
      );

      expect(gm.relativeToVertical(leftVertical)).toBe(
        GameObject.Relation.Between
      );
      expect(gm.relativeToVertical(rightVertical)).toBe(
        GameObject.Relation.Between
      );
    });

    it("inside", () => {
      expect(gm.relativeToHorizontal(center.y)).toBe(
        GameObject.Relation.Between
      );

      expect(gm.relativeToVertical(center.x)).toBe(GameObject.Relation.Between);
    });
  });
});
