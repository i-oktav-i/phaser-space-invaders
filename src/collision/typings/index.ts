export type Point = {
  x: number;
  y: number;
};

export type GameObject = {
  draw: (context: CanvasRenderingContext2D) => void;
  contains: (point: Point) => boolean;
  checkCollision: (other: GameObject) => boolean;
};
