export const getGrid = (
  cellSize: number,
  rows: number,
  cols: number,
  startX: number,
  startY: number
) => {
  return Array.from({ length: cols }, (_, col) => {
    return Array.from({ length: rows }, (_, row) => {
      return {
        x: col * cellSize + startX,
        y: row * cellSize + startY,
        width: cellSize,
        height: cellSize,
        centerX: col * cellSize + cellSize / 2 + startX,
        centerY: row * cellSize + cellSize / 2 + startY,
        xIndex: col,
        yIndex: row,
      };
    });
  }).flat();
};
