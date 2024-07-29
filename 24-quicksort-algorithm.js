/**
 * Quicksort Algorithm
 *  Quicksort is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the pivot.
 *  It's known for its efficiency and is often used as a general-purpose sorting algorithm.
 * @param {number[]} arrayToSort - The array of numbers to be sorted
 * @returns {number[]} - The sorted array
 */
function quickSort(arrayToSort) {
  // If the array has 1 or fewer elements, it's already sorted
  if (arrayToSort.length <= 1) {
    return arrayToSort;
  }

  // Choose the last element as the pivot
  const pivot = arrayToSort[arrayToSort.length - 1];
  const leftArray = [];
  const rightArray = [];

  // Partition the array around the pivot
  for (let i = 0; i < arrayToSort.length - 1; i++) {
    if (arrayToSort[i] < pivot) {
      leftArray.push(arrayToSort[i]);
    } else {
      rightArray.push(arrayToSort[i]);
    }
  }

  // Recursively sort the left and right arrays and combine with the pivot
  return [...quickSort(leftArray), pivot, ...quickSort(rightArray)];
}

// Test cases
console.log(quickSort([64, 34, 25, 12, 22, 11, 90])); // Expected: [11, 12, 22, 25, 34, 64, 90]
console.log(quickSort([5, 2, 9, 1, 7, 6, 3])); // Expected: [1, 2, 3, 5, 6, 7, 9]
console.log(quickSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])); // Expected: [1, 1, 2, 3, 3, 4, 5, 5, 6, 9]
console.log(quickSort([1])); // Expected: [1]
console.log(quickSort([])); // Expected: []

// Explanation:
// The quickSort function is the main entry point of the algorithm:
// It first checks if the array has 1 or fewer elements (base case for recursion).
// It chooses the last element as the pivot (other pivot selection strategies exist).
// It partitions the array into two sub-arrays: elements less than the pivot and elements greater than or equal to the pivot.
// It recursively calls itself on both sub-arrays.
// Finally, it combines the sorted left array, pivot, and sorted right array.
// Time Complexity:
// Best Case: O(n log n)
// Average Case: O(n log n)
// Worst Case: O(n^2) - occurs when the pivot is always the smallest or largest element
// Space Complexity:
// O(log n) average case for the recursive call stack
// O(n) worst case for the recursive call stack (unbalanced partitions)
// Use Cases:
// General-purpose sorting when average-case performance is important
// When in-place sorting is desired (with a slight modification to the implementation)
// When cache performance is important (good locality of reference)
// Test Problems:
// Implement an in-place version of Quicksort.
// Use Quicksort to find the k-th smallest element in an unsorted array.
// Implement a 3-way partitioning Quicksort for arrays with many duplicate elements.

/**
 * In-place Quicksort Algorithm
 *
 * @param {number[]} arr - The array to be sorted
 * @param {number} low - The starting index of the subarray to be sorted
 * @param {number} high - The ending index of the subarray to be sorted
 */
function inPlaceQuickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, low, high);

    // Recursively sort the left and right subarrays
    inPlaceQuickSort(arr, low, pivotIndex - 1);
    inPlaceQuickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

/**
 * Partition function for in-place Quicksort
 *
 * @param {number[]} arr - The array to be partitioned
 * @param {number} low - The starting index of the subarray
 * @param {number} high - The ending index of the subarray
 * @returns {number} - The final position of the pivot
 */
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Place pivot in correct position
  return i + 1;
}

// Test in-place Quicksort
const arr1 = [64, 34, 25, 12, 22, 11, 90];
console.log("In-place Quicksort:", inPlaceQuickSort(arr1));

/**
 * Find the k-th smallest element using Quicksort partitioning
 *
 * @param {number[]} arr - The input array
 * @param {number} k - The k-th smallest element to find (1-indexed)
 * @returns {number} - The k-th smallest element
 */
function quickSelect(arr, k) {
  return quickSelectHelper(arr, 0, arr.length - 1, k);
}

function quickSelectHelper(arr, low, high, k) {
  if (low === high) return arr[low];

  const pivotIndex = partition(arr, low, high);
  const length = pivotIndex - low + 1;

  if (k === length) {
    return arr[pivotIndex];
  } else if (k < length) {
    return quickSelectHelper(arr, low, pivotIndex - 1, k);
  } else {
    return quickSelectHelper(arr, pivotIndex + 1, high, k - length);
  }
}

// Test quickSelect
const arr2 = [3, 2, 1, 5, 6, 4];
console.log("3rd smallest element:", quickSelect(arr2, 3)); // Expected: 3

/**
 * 3-way partitioning Quicksort for arrays with many duplicates
 *
 * @param {number[]} arr - The array to be sorted
 * @param {number} low - The starting index of the subarray to be sorted
 * @param {number} high - The ending index of the subarray to be sorted
 */
function threeWayQuickSort(arr, low = 0, high = arr.length - 1) {
  if (high <= low) return;

  let lt = low;
  let gt = high;
  const pivot = arr[low];
  let i = low + 1;

  while (i <= gt) {
    if (arr[i] < pivot) {
      [arr[lt], arr[i]] = [arr[i], arr[lt]];
      lt++;
      i++;
    } else if (arr[i] > pivot) {
      [arr[i], arr[gt]] = [arr[gt], arr[i]];
      gt--;
    } else {
      i++;
    }
  }

  threeWayQuickSort(arr, low, lt - 1);
  threeWayQuickSort(arr, gt + 1, high);

  return arr;
}

// Test 3-way Quicksort
const arr3 = [4, 9, 4, 4, 1, 9, 4, 4, 9, 4, 4, 1, 4];
console.log("3-way Quicksort:", threeWayQuickSort(arr3));
