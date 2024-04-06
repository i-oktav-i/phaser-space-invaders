import { Circle } from "../Circle";
import { Vector } from "../Vector";
import { randomNumber } from "../utils";
import { Collider } from "./Collider";

const zero = new Vector(0, 0);

describe("Collider tests", () => {
  describe("circle", () => {
    describe("circle", () => {
      it("far", () => {
        const firstRadius = randomNumber(1, 100);
        const secondRadius = randomNumber(1, 100);
        const firstCenter = new Vector(0, 0);
        const secondCenter = new Vector(0, firstRadius + secondRadius + 1);

        const firstCollider = new Collider(
          new Circle(firstCenter, firstRadius),
          zero
        );
        const secondCollider = new Collider(
          new Circle(secondCenter, secondRadius),
          zero
        );

        expect(firstCollider.checkCollision(secondCollider)).toBeFalsy();
        expect(secondCollider.checkCollision(firstCollider)).toBeFalsy();
      });

      it("touch", () => {
        const firstRadius = randomNumber(1, 100);
        const secondRadius = randomNumber(1, 100);
        const firstCenter = new Vector(0, 0);
        const secondCenter = new Vector(0, firstRadius + secondRadius);
        const thirdCenter = new Vector(firstRadius + secondRadius, 0);

        const firstCollider = new Collider(
          new Circle(firstCenter, firstRadius),
          zero
        );
        const secondCollider = new Collider(
          new Circle(secondCenter, secondRadius),
          zero
        );
        const thirdCollider = new Collider(
          new Circle(thirdCenter, secondRadius),
          zero
        );

        expect(firstCollider.checkCollision(secondCollider)).toBe(true);
        expect(secondCollider.checkCollision(firstCollider)).toBe(true);

        expect(firstCollider.checkCollision(thirdCollider)).toBe(true);
        expect(thirdCollider.checkCollision(firstCollider)).toBe(true);

        expect(secondCollider.checkCollision(thirdCollider)).toBeFalsy();
        expect(thirdCollider.checkCollision(secondCollider)).toBeFalsy();
      });
    });
  });
});
