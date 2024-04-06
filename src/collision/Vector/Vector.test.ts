import { Vector } from "./Vector";

describe("Vector tests", () => {
  it("init test", () => {
    const x = Math.random();
    const y = Math.random();

    const point = new Vector(x, y);

    expect(point.x).toBe(x);
    expect(point.y).toBe(y);
  });

  it("add test", () => {
    const x1 = Math.random();
    const y1 = Math.random();
    const x2 = Math.random();
    const y2 = Math.random();

    const firstPoint = new Vector(x1, y1);
    const secondPoint = new Vector(x2, y2);

    const thirdPoint = firstPoint.add(secondPoint);

    expect(thirdPoint.x).toBe(x1 + x2);
    expect(thirdPoint.y).toBe(y1 + y2);
  });

  it("distance test", () => {
    const firstPoint = new Vector(0, 0);
    const secondPoint = new Vector(3, 4);

    const distance = firstPoint.distanceTo(secondPoint);

    expect(distance).toBe(5);
  });

  it("isEqual test", () => {
    const point = new Vector(Math.random(), Math.random());

    expect(point.isEqual(point)).toBe(true);
  });
});
