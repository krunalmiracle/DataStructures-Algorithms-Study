/**
 * Octree Implementation
 *
 * @description
 * An Octree is a tree data structure in which each internal node has exactly eight children.
 * Octrees are the three-dimensional analog of Quadtrees and are used to partition a
 * three-dimensional space.
 *
 * @reasoning
 * Octrees are particularly useful for 3D spatial indexing, collision detection in 3D spaces,
 * and 3D graphics applications.
 *
 * @complexity
 * Time complexity: O(log n) for insertion and search operations (average case)
 * Space complexity: O(n)
 */

// Define a 3D point class
class Point3D {
  constructor(x, y, z) {
    this.x = x; // Store x-coordinate
    this.y = y; // Store y-coordinate
    this.z = z; // Store z-coordinate
  }
}

// Define a 3D box class for representing octree boundaries
class Box {
  constructor(x, y, z, w, h, d) {
    this.x = x; // Center x-coordinate
    this.y = y; // Center y-coordinate
    this.z = z; // Center z-coordinate
    this.w = w; // Half-width
    this.h = h; // Half-height
    this.d = d; // Half-depth
  }

  // Check if a point is contained within this box
  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h &&
      point.z >= this.z - this.d &&
      point.z < this.z + this.d
    );
  }

  // Check if this box intersects with another box
  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h ||
      range.z - range.d > this.z + this.d ||
      range.z + range.d < this.z - this.d
    );
  }

  // Check if this box intersects with a sphere
  intersectsSphere(center, radius) {
    // Calculate the closest point on the box to the center of the sphere
    let dx = Math.max(
      this.x - this.w - center.x,
      0,
      center.x - (this.x + this.w)
    );
    let dy = Math.max(
      this.y - this.h - center.y,
      0,
      center.y - (this.y + this.h)
    );
    let dz = Math.max(
      this.z - this.d - center.z,
      0,
      center.z - (this.z + this.d)
    );

    // If the distance from the closest point to the center is less than the radius, they intersect
    return dx * dx + dy * dy + dz * dz <= radius * radius;
  }
}

// Define the Octree class
class Octree {
  constructor(boundary, capacity) {
    this.boundary = boundary; // The 3D space this octree occupies
    this.capacity = capacity; // Maximum number of points per node before splitting
    this.points = []; // Array to store points in this node
    this.divided = false; // Flag to indicate if this node has been subdivided
  }

  // Subdivide this octree node into eight children
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let z = this.boundary.z;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let d = this.boundary.d / 2;

    // Create eight new octree nodes, one for each octant
    let topNW = new Box(x - w, y - h, z - d, w, h, d);
    this.topNorthwest = new Octree(topNW, this.capacity);
    let topNE = new Box(x + w, y - h, z - d, w, h, d);
    this.topNortheast = new Octree(topNE, this.capacity);
    let topSW = new Box(x - w, y + h, z - d, w, h, d);
    this.topSouthwest = new Octree(topSW, this.capacity);
    let topSE = new Box(x + w, y + h, z - d, w, h, d);
    this.topSoutheast = new Octree(topSE, this.capacity);
    let bottomNW = new Box(x - w, y - h, z + d, w, h, d);
    this.bottomNorthwest = new Octree(bottomNW, this.capacity);
    let bottomNE = new Box(x + w, y - h, z + d, w, h, d);
    this.bottomNortheast = new Octree(bottomNE, this.capacity);
    let bottomSW = new Box(x - w, y + h, z + d, w, h, d);
    this.bottomSouthwest = new Octree(bottomSW, this.capacity);
    let bottomSE = new Box(x + w, y + h, z + d, w, h, d);
    this.bottomSoutheast = new Octree(bottomSE, this.capacity);

    // Mark this node as divided
    this.divided = true;
  }

  // Insert a point into the octree
  insert(point) {
    // If the point is not in this octree node's boundary, don't insert it
    if (!this.boundary.contains(point)) {
      return false;
    }

    // If this node has capacity and hasn't been divided, add the point here
    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    // If we don't have capacity, subdivide (if we haven't already)
    if (!this.divided) {
      this.subdivide();
    }

    // Try to insert the point into one of the eight child nodes
    return (
      this.topNorthwest.insert(point) ||
      this.topNortheast.insert(point) ||
      this.topSouthwest.insert(point) ||
      this.topSoutheast.insert(point) ||
      this.bottomNorthwest.insert(point) ||
      this.bottomNortheast.insert(point) ||
      this.bottomSouthwest.insert(point) ||
      this.bottomSoutheast.insert(point)
    );
  }

  // Query points within a given 3D range
  query(range, found = []) {
    // If the range doesn't intersect this octree node, return the empty result
    if (!this.boundary.intersects(range)) {
      return found;
    }

    // Check all points in this node
    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }

    // If this node is divided, query all child nodes
    if (this.divided) {
      this.topNorthwest.query(range, found);
      this.topNortheast.query(range, found);
      this.topSouthwest.query(range, found);
      this.topSoutheast.query(range, found);
      this.bottomNorthwest.query(range, found);
      this.bottomNortheast.query(range, found);
      this.bottomSouthwest.query(range, found);
      this.bottomSoutheast.query(range, found);
    }

    // Return all points found
    return found;
  }

  // Find all points within a given radius of a target point
  pointsWithinRadius(center, radius) {
    let result = [];

    // If this node is too far away, return empty array
    if (!this.boundary.intersectsSphere(center, radius)) {
      return result;
    }

    // Check points in this node
    for (let point of this.points) {
      if (this.distance(center, point) <= radius) {
        result.push(point);
      }
    }

    // If this node is subdivided, check child nodes
    if (this.divided) {
      result = result.concat(
        this.topNorthwest.pointsWithinRadius(center, radius),
        this.topNortheast.pointsWithinRadius(center, radius),
        this.topSouthwest.pointsWithinRadius(center, radius),
        this.topSoutheast.pointsWithinRadius(center, radius),
        this.bottomNorthwest.pointsWithinRadius(center, radius),
        this.bottomNortheast.pointsWithinRadius(center, radius),
        this.bottomSouthwest.pointsWithinRadius(center, radius),
        this.bottomSoutheast.pointsWithinRadius(center, radius)
      );
    }

    return result;
  }

  // Calculate Euclidean distance between two points
  distance(p1, p2) {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    let dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

// Example usage
let boundary = new Box(0, 0, 0, 100, 100, 100); // Create a 200x200x200 space centered at (0,0,0)
let octree = new Octree(boundary, 4); // Create an octree with capacity 4 points per node

// Insert 1000 random points
for (let i = 0; i < 1000; i++) {
  let p = new Point3D(
    Math.random() * 200 - 100, // Random x between -100 and 100
    Math.random() * 200 - 100, // Random y between -100 and 100
    Math.random() * 200 - 100 // Random z between -100 and 100
  );
  octree.insert(p);
}

let center = new Point3D(0, 0, 0); // Center point for our radius search
let radius = 50; // Search radius
let pointsInRadius = octree.pointsWithinRadius(center, radius);
console.log("Points within radius:", pointsInRadius.length);
