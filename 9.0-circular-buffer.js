/**
 * Circular Buffer (Ring Buffer) Data Structure
 * A fixed-size buffer that wraps around when it reaches its end
 */
class CircularBuffer {
  /**
   * @param {number} capacity - The fixed size of the buffer
   */
  constructor(capacity) {
    this.buffer = new Array(capacity); // Initialize the buffer array
    this.capacity = capacity; // Store the capacity
    this.head = 0; // Index for the front of the buffer
    this.tail = 0; // Index for the back of the buffer
    this.size = 0; // Current number of elements in the buffer
  }

  /**
   * Add an item to the buffer
   * @param {*} item - The item to be added
   * @time O(1)
   */
  enqueue(item) {
    // If buffer is full, move head to overwrite oldest item
    if (this.size === this.capacity) {
      this.head = (this.head + 1) % this.capacity;
    } else {
      this.size++;
    }
    this.buffer[this.tail] = item; // Add item at tail
    this.tail = (this.tail + 1) % this.capacity; // Move tail
  }

  /**
   * Remove and return the oldest item from the buffer
   * @returns {*} The oldest item in the buffer
   * @throws {Error} If the buffer is empty
   * @time O(1)
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Buffer is empty");
    }
    const item = this.buffer[this.head]; // Get item at head
    this.head = (this.head + 1) % this.capacity; // Move head
    this.size--;
    return item;
  }

  /**
   * Get the item at a specific index in the buffer
   * @param {number} index - The index of the item to get
   * @returns {*} The item at the specified index
   * @throws {Error} If the index is out of bounds
   * @time O(1)
   */
  get(index) {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }
    return this.buffer[(this.head + index) % this.capacity];
  }

  /**
   * Check if the buffer is empty
   * @returns {boolean} True if the buffer is empty, false otherwise
   * @time O(1)
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Check if the buffer is full
   * @returns {boolean} True if the buffer is full, false otherwise
   * @time O(1)
   */
  isFull() {
    return this.size === this.capacity;
  }

  /**
   * Get the current size of the buffer
   * @returns {number} The number of items currently in the buffer
   * @time O(1)
   */
  getSize() {
    return this.size;
  }

  /**
   * Get the capacity of the buffer
   * @returns {number} The maximum number of items the buffer can hold
   * @time O(1)
   */
  getCapacity() {
    return this.capacity;
  }

  /**
   * Clear the buffer
   * @time O(1)
   */
  clear() {
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  /**
   * Convert the buffer to an array
   * @returns {Array} An array containing all items in the buffer in order
   * @time O(n) where n is the size of the buffer
   */
  toArray() {
    const result = [];
    for (let i = 0; i < this.size; i++) {
      result.push(this.get(i));
    }
    return result;
  }
}

/**
 * Test function to demonstrate CircularBuffer operations
 */
function testCircularBuffer() {
  const buffer = new CircularBuffer(5); // Create a new CircularBuffer with capacity 5

  // Add items
  buffer.enqueue(1);
  buffer.enqueue(2);
  buffer.enqueue(3);
  console.log("Buffer after adding 1, 2, 3:", buffer.toArray());

  // Add more items to fill the buffer
  buffer.enqueue(4);
  buffer.enqueue(5);
  console.log("Buffer after filling:", buffer.toArray());

  // Add one more item, which should overwrite the oldest item
  buffer.enqueue(6);
  console.log("Buffer after adding 6 (overwriting oldest):", buffer.toArray());

  // Remove an item
  console.log("Dequeued item:", buffer.dequeue());
  console.log("Buffer after dequeue:", buffer.toArray());

  // Get item at index 2
  console.log("Item at index 2:", buffer.get(2));

  // Check if buffer is full
  console.log("Is buffer full?", buffer.isFull());

  // Clear the buffer
  buffer.clear();
  console.log("Buffer after clear:", buffer.toArray());
  console.log("Is buffer empty?", buffer.isEmpty());
}
// This Circular Buffer implementation provides efficient O(1) operations for enqueueing, dequeueing, and accessing elements by index.
// It's particularly useful for scenarios where you need to maintain a fixed-size history of recent items.
// Run the test function
testCircularBuffer();
