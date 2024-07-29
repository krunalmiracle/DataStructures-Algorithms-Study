/**
 * Merge Sort Algorithm
 *
 * @param {number[]} arrayToSort - The array of numbers to be sorted
 * @returns {number[]} - The sorted array
 */
function mergeSort(arrayToSort) {
  // Base case: if the array has 1 or fewer elements, it's already sorted
  if (arrayToSort.length <= 1) {
    return arrayToSort;
  }

  // Find the middle index of the array
  const middleIndex = Math.floor(arrayToSort.length / 2);

  // Divide the array into left and right halves
  const leftHalf = arrayToSort.slice(0, middleIndex);
  const rightHalf = arrayToSort.slice(middleIndex);

  // Recursively sort both halves
  const sortedLeft = mergeSort(leftHalf);
  const sortedRight = mergeSort(rightHalf);

  // Merge the sorted halves
  return merge(sortedLeft, sortedRight);
}

/**
 * Merge two sorted arrays into a single sorted array
 *
 * @param {number[]} leftArray - The left sorted array
 * @param {number[]} rightArray - The right sorted array
 * @returns {number[]} - The merged sorted array
 */
function merge(leftArray, rightArray) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // Compare elements from both arrays and add the smaller one to the result
  while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
    if (leftArray[leftIndex] < rightArray[rightIndex]) {
      result.push(leftArray[leftIndex]);
      leftIndex++;
    } else {
      result.push(rightArray[rightIndex]);
      rightIndex++;
    }
  }

  // Add any remaining elements from the left array
  while (leftIndex < leftArray.length) {
    result.push(leftArray[leftIndex]);
    leftIndex++;
  }

  // Add any remaining elements from the right array
  while (rightIndex < rightArray.length) {
    result.push(rightArray[rightIndex]);
    rightIndex++;
  }

  return result;
}

// Test cases
console.log(mergeSort([64, 34, 25, 12, 22, 11, 90])); // Expected: [11, 12, 22, 25, 34, 64, 90]
console.log(mergeSort([5, 2, 9, 1, 7, 6, 3])); // Expected: [1, 2, 3, 5, 6, 7, 9]
console.log(mergeSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])); // Expected: [1, 1, 2, 3, 3, 4, 5, 5, 6, 9]
console.log(mergeSort([1])); // Expected: [1]
console.log(mergeSort([])); // Expected: []

// Explanation:
// The mergeSort function is the main entry point of the algorithm:
// It first checks if the array has 1 or fewer elements (base case for recursion).
// It then divides the array into two halves.
// It recursively calls itself on both halves.
// Finally, it merges the sorted halves using the merge function.
// The merge function combines two sorted arrays:
// It compares elements from both arrays, adding the smaller one to the result.
// After one array is exhausted, it adds any remaining elements from the other array.
// Time Complexity:
// Best Case: O(n log n)
// Average Case: O(n log n)
// Worst Case: O(n log n)
// Space Complexity:
// O(n) - It requires additional space proportional to the input size.
// Use Cases:
// Sorting large datasets that don't fit in memory (external sorting).
// Sorting linked lists (can be implemented with O(1) extra space).
// When stable sorting is required (maintains relative order of equal elements).
// Test Problems:
// Sort an array of integers in ascending order.
// Sort an array of strings alphabetically.
// Sort an array of objects based on a specific property.
// Let's implement solutions for these test problems:

// Problem 1: Sort an array of integers in ascending order
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted numbers:", mergeSort(numbers));

// Problem 2: Sort an array of strings alphabetically
function mergeSortStrings(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return mergeStrings(mergeSortStrings(left), mergeSortStrings(right));
}

function mergeStrings(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].localeCompare(right[rightIndex]) <= 0) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

const fruits = ["banana", "apple", "cherry", "date", "elderberry"];
console.log("Sorted fruits:", mergeSortStrings(fruits));

// Problem 3: Sort an array of objects based on a specific property
function mergeSortObjects(arr, property) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return mergeObjects(
    mergeSortObjects(left, property),
    mergeSortObjects(right, property),
    property
  );
}

function mergeObjects(left, right, property) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex][property] <= right[rightIndex][property]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

const people = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 },
  { name: "David", age: 28 },
];
console.log("Sorted people by age:", mergeSortObjects(people, "age"));
