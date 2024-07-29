/**
 * Heap (Binary Heap) Implementation
 *
 * @description
 * A Heap is a specialized tree-based data structure that satisfies the heap property.
 * In a max heap, for any given node I, the value of I is greater than or equal to the values of its children.
 * In a min heap, the value of I is less than or equal to the values of its children.
 * This implementation uses an array to represent the heap.
 *
 * @reasoning
 * Heaps are efficient for priority queue operations and for algorithms that require
 * quick access to the largest (or smallest) element. They are also the basis for the efficient HeapSort algorithm.
 *
 * @assumptions
 * - The heap is implemented as a binary heap.
 * - The root of the heap is at index 0 in the array.
 * - For an element at index i, its left child is at 2i + 1, and its right child is at 2i + 2.
 * - The parent of an element at index i is at Math.floor((i - 1) / 2).
 *
 * @complexity
 * Space complexity: O(n), where n is the number of elements in the heap.
 * Time complexity:
 *   - Insertion: O(log n)
 *   - Deletion (extract max/min): O(log n)
 *   - Peek (get max/min): O(1)
 *   - Heapify: O(n)
 *
 * @returns {Object} An instance of the Heap class with methods for various heap operations.
 */
class Heap {
  // Constructor for the Heap class
  constructor(comparator = (a, b) => a - b) {
    // Initialize an empty array to store heap elements
    this.heap = [];
    // Set the comparator function for determining element order
    // Default is min heap (a - b), for max heap use (b - a)
    this.comparator = comparator;
  }

  /**
   * Inserts a new element into the heap
   *
   * @description
   * Adds a new element to the end of the heap and then bubbles it up to its correct position.
   *
   * @param {*} value - The value to be inserted into the heap
   *
   * @complexity
   * Time complexity: O(log n), where n is the number of elements in the heap
   *
   * @algorithm
   * 1. Add the new element to the end of the heap array.
   * 2. Compare the added element with its parent.
   * 3. If they are in the wrong order, swap the element with its parent.
   * 4. Repeat steps 2-3 until the element is in its correct position.
   */
  insert(value) {
    // Add the new value to the end of the heap array
    this.heap.push(value);
    // Call bubbleUp to move the new element to its correct position
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Removes and returns the root element of the heap
   *
   * @description
   * Removes the root element (maximum in a max heap, minimum in a min heap),
   * replaces it with the last element, and then sinks this element down to its correct position.
   *
   * @returns {*} The root element of the heap
   *
   * @complexity
   * Time complexity: O(log n), where n is the number of elements in the heap
   *
   * @algorithm
   * 1. If the heap is empty, return null.
   * 2. Store the root element to return later.
   * 3. Move the last element of the heap to the root position.
   * 4. Sink down this element to its correct position.
   * 5. Return the stored root element.
   */
  extract() {
    // If the heap is empty, return null
    if (this.heap.length === 0) return null;
    // If there's only one element, remove and return it
    if (this.heap.length === 1) return this.heap.pop();
    // Store the root element to return later
    const root = this.heap[0];
    // Move the last element to the root position
    this.heap[0] = this.heap.pop();
    // Sink down the new root to its correct position
    this.sinkDown(0);
    // Return the original root element
    return root;
  }

  /**
   * Returns the root element without removing it
   *
   * @description
   * Allows peeking at the root element (maximum in a max heap, minimum in a min heap)
   * without modifying the heap structure.
   *
   * @returns {*} The root element of the heap, or null if the heap is empty
   *
   * @complexity
   * Time complexity: O(1)
   */
  peek() {
    // Return the root element if the heap is not empty, otherwise return null
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Moves an element up the heap to its correct position
   *
   * @param {number} index - The index of the element to bubble up
   *
   * @complexity
   * Time complexity: O(log n), where n is the number of elements in the heap
   */
  bubbleUp(index) {
    // Continue while the element is not at the root
    while (index > 0) {
      // Calculate the parent index
      const parentIndex = Math.floor((index - 1) / 2);
      // If the element is in the correct order relative to its parent, stop
      if (this.comparator(this.heap[index], this.heap[parentIndex]) >= 0) break;
      // Otherwise, swap the element with its parent
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      // Move up to the parent index
      index = parentIndex;
    }
  }

  /**
   * Moves an element down the heap to its correct position
   *
   * @param {number} index - The index of the element to sink down
   *
   * @complexity
   * Time complexity: O(log n), where n is the number of elements in the heap
   */
  sinkDown(index) {
    // Get the length of the heap
    const length = this.heap.length;
    // Continue until the element is in its correct position
    while (true) {
      // Initialize the smallest index as the current index
      let smallestIndex = index;
      // Calculate the indices of the left and right children
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      // If the left child exists and is smaller than the current smallest, update smallestIndex
      if (
        leftChild < length &&
        this.comparator(this.heap[leftChild], this.heap[smallestIndex]) < 0
      ) {
        smallestIndex = leftChild;
      }

      // If the right child exists and is smaller than the current smallest, update smallestIndex
      if (
        rightChild < length &&
        this.comparator(this.heap[rightChild], this.heap[smallestIndex]) < 0
      ) {
        smallestIndex = rightChild;
      }

      // If the smallest index hasn't changed, the element is in its correct position
      if (smallestIndex === index) break;

      // Otherwise, swap the element with the smallest child
      [this.heap[index], this.heap[smallestIndex]] = [
        this.heap[smallestIndex],
        this.heap[index],
      ];
      // Move down to the smallest child index
      index = smallestIndex;
    }
  }

  /**
   * Builds a heap from an array of elements
   *
   * @description
   * Converts an arbitrary array into a valid heap by applying the heapify operation.
   *
   * @param {Array} array - The array to be converted into a heap
   *
   * @complexity
   * Time complexity: O(n), where n is the number of elements in the array
   *
   * @algorithm
   * 1. Set the heap's internal array to the input array.
   * 2. Starting from the last non-leaf node (parent of the last element),
   *    apply sinkDown operation to each node up to the root.
   */
  heapify(array) {
    // Set the heap's internal array to the input array
    this.heap = array;
    // Start from the last non-leaf node and apply sinkDown to each node
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.sinkDown(i);
    }
  }
}

/**
 * Heap Sort Algorithm
 *
 * @description
 * Sorts an array using the heap data structure.
 *
 * @param {Array} array - The array to be sorted
 * @param {function} comparator - The comparison function to determine the order
 *
 * @reasoning
 * Heap sort is an efficient, comparison-based sorting algorithm that uses a heap
 * to sort elements. It's in-place and has a consistent O(n log n) time complexity.
 *
 * @complexity
 * Time complexity: O(n log n), where n is the number of elements in the array
 * Space complexity: O(1) (in-place sorting)
 *
 * @algorithm
 * 1. Build a max heap from the input array.
 * 2. Repeatedly extract the maximum element and place it at the end of the array:
 *    a. Swap the root (maximum element) with the last element of the heap.
 *    b. Reduce the size of the heap by 1.
 *    c. Sink down the new root to maintain the max heap property.
 * 3. The array is now sorted in ascending order.
 *
 * @returns {Array} The sorted array
 */
function heapSort(array, comparator = (a, b) => b - a) {
  const heap = new Heap(comparator);
  heap.heapify(array);

  for (let i = array.length - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    heap.heap = array.slice(0, i);
    heap.sinkDown(0);
  }

  return array;
}

/**
 * Find the kth largest element in an array
 *
 * @description
 * Uses a min heap to efficiently find the kth largest element in an unsorted array.
 *
 * @param {Array} array - The input array
 * @param {number} k - The k value (1 <= k <= array.length)
 *
 * @reasoning
 * Using a min heap of size k allows us to maintain the k largest elements seen so far,
 * with the kth largest always at the root of the heap.
 *
 * @complexity
 * Time complexity: O(n log k), where n is the number of elements in the array
 * Space complexity: O(k)
 *
 * @algorithm
 * 1. Create a min heap of size k with the first k elements of the array.
 * 2. For each remaining element in the array:
 *    a. If the element is larger than the root of the heap, remove the root and insert the new element.
 * 3. The root of the heap is the kth largest element.
 *
 * @returns {*} The kth largest element in the array
 */
function findKthLargest(array, k) {
  const minHeap = new Heap((a, b) => a - b);

  for (let i = 0; i < array.length; i++) {
    if (minHeap.heap.length < k) {
      minHeap.insert(array[i]);
    } else if (array[i] > minHeap.peek()) {
      minHeap.extract();
      minHeap.insert(array[i]);
    }
  }

  return minHeap.peek();
}

/**
 * Find the median of a data stream
 *
 * @description
 * Maintains two heaps to efficiently calculate the median of a stream of numbers.
 *
 * @reasoning
 * Using a max heap for the lower half and a min heap for the upper half of the numbers
 * allows for efficient insertion and median calculation.
 *
 * @complexity
 * Time complexity: O(log n) for insertion, O(1) for finding median
 * Space complexity: O(n), where n is the number of elements in the stream
 *
 * @returns {Object} An object with methods to add numbers and get the median
 */
function medianOfStream() {
  const lowerHalf = new Heap((a, b) => b - a); // max heap
  const upperHalf = new Heap((a, b) => a - b); // min heap

  return {
    /**
     * Adds a number to the data stream
     *
     * @param {number} num - The number to be added
     *
     * @algorithm
     * 1. If lowerHalf is empty or num is less than the max of lowerHalf, add to lowerHalf.
     * 2. Otherwise, add to upperHalf.
     * 3. Balance the heaps so their sizes differ by at most 1.
     */
    addNum: function (num) {
      if (lowerHalf.heap.length === 0 || num < lowerHalf.peek()) {
        lowerHalf.insert(num);
      } else {
        upperHalf.insert(num);
      }

      // Balance heaps
      if (lowerHalf.heap.length > upperHalf.heap.length + 1) {
        upperHalf.insert(lowerHalf.extract());
      } else if (upperHalf.heap.length > lowerHalf.heap.length) {
        lowerHalf.insert(upperHalf.extract());
      }
    },

    /**
     * Finds the median of the data stream
     *
     * @returns {number} The median of the data stream
     *
     * @algorithm
     * 1. If the heaps have equal size, return the average of their tops.
     * 2. Otherwise, return the top of the larger heap (lowerHalf).
     */
    findMedian: function () {
      if (lowerHalf.heap.length === upperHalf.heap.length) {
        return (lowerHalf.peek() + upperHalf.peek()) / 2;
      } else {
        return lowerHalf.peek();
      }
    },
  };
}

/**
 * Sliding Window Maximum
 *
 * @description
 * Finds the maximum element in each sliding window of size k in an array.
 *
 * @param {Array} nums - The input array
 * @param {number} k - The size of the sliding window
 *
 * @reasoning
 * Using a deque (double-ended queue) allows us to maintain the maximum element
 * in the current window efficiently.
 *
 * @complexity
 * Time complexity: O(n), where n is the number of elements in the array
 * Space complexity: O(k), where k is the size of the sliding window
 *
 * @algorithm
 * 1. Initialize an empty deque and a result array.
 * 2. For each element in the array:
 *    a. Remove elements from the front of the deque that are outside the current window.
 *    b. Remove elements from the back of the deque that are smaller than the current element.
 *    c. Add the current element's index to the back of the deque.
 *    d. If we've processed at least k elements, add the maximum (front of deque) to the result.
 * 3. Return the result array.
 *
 * @returns {Array} An array containing the maximum of each sliding window
 */
function slidingWindowMaximum(nums, k) {
  const result = [];
  const deque = [];

  for (let i = 0; i < nums.length; i++) {
    // Remove elements outside the current window
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }

    // Remove smaller elements from the back
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }

    deque.push(i);

    // Add to result if we've processed at least k elements
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}

// Test functions

function testHeap() {
  console.log("Testing Heap Implementation");
  const minHeap = new Heap((a, b) => a - b);
  minHeap.insert(5);
  minHeap.insert(3);
  minHeap.insert(7);
  minHeap.insert(1);
  console.log("Min Heap:", minHeap.heap);
  console.log("Extract Min:", minHeap.extract());
  console.log("Heap after extraction:", minHeap.heap);
}

function testHeapSort() {
  console.log("\nTesting Heap Sort");
  const arr = [12, 11, 13, 5, 6, 7];
  console.log("Original array:", arr);
  console.log("Sorted array:", heapSort(arr));
}

function testKthLargest() {
  console.log("\nTesting Kth Largest Element");
  const arr = [3, 2, 1, 5, 6, 4];
  const k = 2;
  console.log(`Array: [${arr}]`);
  console.log(`${k}th largest element:`, findKthLargest(arr, k));
}

function testMedianOfStream() {
  console.log("\nTesting Median of Stream");
  const medianFinder = medianOfStream();
  medianFinder.addNum(1);
  medianFinder.addNum(2);
  console.log("Median after [1, 2]:", medianFinder.findMedian());
  medianFinder.addNum(3);
  console.log("Median after [1, 2, 3]:", medianFinder.findMedian());
}

function testSlidingWindowMaximum() {
  console.log("\nTesting Sliding Window Maximum");
  const nums = [1, 3, -1, -3, 5, 3, 6, 7];
  const k = 3;
  console.log(`Array: [${nums}]`);
  console.log(`Window size: ${k}`);
  console.log("Sliding window maximums:", slidingWindowMaximum(nums, k));
}

// Run all tests
testHeap();
testHeapSort();
testKthLargest();
testMedianOfStream();
testSlidingWindowMaximum();
