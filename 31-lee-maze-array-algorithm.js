/**
 * Lee's Algorithm for finding the shortest path in a maze
 * @param {number[][]} maze - The maze represented as a 2D array (0 for open path, 1 for wall)
 * @param {number[]} start - The starting coordinates [row, col]
 * @param {number[]} end - The ending coordinates [row, col]
 * @return {number[][]} - The shortest path as an array of coordinates, or null if no path exists
 */
function leeAlgorithm(maze, start, end) {
  const rows = maze.length;
  const cols = maze[0].length;
  const queue = [];
  const visited = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  const distance = Array(rows)
    .fill()
    .map(() => Array(cols).fill(Infinity));
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]; // Down, Up, Right, Left

  // Initialize the starting point
  queue.push(start);
  visited[start[0]][start[1]] = true;
  distance[start[0]][start[1]] = 0;

  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift();

    // Check if we've reached the end
    if (currentRow === end[0] && currentCol === end[1]) {
      // Reconstruct the path
      return reconstructPath(distance, start, end);
    }

    // Explore neighbors
    for (const [dx, dy] of directions) {
      const newRow = currentRow + dx;
      const newCol = currentCol + dy;

      // Check if the new position is valid and not visited
      if (
        isValidPosition(newRow, newCol, rows, cols) &&
        !visited[newRow][newCol] &&
        maze[newRow][newCol] === 0
      ) {
        queue.push([newRow, newCol]);
        visited[newRow][newCol] = true;
        distance[newRow][newCol] = distance[currentRow][currentCol] + 1;
      }
    }
  }

  // If we've exhausted all possibilities without finding the end, return null
  return null;
}

/**
 * Helper function to check if a position is valid in the maze
 */
function isValidPosition(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

/**
 * Helper function to reconstruct the path from start to end
 */
function reconstructPath(distance, start, end) {
  const path = [];
  let [currentRow, currentCol] = end;

  while (currentRow !== start[0] || currentCol !== start[1]) {
    path.unshift([currentRow, currentCol]);
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (const [dx, dy] of directions) {
      const newRow = currentRow + dx;
      const newCol = currentCol + dy;

      if (
        isValidPosition(newRow, newCol, distance.length, distance[0].length) &&
        distance[newRow][newCol] === distance[currentRow][currentCol] - 1
      ) {
        currentRow = newRow;
        currentCol = newCol;
        break;
      }
    }
  }

  path.unshift(start);
  return path;
}

// Test the Lee Algorithm
const maze = [
  [0, 0, 0, 0, 1],
  [1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 1, 0],
];
const start = [0, 0];
const end = [4, 4];

const shortestPath = leeAlgorithm(maze, start, end);
console.log("Shortest path:", shortestPath);

// This implementation of Lee's Algorithm does the following:
// We use a breadth-first search approach to explore the maze.
// We maintain a queue of positions to explore, a visited array to avoid revisiting positions,
// and a distance array to keep track of the shortest distance to each cell.
// We explore the maze level by level, updating the distances as we go.
// If we reach the end point, we reconstruct the path using the distance array.
// If we exhaust all possibilities without finding the end, we return null.
// Test problems for Lee's Algorithm:
// Find a path in a maze with multiple possible routes
// Test with a maze that has no valid path
// Find a path in a large maze (e.g., 100x100)
// Test with a maze that has a very narrow passage
