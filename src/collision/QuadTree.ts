import { Collider } from "./Collider";
import { GameObject } from "./GameObject";
import { Vector } from "./Vector";

export const quadTree = (
  colliders: Collider[],
  bounds: [topLeft: Vector, bottomRight: Vector],
  onCollide: (first: Collider, second: Collider) => void,
  capacity = 4,
  d = 0
) => {
  const topLeft: Collider[] = [];
  const topRight: Collider[] = [];
  const bottomLeft: Collider[] = [];
  const bottomRight: Collider[] = [];

  const [topLeftBound, bottomRightBound] = bounds;

  const center = new Vector(
    (bottomRightBound.x + topLeftBound.x) / 2,
    (topLeftBound.y + bottomRightBound.y) / 2
  );

  colliders.forEach((collider) => {
    const horizontal = collider.relativeToHorizontal(center.y);
    const vertical = collider.relativeToVertical(center.x);

    if (vertical !== GameObject.Relation.After) {
      if (horizontal !== GameObject.Relation.After) {
        bottomLeft.push(collider);
      }

      if (horizontal !== GameObject.Relation.Before) {
        topLeft.push(collider);
      }
    }

    if (vertical !== GameObject.Relation.Before) {
      if (horizontal !== GameObject.Relation.After) {
        bottomRight.push(collider);
      }

      if (horizontal !== GameObject.Relation.Before) {
        topRight.push(collider);
      }
    }
  });

  const groupsInfo: [Collider[], [Vector, Vector]][] = [
    [topLeft, [topLeftBound, center]],
    [
      topRight,
      [
        new Vector(center.x, topLeftBound.y),
        new Vector(bottomRightBound.x, center.y),
      ],
    ],
    [
      bottomLeft,
      [
        new Vector(topLeftBound.x, center.y),
        new Vector(center.x, bottomRightBound.y),
      ],
    ],
    [bottomRight, [center, bottomRightBound]],
  ];

  groupsInfo.forEach(([group, groupBounds]) => {
    // console.log("group.length", group.length, d);
    if (group.length > capacity) {
      quadTree(group, groupBounds, onCollide, capacity, d + 1);
    } else {
      group.forEach((gameObject, index) => {
        group.slice(index + 1).forEach((otherGameObject) => {
          if (!gameObject.checkCollision(otherGameObject)) return;

          onCollide(gameObject, otherGameObject);
        });
      });
    }
  });
};
