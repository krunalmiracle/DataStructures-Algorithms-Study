/**
 * Quadtree Implementation
 *
 * @description
 * A Quadtree is a tree data structure in which each internal node has exactly four children.
 * Quadtrees are often used to partition a two-dimensional space by recursively subdividing it
 * into four quadrants or regions.
 *
 * @reasoning
 * Quadtrees are particularly useful for spatial indexing, image compression, and collision detection
 * in two-dimensional spaces.
 *
 * @complexity
 * Time complexity: O(log n) for insertion and search operations (average case)
 * Space complexity: O(n)
 */

class Point {
  constructor(x, y) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x; // Center x-coordinate
    this.y = y; // Center y-coordinate
    this.w = w; // Half-width
    this.h = h; // Half-height
  }

  // Check if this rectangle contains a point
  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h
    );
  }

  // Check if this rectangle intersects another rectangle
  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class Quadtree {
  constructor(boundary, capacity) {
    this.boundary = boundary; // The 2D space this quadtree occupies
    this.capacity = capacity; // Maximum number of points before splitting
    this.points = []; // Array to store points
    this.divided = false; // Flag to indicate if this node has been divided
  }

  // Insert a point into the quadtree
  insert(point) {
    if (!this.boundary.contains(point)) {
      return false; // Point is outside this quadtree
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    // Try to insert into children
    return (
      this.northeast.insert(point) ||
      this.northwest.insert(point) ||
      this.southeast.insert(point) ||
      this.southwest.insert(point)
    );
  }

  // Create four children that fully divide this quadtree
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    let ne = new Rectangle(x + w, y - h, w, h);
    this.northeast = new Quadtree(ne, this.capacity);

    let nw = new Rectangle(x - w, y - h, w, h);
    this.northwest = new Quadtree(nw, this.capacity);

    let se = new Rectangle(x + w, y + h, w, h);
    this.southeast = new Quadtree(se, this.capacity);

    let sw = new Rectangle(x - w, y + h, w, h);
    this.southwest = new Quadtree(sw, this.capacity);

    this.divided = true;
  }

  // Find all points that appear within a range
  query(range, found = []) {
    if (!this.boundary.intersects(range)) {
      return found; // If range doesn't intersect boundary, return empty array
    }

    // Check all points at this quad level
    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }

    // If this quadtree has been subdivided, check children
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }

    return found;
  }

  // Find the nearest neighbor to a given point
  nearestNeighbor(point) {
    if (this.points.length === 0 && !this.divided) {
      return null; // Empty tree
    }

    let best = null;
    let bestDistance = Infinity;

    // Check all points at this quad level
    for (let p of this.points) {
      let d = this.distance(point, p);
      if (d < bestDistance) {
        best = p;
        bestDistance = d;
      }
    }

    // If this quadtree has been subdivided, check children
    if (this.divided) {
      let quadrants = [
        this.northwest,
        this.northeast,
        this.southwest,
        this.southeast,
      ];
      // Sort quadrants by distance to point
      quadrants.sort(
        (a, b) =>
          this.distance(point, this.centerOf(a.boundary)) -
          this.distance(point, this.centerOf(b.boundary))
      );

      for (let quadrant of quadrants) {
        if (
          this.distance(point, this.centerOf(quadrant.boundary)) < bestDistance
        ) {
          let candidate = quadrant.nearestNeighbor(point);
          if (candidate) {
            let d = this.distance(point, candidate);
            if (d < bestDistance) {
              best = candidate;
              bestDistance = d;
            }
          }
        }
      }
    }

    return best;
  }

  // Calculate Euclidean distance between two points
  distance(p1, p2) {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Get the center point of a rectangle
  centerOf(rect) {
    return new Point(rect.x, rect.y);
  }
}

// Example usage
let boundary = new Rectangle(0, 0, 100, 100); // 200x200 space centered at (0,0)
let qt = new Quadtree(boundary, 4); // Quadtree with capacity 4 points per quad

// Insert some random points
for (let i = 0; i < 20; i++) {
  let p = new Point(Math.random() * 200 - 100, Math.random() * 200 - 100);
  qt.insert(p);
}

// Query points within a range
let range = new Rectangle(0, 0, 50, 50);
let pointsInRange = qt.query(range);
console.log("Points within range:", pointsInRange.length);

// Find nearest neighbor
let testPoint = new Point(10, 10);
let nearest = qt.nearestNeighbor(testPoint);
console.log("Nearest neighbor to (10, 10):", nearest);
