// Constants for grid and cell dimensions
const GRID_SIZE = 20;
const CELL_SIZE = 40;

// Transportation modes with their properties
const TRANSPORT_MODES = {
  walking: { color: [100, 100, 100], speed: 5, offset: 0 },
  bicycle: { color: [0, 150, 255], speed: 12, offset: 2 },
  car: { color: [255, 100, 0], speed: 80, offset: 4 },
  bus: { color: [255, 255, 0], speed: 50, offset: 6 },
  subway: { color: [0, 255, 0], speed: 60, offset: 8 },
};

// Styles for different path sequences
const PATH_STYLES = ["solid", "dashed", "dotted", "wavy", "double"];

// Global variables
let grid = [];
let startPoint = null;
let endPoint = null;
let isDragging = false;
let draggedPoint = null;
let allPaths = [];

/**
 * Represents a cell in the grid.
 */
class Cell {
  /**
   * @param {number} row - The row of the cell.
   * @param {number} col - The column of the cell.
   */
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.connections = {};
    this.isBuilding = false;
  }

  /**
   * Adds a connection to another cell for a specific mode of transportation.
   * @param {string} mode - The mode of transportation.
   * @param {Cell} cell - The cell to connect to.
   * @param {number} weight - The weight of the connection.
   */
  addConnection(mode, cell, weight) {
    if (!this.connections[mode]) {
      this.connections[mode] = [];
    }
    this.connections[mode].push({ cell, weight });
  }
}

/**
 * Represents a node in the pathfinding algorithm.
 */
class PathNode {
  /**
   * @param {Cell} cell - The cell this node represents.
   * @param {PathNode|null} parent - The parent node.
   * @param {string} mode - The mode of transportation.
   */
  constructor(cell, parent = null, mode = null) {
    this.cell = cell;
    this.parent = parent;
    this.mode = mode;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.modeChanges = 0;
    this.time = 0;
  }

  /**
   * Calculates the total cost f.
   */
  calculateF() {
    this.f = this.g + this.h;
  }
}

/**
 * Sets up the canvas and initializes the grid.
 */
function setup() {
  createCanvas(GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE + 60);
  initializeGrid();
  createCityLayout();
  addConnections();
  setRandomStartEndPoints();

  select("#resetPoints").mousePressed(resetPoints);
  select("#addSequence").mousePressed(addSequenceInput);
}

/**
 * Draws the grid, paths, and points on each frame.
 */
function draw() {
  background(220);
  drawLegend();
  translate(0, 60);
  drawGrid();
  drawConnections();
  drawAllPaths();
  drawStartEndPoints();

  if (isDragging) {
    updateDraggedPoint();
    findAndVisualizePaths();
  }
}

/**
 * Handles mouse press events for dragging points.
 */
function mousePressed() {
  let row = floor((mouseY - 60) / CELL_SIZE);
  let col = floor(mouseX / CELL_SIZE);

  if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
    if (!startPoint) {
      startPoint = grid[row][col];
      isDragging = true;
      draggedPoint = "start";
    } else if (!endPoint) {
      endPoint = grid[row][col];
      isDragging = true;
      draggedPoint = "end";
    } else {
      let startDist = dist(
        mouseX,
        mouseY - 60,
        startPoint.col * CELL_SIZE + CELL_SIZE / 2,
        startPoint.row * CELL_SIZE + CELL_SIZE / 2
      );
      let endDist = dist(
        mouseX,
        mouseY - 60,
        endPoint.col * CELL_SIZE + CELL_SIZE / 2,
        endPoint.row * CELL_SIZE + CELL_SIZE / 2
      );

      if (startDist < CELL_SIZE / 2) {
        isDragging = true;
        draggedPoint = "start";
      } else if (endDist < CELL_SIZE / 2) {
        isDragging = true;
        draggedPoint = "end";
      }
    }
  }
}

/**
 * Handles mouse release events.
 */
function mouseReleased() {
  isDragging = false;
  draggedPoint = null;
}

/**
 * Updates the position of the dragged point.
 */
function updateDraggedPoint() {
  let row = constrain(floor((mouseY - 60) / CELL_SIZE), 0, GRID_SIZE - 1);
  let col = constrain(floor(mouseX / CELL_SIZE), 0, GRID_SIZE - 1);

  if (draggedPoint === "start") {
    startPoint = grid[row][col];
  } else if (draggedPoint === "end") {
    endPoint = grid[row][col];
  }
}

/**
 * Resets start and end points to random positions.
 */
function resetPoints() {
  setRandomStartEndPoints();
  allPaths = [];
  redraw();
}

/**
 * Initializes the grid with Cell objects.
 */
function initializeGrid() {
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }
}

/**
 * Creates a city layout with buildings and main roads.
 */
function createCityLayout() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (random() < 0.3) {
        // 30% chance of being a building
        grid[i][j].isBuilding = true;
      }
    }
  }

  // Ensure main roads are clear
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i][5].isBuilding = false;
    grid[i][15].isBuilding = false;
    grid[5][i].isBuilding = false;
    grid[15][i].isBuilding = false;
  }
}

/**
 * Adds connections between cells for different modes of transportation.
 */
function addConnections() {
  // Add walking connections
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (!grid[i][j].isBuilding) {
        if (i > 0 && !grid[i - 1][j].isBuilding)
          addBidirectionalConnection(grid[i][j], grid[i - 1][j], "walking", 1);
        if (j > 0 && !grid[i][j - 1].isBuilding)
          addBidirectionalConnection(grid[i][j], grid[i][j - 1], "walking", 1);
      }
    }
  }

  // Add car and bus connections on main roads
  for (let i = 0; i < GRID_SIZE; i++) {
    if (i > 0) {
      addBidirectionalConnection(grid[i][5], grid[i - 1][5], "car", 0.8);
      addBidirectionalConnection(grid[i][15], grid[i - 1][15], "car", 0.8);
      addBidirectionalConnection(grid[5][i], grid[5][i - 1], "car", 0.8);
      addBidirectionalConnection(grid[15][i], grid[15][i - 1], "car", 0.8);

      addBidirectionalConnection(grid[i][5], grid[i - 1][5], "bus", 0.9);
      addBidirectionalConnection(grid[i][15], grid[i - 1][15], "bus", 0.9);
      addBidirectionalConnection(grid[5][i], grid[5][i - 1], "bus", 0.9);
      addBidirectionalConnection(grid[15][i], grid[15][i - 1], "bus", 0.9);
    }
  }

  // Add bicycle paths
  for (let i = 0; i < GRID_SIZE; i += 2) {
    for (let j = 0; j < GRID_SIZE; j += 2) {
      if (i > 0 && !grid[i][j].isBuilding && !grid[i - 1][j].isBuilding) {
        addBidirectionalConnection(grid[i][j], grid[i - 1][j], "bicycle", 0.7);
      }
      if (j > 0 && !grid[i][j].isBuilding && !grid[i][j - 1].isBuilding) {
        addBidirectionalConnection(grid[i][j], grid[i][j - 1], "bicycle", 0.7);
      }
    }
  }

  // Add subway connections
  let subwayStations = [
    { row: 2, col: 2 },
    { row: 2, col: 18 },
    { row: 18, col: 2 },
    { row: 18, col: 18 },
    { row: 10, col: 10 },
  ];

  for (let i = 0; i < subwayStations.length; i++) {
    for (let j = i + 1; j < subwayStations.length; j++) {
      let station1 = grid[subwayStations[i].row][subwayStations[i].col];
      let station2 = grid[subwayStations[j].row][subwayStations[j].col];
      addBidirectionalConnection(station1, station2, "subway", 0.5);
    }
  }
}

/**
 * Adds a bidirectional connection between two cells for a specific mode.
 * @param {Cell} cell1 - The first cell.
 * @param {Cell} cell2 - The second cell.
 * @param {string} mode - The mode of transportation.
 * @param {number} weight - The weight of the connection.
 */
function addBidirectionalConnection(cell1, cell2, mode, weight) {
  cell1.addConnection(mode, cell2, weight);
  cell2.addConnection(mode, cell1, weight);
}

/**
 * Sets random start and end points on the grid.
 */
function setRandomStartEndPoints() {
  do {
    let startRow = floor(random(GRID_SIZE));
    let startCol = floor(random(GRID_SIZE));
    startPoint = grid[startRow][startCol];
  } while (startPoint.isBuilding);

  do {
    let endRow = floor(random(GRID_SIZE));
    let endCol = floor(random(GRID_SIZE));
    endPoint = grid[endRow][endCol];
  } while (endPoint.isBuilding || endPoint === startPoint);

  findAndVisualizePaths();
}

/**
 * Adds a new sequence input to the HTML.
 */
function addSequenceInput() {
  let sequencesDiv = select("#sequences");
  let sequenceContainer = createDiv();
  sequenceContainer.class("sequence-container");

  let newInput = createInput("walking,bicycle,bus");
  newInput.class("mode-sequence");

  let removeButton = createButton("Remove");
  removeButton.mousePressed(() => {
    sequenceContainer.remove();
  });

  sequenceContainer.child(newInput);
  sequenceContainer.child(removeButton);
  sequencesDiv.child(sequenceContainer);
}

/**
 * Finds and visualizes paths for all mode sequences.
 */
function findAndVisualizePaths() {
  if (!startPoint || !endPoint) {
    return;
  }

  let modeParams = {};
  for (let mode of Object.keys(TRANSPORT_MODES)) {
    modeParams[mode] = {
      cost: parseFloat(select(`#${mode}-cost`).value()),
      maxTime: parseFloat(select(`#${mode}-max-time`).value()) * 60, // Convert to seconds
    };
  }

  allPaths = [];
  let sequenceInputs = selectAll(".mode-sequence");
  sequenceInputs.forEach((input, index) => {
    let selectedModes = input
      .value()
      .split(",")
      .map((mode) => mode.trim());
    let paths = findAllPaths(startPoint, endPoint, selectedModes, modeParams);
    paths.forEach((path) => {
      if (isValidPath(path, selectedModes)) {
        allPaths.push({ sequence: index, path: path });
      }
    });
  });
}

function isValidPath(path, selectedModes) {
  let usedModes = new Set(path.map((node) => node.mode));
  return selectedModes.every((mode) => usedModes.has(mode));
}

/**
 * Finds all paths between start and end points for given modes.
 * @param {Cell} start - The starting cell.
 * @param {Cell} goal - The goal cell.
 * @param {string[]} selectedModes - The selected modes of transportation.
 * @param {Object} modeParams - Parameters for each mode.
 * @returns {PathNode[][]} An array of paths.
 */
function findAllPaths(start, goal, selectedModes, modeParams) {
  let openSet = new PriorityQueue();
  let closedSet = new Set();
  let paths = [];

  let startNode = new PathNode(start, null, null);
  startNode.h = heuristic(start, goal);
  startNode.calculateF();
  openSet.enqueue(startNode, startNode.f);

  while (!openSet.isEmpty()) {
    let current = openSet.dequeue();

    if (current.cell === goal) {
      paths.push(reconstructPath(current));
      continue;
    }

    let key = `${current.cell.row},${current.cell.col},${current.mode}`;
    if (closedSet.has(key)) continue;
    closedSet.add(key);

    for (let mode of selectedModes) {
      if (!current.cell.connections[mode]) continue;

      for (let connection of current.cell.connections[mode]) {
        let neighbor = connection.cell;
        let weight = connection.weight;

        let distance = (weight * CELL_SIZE) / 1000; // Convert to km
        let timeInHours = distance / TRANSPORT_MODES[mode].speed;
        let newTime = current.time + timeInHours;

        if (newTime > modeParams[mode].maxTime / 3600) continue; // Convert maxTime to hours

        let newG = current.g + weight * modeParams[mode].cost;
        let modeChangePenalty = mode !== current.mode ? 0.25 : 0; // 15 minutes penalty for mode change

        let neighborNode = new PathNode(neighbor, current, mode);
        neighborNode.g = newG;
        neighborNode.h = heuristic(neighbor, goal);
        neighborNode.time = newTime + modeChangePenalty;
        neighborNode.modeChanges =
          current.modeChanges + (mode !== current.mode ? 1 : 0);
        neighborNode.calculateF();

        let neighborKey = `${neighbor.row},${neighbor.col},${mode}`;
        if (!closedSet.has(neighborKey)) {
          openSet.enqueue(neighborNode, neighborNode.f);
        }
      }
    }
  }

  return paths;
}

/**
 * Calculates the heuristic distance between two cells.
 * @param {Cell} a - The first cell.
 * @param {Cell} b - The second cell.
 * @returns {number} The estimated time to travel between the cells.
 */
function heuristic(a, b) {
  let dx = abs(a.col - b.col);
  let dy = abs(a.row - b.row);
  let distance = ((dx + dy) * CELL_SIZE) / 1000; // Convert to km
  let fastestSpeed = Math.max(
    ...Object.values(TRANSPORT_MODES).map((mode) => mode.speed)
  );
  return distance / fastestSpeed; // Estimated time in hours
}

/**
 * Reconstructs the path from the goal node to the start node.
 * @param {PathNode} endNode - The goal node.
 * @returns {PathNode[]} The reconstructed path.
 */
function reconstructPath(endNode) {
  let path = [];
  let current = endNode;
  while (current) {
    path.unshift({
      cell: current.cell,
      mode: current.mode,
      time: current.time,
      modeChanges: current.modeChanges,
    });
    current = current.parent;
  }
  return path;
}

/**
 * Draws all calculated paths.
 */
function drawAllPaths() {
  allPaths.forEach((pathData, index) => {
    drawPath(pathData.path, pathData.sequence, index);
  });
  drawLegend2();
}

/**
 * Draws a single path.
 * @param {PathNode[]} path - The path to draw.
 * @param {number} sequenceIndex - The index of the sequence this path belongs to.
 * @param {number} pathIndex - The index of this path within its sequence.
 */
function drawPath(path, sequenceIndex, pathIndex) {
  if (!path || path.length < 2) return;

  let pathStyle = PATH_STYLES[sequenceIndex % PATH_STYLES.length];

  for (let i = 0; i < path.length - 1; i++) {
    let current = path[i];
    let next = path[i + 1];

    if (current.mode && TRANSPORT_MODES[current.mode]) {
      stroke(TRANSPORT_MODES[current.mode].color);
    } else {
      stroke(0); // Default to black if mode or color is not found
    }
    strokeWeight(3);

    let x1 = current.cell.col * CELL_SIZE + CELL_SIZE / 2;
    let y1 = current.cell.row * CELL_SIZE + CELL_SIZE / 2;
    let x2 = next.cell.col * CELL_SIZE + CELL_SIZE / 2;
    let y2 = next.cell.row * CELL_SIZE + CELL_SIZE / 2;

    drawStyledLine(x1, y1, x2, y2, pathStyle);

    if (i > 0 && path[i - 1].mode !== current.mode) {
      fill(TRANSPORT_MODES[current.mode].color);
      ellipse(x1, y1, CELL_SIZE / 2);
    }
  }

  let endNode = path[path.length - 1];
  let totalTime = endNode.time;
  let modeChanges = endNode.modeChanges;
  fill(0);
  textAlign(LEFT, BOTTOM);
  text(
    `Time: ${totalTime?.toFixed(2)} hours, Changes: ${modeChanges}`,
    endNode.cell.col * CELL_SIZE,
    endNode.cell.row * CELL_SIZE
  );
}

/**
 * Draws a styled line based on the given style.
 * @param {number} x1 - Starting x-coordinate.
 * @param {number} y1 - Starting y-coordinate.
 * @param {number} x2 - Ending x-coordinate.
 * @param {number} y2 - Ending y-coordinate.
 * @param {string} style - The style of the line to draw.
 */
function drawStyledLine(x1, y1, x2, y2, style) {
  switch (style) {
    case "dashed":
      drawDashedLine(x1, y1, x2, y2);
      break;
    case "dotted":
      drawDottedLine(x1, y1, x2, y2);
      break;
    case "wavy":
      drawWavyLine(x1, y1, x2, y2);
      break;
    case "double":
      drawDoubleLine(x1, y1, x2, y2);
      break;
    case "curly":
      drawCurlyLine(x1, y1, x2, y2);
      break;
    default:
      line(x1, y1, x2, y2);
  }
}

/**
 * Draws a dashed line.
 * @param {number} x1 - Starting x-coordinate.
 * @param {number} y1 - Starting y-coordinate.
 * @param {number} x2 - Ending x-coordinate.
 * @param {number} y2 - Ending y-coordinate.
 */
function drawDashedLine(x1, y1, x2, y2) {
  let d = dist(x1, y1, x2, y2);
  let dashLength = 5;
  let gapLength = 3;
  let steps = d / (dashLength + gapLength);

  for (let i = 0; i < steps; i++) {
    let t1 = i / steps;
    let t2 = (i + dashLength / (dashLength + gapLength)) / steps;
    line(
      lerp(x1, x2, t1),
      lerp(y1, y2, t1),
      lerp(x1, x2, t2),
      lerp(y1, y2, t2)
    );
  }
}

/**
 * Draws a dotted line.
 * @param {number} x1 - Starting x-coordinate.
 * @param {number} y1 - Starting y-coordinate.
 * @param {number} x2 - Ending x-coordinate.
 * @param {number} y2 - Ending y-coordinate.
 */
function drawDottedLine(x1, y1, x2, y2) {
  let d = dist(x1, y1, x2, y2);
  let dotSpacing = 5;
  let steps = d / dotSpacing;

  for (let i = 0; i < steps; i++) {
    let t = i / steps;
    point(lerp(x1, x2, t), lerp(y1, y2, t));
  }
}

/**
 * Draws a wavy line.
 * @param {number} x1 - Starting x-coordinate.
 * @param {number} y1 - Starting y-coordinate.
 * @param {number} x2 - Ending x-coordinate.
 * @param {number} y2 - Ending y-coordinate.
 */
function drawWavyLine(x1, y1, x2, y2) {
  let d = dist(x1, y1, x2, y2);
  let amplitude = 3;
  let frequency = 0.1;
  let steps = d;

  beginShape();
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);
    let offset = sin(t * TWO_PI * frequency) * amplitude;
    let angle = atan2(y2 - y1, x2 - x1);
    vertex(
      x + cos(angle + HALF_PI) * offset,
      y + sin(angle + HALF_PI) * offset
    );
  }
  endShape();
}

/**
 * Draws a double line.
 * @param {number} x1 - Starting x-coordinate.
 * @param {number} y1 - Starting y-coordinate.
 * @param {number} x2 - Ending x-coordinate.
 * @param {number} y2 - Ending y-coordinate.
 */
function drawDoubleLine(x1, y1, x2, y2) {
  let angle = atan2(y2 - y1, x2 - x1);
  let offset = 2;

  line(
    x1 + cos(angle + HALF_PI) * offset,
    y1 + sin(angle + HALF_PI) * offset,
    x2 + cos(angle + HALF_PI) * offset,
    y2 + sin(angle + HALF_PI) * offset
  );
  line(
    x1 + cos(angle - HALF_PI) * offset,
    y1 + sin(angle - HALF_PI) * offset,
    x2 + cos(angle - HALF_PI) * offset,
    y2 + sin(angle - HALF_PI) * offset
  );
}

/**
 * Draws a curly line.
 * @param {number} x1 - Starting x-coordinate.
 * @param {number} y1 - Starting y-coordinate.
 * @param {number} x2 - Ending x-coordinate.
 * @param {number} y2 - Ending y-coordinate.
 */
function drawCurlyLine(x1, y1, x2, y2) {
  let d = dist(x1, y1, x2, y2);
  let amplitude = 5;
  let frequency = 0.2;
  let steps = d;

  beginShape();
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);
    let offset = sin(t * TWO_PI * frequency) * amplitude;
    let angle = atan2(y2 - y1, x2 - x1);
    vertex(
      x + cos(angle + HALF_PI) * offset,
      y + sin(angle + HALF_PI) * offset
    );
  }
  endShape();
}

/**
 * Draws the grid.
 */
function drawGrid() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].isBuilding) {
        fill(100);
      } else {
        fill(255);
      }
      stroke(0);
      rect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

/**
 * Draws the connections between cells.
 */
function drawConnections() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = grid[i][j];
      for (let mode in cell.connections) {
        let connections = cell.connections[mode];
        for (let conn of connections) {
          stroke(TRANSPORT_MODES[mode].color);
          let offset = TRANSPORT_MODES[mode].offset;
          line(
            j * CELL_SIZE + CELL_SIZE / 2 + offset,
            i * CELL_SIZE + CELL_SIZE / 2 + offset,
            conn.cell.col * CELL_SIZE + CELL_SIZE / 2 + offset,
            conn.cell.row * CELL_SIZE + CELL_SIZE / 2 + offset
          );
        }
      }
    }
  }
}

/**
 * Draws the start and end points.
 */
function drawStartEndPoints() {
  if (startPoint) {
    fill(0, 255, 0);
    ellipse(
      startPoint.col * CELL_SIZE + CELL_SIZE / 2,
      startPoint.row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE * 0.8
    );
  }
  if (endPoint) {
    fill(255, 0, 0);
    ellipse(
      endPoint.col * CELL_SIZE + CELL_SIZE / 2,
      endPoint.row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE * 0.8
    );
  }
}

/**
 * Draws the legend explaining colors and symbols.
 */
function drawLegend() {
  fill(255);
  rect(0, 0, width, 60);
  textAlign(LEFT, CENTER);
  textSize(12);
  let x = 10;
  let y = 30;

  Object.entries(TRANSPORT_MODES).forEach(([mode, details], index) => {
    fill(details.color);
    stroke(details.color);
    line(x, y, x + 30, y);
    fill(0);
    noStroke();
    text(`${mode} (${details.speed} km/h)`, x + 35, y);
    x += 120;
    if (x > width - 120) {
      x = 10;
      y += 20;
    }
  });

  fill(100);
  rect(x, y - 10, 20, 20);
  fill(0);
  text("Building", x + 25, y);
}

function drawLegend2() {
  let legendWidth = 250;
  let legendHeight = allPaths.length * 30 + 40;
  let padding = 10;
  let x = width - legendWidth - padding;
  let y = padding;

  // Draw legend background
  fill(255, 255, 255, 200);
  stroke(0);
  rect(x, y, legendWidth, legendHeight);

  // Draw legend title
  fill(0);
  textAlign(CENTER, TOP);
  textSize(14);
  text("Found Paths", x + legendWidth / 2, y + 5);

  // Draw path information
  textAlign(LEFT, TOP);
  textSize(12);
  allPaths.forEach((pathData, index) => {
    let pathY = y + 30 + index * 30;
    let path = pathData.path;
    let pathStyle = PATH_STYLES[pathData.sequence % PATH_STYLES.length];

    // Draw path style example
    stroke(0); // Default to black if no mode is available
    if (path[0].mode && TRANSPORT_MODES[path[0].mode]) {
      stroke(TRANSPORT_MODES[path[0].mode].color);
    }
    strokeWeight(3);
    drawStyledLine(x + 10, pathY + 10, x + 50, pathY + 10, pathStyle);

    // Draw path information
    fill(0);
    noStroke();
    let timeHours = path[path.length - 1].time;
    let timeMinutes = Math.round((timeHours % 1) * 60);
    text(`${Math.floor(timeHours)}h ${timeMinutes}m`, x + 60, pathY);

    // Draw transportation modes
    let modes = [
      ...new Set(path.map((node) => node.mode).filter((mode) => mode !== null)),
    ];
    let modeX = x + 120;
    modes.forEach((mode) => {
      if (TRANSPORT_MODES[mode]) {
        fill(TRANSPORT_MODES[mode].color);
        ellipse(modeX, pathY + 10, 10, 10);
        modeX += 20;
      }
    });
  });
}

/**
 * Priority Queue implementation for A* algorithm.
 */
class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift().element;
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}
