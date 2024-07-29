// File: Array.js

class ArrayStructure {
  constructor() {
    this.array = [];
  }

  /**
   * Linear Search Algorithm
   *
   * Reasoning:
   * Linear search is the simplest search algorithm and is useful when dealing with
   * unsorted arrays or when the cost of sorting is higher than the cost of searching.
   *
   * Assumptions:
   * - The array is not necessarily sorted.
   * - Every element needs to be checked in the worst case.
   *
   * Algorithm:
   * 1. Start from the first element of the array.
   * 2. Compare each element with the target value.
   * 3. If a match is found, return the index.
   * 4. If the end of the array is reached without finding the target, return -1.
   *
   * Time Complexity: O(n), where n is the number of elements in the array.
   * Space Complexity: O(1)
   */
  linearSearch(target) {
    for (let i = 0; i < this.array.length; i++) {
      if (this.array[i] === target) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Binary Search Algorithm
   *
   * Reasoning:
   * Binary search is an efficient algorithm for searching in sorted arrays. It's much
   * faster than linear search for large datasets.
   *
   * Assumptions:
   * - The array is sorted in ascending order.
   * - The array elements are comparable.
   *
   * Algorithm:
   * 1. Initialize left pointer to the start and right pointer to the end of the array.
   * 2. While left <= right:
   *    a. Calculate the middle index.
   *    b. If the middle element is the target, return its index.
   *    c. If the target is less than the middle element, search the left half.
   *    d. If the target is greater than the middle element, search the right half.
   * 3. If the target is not found, return -1.
   *
   * Time Complexity: O(log n), where n is the number of elements in the array.
   * Space Complexity: O(1)
   */
  binarySearch(target) {
    let left = 0;
    let right = this.array.length - 1;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (this.array[mid] === target) {
        return mid;
      } else if (this.array[mid] > target) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return -1;
  }

  /**
   * Bubble Sort Algorithm
   *
   * Reasoning:
   * Bubble sort is a simple sorting algorithm that repeatedly steps through the array,
   * compares adjacent elements and swaps them if they are in the wrong order.
   *
   * Assumptions:
   * - In-place sorting is acceptable.
   * - The array elements are comparable.
   *
   * Algorithm:
   * 1. Iterate through the array n-1 times, where n is the array length.
   * 2. In each iteration, compare adjacent elements.
   * 3. If they are in the wrong order, swap them.
   * 4. Repeat until no more swaps are needed.
   *
   * Time Complexity: O(n^2), where n is the number of elements in the array.
   * Space Complexity: O(1)
   */
  bubbleSort() {
    let n = this.array.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (this.array[j] > this.array[j + 1]) {
          [this.array[j], this.array[j + 1]] = [
            this.array[j + 1],
            this.array[j],
          ];
        }
      }
    }
  }

  /**
   * Quick Sort Algorithm
   *
   * Reasoning:
   * Quick sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer
   * strategy. It's generally faster than many other sorting algorithms in practice.
   *
   * Assumptions:
   * - In-place sorting is acceptable.
   * - The array elements are comparable.
   * - A random pivot selection or median-of-three method can be used to improve performance.
   *
   * Algorithm:
   * 1. Choose a pivot element from the array.
   * 2. Partition the array around the pivot (elements smaller than pivot on the left, larger on the right).
   * 3. Recursively apply the above steps to the sub-arrays on the left and right of the pivot.
   *
   * Time Complexity:
   * - Average case: O(n log n)
   * - Worst case: O(n^2) (rare with good pivot selection)
   * Space Complexity: O(log n) due to the recursive call stack
   */
  // Function to perform quicksort on an array
  quickSort(arr = this.array, low = 0, high = arr.length - 1) {
    // Base case: if the low index is less than the high index
    if (low < high) {
      // Partition the array and get the pivot index
      let pivotIndex = partition(arr, low, high);

      // Recursively sort the left sub-array (elements smaller than pivot)
      quickSort(arr, low, pivotIndex - 1);

      // Recursively sort the right sub-array (elements larger than pivot)
      quickSort(arr, pivotIndex + 1, high);
    }
  }

  // Function to partition the array and return the pivot index
  partition(arr, low, high) {
    // Choose the rightmost element as the pivot
    let pivot = arr[high];

    // Index of the smaller element
    let i = low - 1;

    // Iterate through the array from low to high-1
    for (let j = low; j < high; j++) {
      // If the current element is smaller than or equal to the pivot
      if (arr[j] <= pivot) {
        // Increment the index of the smaller element
        i++;

        // Swap the current element with the element at index i
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    // Place the pivot in its correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    // Return the index of the pivot
    return i + 1;
  }

  /**
   * Kadane's Algorithm (Maximum Subarray Sum)
   *
   * Reasoning:
   * Kadane's algorithm efficiently solves the maximum subarray problem, which is useful
   * in various applications like stock price analysis or finding the most profitable
   * sequence of operations.
   *
   * Assumptions:
   * - The array can contain both positive and negative numbers.
   * - An empty subarray is not considered (unless all elements are negative).
   *
   * Algorithm:
   * 1. Initialize variables to keep track of maximum sum (maxSum) and current sum (currentSum).
   * 2. Iterate through the array:
   *    a. Update currentSum to be the maximum of the current element or the sum including the current element.
   *    b. Update maxSum if currentSum is greater.
   * 3. Return the maximum subarray sum (maxSum).
   *
   * Time Complexity: O(n), where n is the number of elements in the array.
   * Space Complexity: O(1)
   */
  kadanesAlgorithm() {
    let maxSum = this.array[0];
    let currentSum = this.array[0];
    for (let i = 1; i < this.array.length; i++) {
      currentSum = Math.max(this.array[i], currentSum + this.array[i]);
      maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
  }

  // Helper methods
  add(element) {
    this.array.push(element);
  }

  get() {
    return this.array;
  }
}

// Example usage
let arr = new ArrayStructure();
arr.add(64);
arr.add(34);
arr.add(25);
arr.add(12);
arr.add(22);
arr.add(11);
arr.add(90);

console.log("Original array:", arr.get());
console.log("Linear search for 25:", arr.linearSearch(25));
arr.bubbleSort();
console.log("After bubble sort:", arr.get());
console.log("Binary search for 25:", arr.binarySearch(25));
arr.add(-2);
arr.add(1);
arr.add(-3);
arr.add(4);
arr.add(-1);
arr.add(2);
arr.add(1);
arr.add(-5);
arr.add(4);
console.log("Array for Kadane's algorithm:", arr.get());
console.log("Maximum subarray sum:", arr.kadanesAlgorithm());
