export { default as url } from "../assets/invaders.png";

export const sizes = {
  blue: { w: 22, h: 16 },
  green: { w: 24, h: 16 },
  red: { w: 16, h: 16 },
  cannon: { w: 22, h: 16 },
  bunker: { w: 36, h: 24 },
};

export const frames = [
  {
    filename: "blue1",
    frame: {
      x: 0,
      y: 0,
      ...sizes.blue,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: {
      x: 0,
      y: 0,
      ...sizes.blue,
    },
    sourceSize: sizes.blue,
  },
  {
    filename: "blue2",
    frame: {
      x: 0,
      y: sizes.blue.h,
      ...sizes.blue,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: {
      x: 0,
      y: 0,
      ...sizes.blue,
    },
    sourceSize: sizes.blue,
  },
  {
    filename: "red1",
    frame: {
      x: sizes.blue.w,
      y: 0,
      ...sizes.red,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: {
      x: 0,
      y: 0,
      ...sizes.red,
    },
    sourceSize: sizes.red,
  },
  {
    filename: "red2",
    frame: {
      x: sizes.blue.w,
      y: sizes.red.h,
      ...sizes.red,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: {
      x: 0,
      y: 0,
      ...sizes.red,
    },
    sourceSize: sizes.red,
  },
  {
    filename: "green1",
    frame: {
      x: sizes.blue.w + sizes.red.w,
      y: 0,
      ...sizes.green,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: {
      x: 0,
      y: 0,
      ...sizes.green,
    },
    sourceSize: sizes.green,
  },
  {
    filename: "green2",
    frame: {
      x: sizes.blue.w + sizes.red.w,
      y: sizes.green.h,
      ...sizes.green,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: {
      x: 0,
      y: 0,
      ...sizes.green,
    },
    sourceSize: sizes.green,
  },
  {
    filename: "cannon",
    frame: {
      x: sizes.blue.w + sizes.green.w + sizes.red.w,
      y: 0,
      ...sizes.cannon,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: { x: 0, y: 0, ...sizes.cannon },
    sourceSize: sizes.cannon,
  },
  {
    filename: "bunker",
    frame: {
      x: sizes.blue.w + sizes.green.w + sizes.red.w + 22,
      y: 8,
      ...sizes.bunker,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: { x: 0, y: 0, ...sizes.bunker },
    sourceSize: sizes.bunker,
  },
];
