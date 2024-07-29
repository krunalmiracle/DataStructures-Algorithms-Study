/**
 * A* (A-star) Pathfinding Algorithm
 */

// Define a class for grid cells
class Cell {
  constructor(row, col) {
    this.row = row; // Row of the cell in the grid
    this.col = col; // Column of the cell in the grid
    this.totalCost = 0; // Total estimated cost (f = gCost + hCost)
    this.costFromStart = 0; // Cost from start to this cell (g cost)
    this.estimatedCostToGoal = 0; // Estimated cost from this cell to goal (h cost)
    this.neighbors = []; // List of neighboring cells
    this.cameFrom = null; // Parent cell in the path
  }

  // Add neighboring cells
  addNeighbors(grid) {
    let row = this.row;
    let col = this.col;
    let gridRows = grid.length;
    let gridCols = grid[0].length;

    // Check and add neighbors in all 4 directions (up, right, down, left)
    if (row > 0) this.neighbors.push(grid[row - 1][col]); // Up
    if (col < gridCols - 1) this.neighbors.push(grid[row][col + 1]); // Right
    if (row < gridRows - 1) this.neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) this.neighbors.push(grid[row][col - 1]); // Left
  }
}

// Calculate the Manhattan distance between two cells
function manhattanDistance(cellA, cellB) {
  return Math.abs(cellA.row - cellB.row) + Math.abs(cellA.col - cellB.col);
}

// A* pathfinding function
function findPathAStar(startCell, goalCell, grid) {
  let openList = []; // Cells to be evaluated
  let closedList = []; // Cells already evaluated
  let finalPath = []; // The final path from start to goal

  openList.push(startCell); // Add start cell to open list

  // Main loop of A* algorithm
  while (openList.length > 0) {
    // Find the cell in openList with the lowest total cost
    let currentCell = openList[0];
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].totalCost < currentCell.totalCost) {
        currentCell = openList[i];
      }
    }

    // If we've reached the goal, reconstruct and return the path
    if (currentCell === goalCell) {
      let temp = currentCell;
      finalPath.push(temp);
      while (temp.cameFrom) {
        finalPath.push(temp.cameFrom);
        temp = temp.cameFrom;
      }
      return finalPath.reverse(); // Reverse to get path from start to goal
    }

    // Move current cell from openList to closedList
    openList = openList.filter((cell) => cell !== currentCell);
    closedList.push(currentCell);

    // Check all neighbors of the current cell
    for (let neighbor of currentCell.neighbors) {
      // Skip this neighbor if it's already evaluated
      if (closedList.includes(neighbor)) {
        continue;
      }

      // Calculate the cost to reach this neighbor through the current cell
      let tentativeCostFromStart = currentCell.costFromStart + 1; // Assuming cost between adjacent cells is 1

      let isNewPath = false;
      if (openList.includes(neighbor)) {
        // If this path to neighbor is better than previous one, update the neighbor
        if (tentativeCostFromStart < neighbor.costFromStart) {
          neighbor.costFromStart = tentativeCostFromStart;
          isNewPath = true;
        }
      } else {
        // Discover a new cell
        neighbor.costFromStart = tentativeCostFromStart;
        isNewPath = true;
        openList.push(neighbor);
      }

      // Update the neighbor's costs if we found a better path
      if (isNewPath) {
        neighbor.estimatedCostToGoal = manhattanDistance(neighbor, goalCell);
        neighbor.totalCost =
          neighbor.costFromStart + neighbor.estimatedCostToGoal;
        neighbor.cameFrom = currentCell;
      }
    }
  }

  // If we get here, there's no path to the goal
  return null;
}

// Create a grid for testing
let gridSize = 10;
let grid = [];
for (let row = 0; row < gridSize; row++) {
  grid[row] = [];
  for (let col = 0; col < gridSize; col++) {
    grid[row][col] = new Cell(row, col);
  }
}

// Add neighbors for each cell
for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    grid[row][col].addNeighbors(grid);
  }
}

// Define start and goal cells
let startCell = grid[0][0];
let goalCell = grid[9][9];

// Run A* algorithm
let path = findPathAStar(startCell, goalCell, grid);

// Print the path
if (path) {
  console.log("Path found:");
  path.forEach((cell) => console.log(`(${cell.row}, ${cell.col})`));
} else {
  console.log("No path found");
}

/**
 * Breadth-First Search (BFS) Pathfinding Algorithm
 */

// We'll reuse the Cell class from the A* implementation

// BFS pathfinding function
function findPathBFS(startCell, goalCell, grid) {
  let queue = []; // Queue for cells to visit
  let visitedCells = new Set(); // Set to keep track of visited cells
  let finalPath = []; // The final path from start to goal

  queue.push(startCell); // Add start cell to queue
  visitedCells.add(startCell); // Mark start cell as visited

  // Main loop of BFS algorithm
  while (queue.length > 0) {
    let currentCell = queue.shift(); // Get the next cell from the front of the queue

    // If we've reached the goal, reconstruct and return the path
    if (currentCell === goalCell) {
      let temp = currentCell;
      while (temp) {
        finalPath.push(temp);
        temp = temp.cameFrom; // Follow the path back to start
      }
      return finalPath.reverse(); // Reverse to get path from start to goal
    }

    // Check all neighbors of the current cell
    for (let neighbor of currentCell.neighbors) {
      // If we haven't visited this neighbor yet
      if (!visitedCells.has(neighbor)) {
        queue.push(neighbor); // Add to queue to visit later
        visitedCells.add(neighbor); // Mark as visited
        neighbor.cameFrom = currentCell; // Remember where we came from
      }
    }
  }

  // If we get here, there's no path to the goal
  return null;
}

// We can reuse the grid creation and testing code from the A* implementation

// Run BFS algorithm
let bfsPath = findPathBFS(startCell, goalCell, grid);

// Print the path
if (bfsPath) {
  console.log("BFS Path found:");
  bfsPath.forEach((cell) => console.log(`(${cell.row}, ${cell.col})`));
} else {
  console.log("No BFS path found");
}

/**
 * Dijkstra's Pathfinding Algorithm
 */

// We'll create a new class for Dijkstra's algorithm
class DijkstraCell extends Cell {
  constructor(row, col) {
    super(row, col);
    this.distanceFromStart = Infinity; // Distance from start cell
  }
}

// Dijkstra's pathfinding function
function findPathDijkstra(startCell, goalCell, grid) {
  let unvisitedCells = []; // List of all unvisited cells
  let finalPath = []; // The final path from start to goal

  // Initialize distances and unvisited list
  for (let row of grid) {
    for (let cell of row) {
      cell.distanceFromStart = Infinity;
      unvisitedCells.push(cell);
    }
  }
  startCell.distanceFromStart = 0; // Start cell has distance 0

  // Main loop of Dijkstra's algorithm
  while (unvisitedCells.length > 0) {
    // Find the unvisited cell with the smallest distance
    unvisitedCells.sort((a, b) => a.distanceFromStart - b.distanceFromStart);
    let currentCell = unvisitedCells.shift(); // Remove and return the first (smallest) element

    // If we've reached the goal, reconstruct and return the path
    if (currentCell === goalCell) {
      let temp = currentCell;
      while (temp) {
        finalPath.push(temp);
        temp = temp.cameFrom; // Follow the path back to start
      }
      return finalPath.reverse(); // Reverse to get path from start to goal
    }

    // Check all neighbors of the current cell
    for (let neighbor of currentCell.neighbors) {
      // Calculate the distance to this neighbor through the current cell
      let distanceThroughCurrent = currentCell.distanceFromStart + 1; // Assuming distance between adjacent cells is 1

      // If we found a shorter path to the neighbor
      if (distanceThroughCurrent < neighbor.distanceFromStart) {
        neighbor.distanceFromStart = distanceThroughCurrent;
        neighbor.cameFrom = currentCell;
      }
    }
  }

  // If we get here, there's no path to the goal
  return null;
}

// Create a grid for testing (using DijkstraCell instead of Cell)
let dijkstraGrid = [];
for (let row = 0; row < gridSize; row++) {
  dijkstraGrid[row] = [];
  for (let col = 0; col < gridSize; col++) {
    dijkstraGrid[row][col] = new DijkstraCell(row, col);
  }
}

// Add neighbors for each cell
for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    dijkstraGrid[row][col].addNeighbors(dijkstraGrid);
  }
}

// Define start and goal cells
let dijkstraStart = dijkstraGrid[0][0];
let dijkstraGoal = dijkstraGrid[9][9];

// Run Dijkstra's algorithm
let dijkstraPath = findPathDijkstra(dijkstraStart, dijkstraGoal, dijkstraGrid);

// Print the path
if (dijkstraPath) {
  console.log("Dijkstra's Path found:");
  dijkstraPath.forEach((cell) => console.log(`(${cell.row}, ${cell.col})`));
} else {
  console.log("No Dijkstra's path found");
}

// This Dijkstra's algorithm implementation is similar to A*, but without the heuristic.
// It calculates the shortest path to all cells, which makes it more versatile but potentially
// slower than A* for finding a path to a specific goal.
// Key differences in these implementations:
// BFS uses a simple queue and doesn't consider distances. It finds the path with the fewest steps
// but isn't guaranteed to find the shortest path in a weighted graph.
// Dijkstra's algorithm considers distances and finds the shortest path even in a weighted graph.
// It's more versatile than BFS but potentially slower.
// A* (from the previous response) is like Dijkstra's algorithm with an added heuristic to guide it towards the goal,
//  making it typically faster for finding a path to a specific goal.
// These implementations should be easier to read and understand, with more descriptive variable names
// and exhaustive comments explaining each part of the algorithms.
