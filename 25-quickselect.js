/**
 * Quickselect Algorithm
 */

/**
 * Swap two elements in an array
 * @param {number[]} arr - The array
 * @param {number} i - Index of first element
 * @param {number} j - Index of second element
 */
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

/**
 * Partition the array around a pivot element
 * @param {number[]} arr - The array to partition
 * @param {number} left - The left index of the subarray
 * @param {number} right - The right index of the subarray
 * @return {number} - The final position of the pivot element
 */
function partition(arr, left, right) {
  let pivot = arr[right]; // Choose the rightmost element as pivot
  let i = left - 1; // Index of smaller element

  for (let j = left; j < right; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++; // Increment index of smaller element
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, right);
  return i + 1;
}

/**
 * Quickselect algorithm to find the kth smallest element
 * @param {number[]} arr - The input array
 * @param {number} left - The left index of the subarray
 * @param {number} right - The right index of the subarray
 * @param {number} k - The position to find (1-based)
 * @return {number} - The kth smallest element
 */
function quickselect(arr, left, right, k) {
  // If k is smaller than number of elements in array
  if (k > 0 && k <= right - left + 1) {
    // Partition the array around last element
    let pivotIndex = partition(arr, left, right);

    // If position is same as k
    if (pivotIndex - left === k - 1) {
      return arr[pivotIndex];
    }

    // If position is more, recur for left subarray
    if (pivotIndex - left > k - 1) {
      return quickselect(arr, left, pivotIndex - 1, k);
    }

    // Else recur for right subarray
    return quickselect(arr, pivotIndex + 1, right, k - pivotIndex + left - 1);
  }

  // If k is more than number of elements in the array
  return null;
}

// Test the Quickselect Algorithm
let arr = [10, 4, 5, 8, 6, 11, 26];
let k = 3; // Find the 3rd smallest element
let result = quickselect(arr, 0, arr.length - 1, k);

if (result !== null) {
  console.log(`The ${k}th smallest element is: ${result}`);
} else {
  console.log(`Invalid k value`);
}

// This implementation of the Quickselect Algorithm does the following:
// We define a swap function to swap two elements in an array.
// The partition function partitions the array around a pivot element
// (chosen as the rightmost element). It places all elements smaller than or
// equal to the pivot to its left and all greater elements to its right.
// The main quickselect function:
// It recursively partitions the array.
// If the partition index is equal to k-1, we've found our element.
// If it's greater, we recur on the left subarray.
// If it's smaller, we recur on the right subarray.
// We test the algorithm by finding the 3rd smallest element in a sample array.
// Quickselect is particularly useful when we need to find the kth smallest (or largest) element in an unsorted array.
// It has an average time complexity of O(n), making it more efficient than sorting the entire array
// when we only need a single element.
