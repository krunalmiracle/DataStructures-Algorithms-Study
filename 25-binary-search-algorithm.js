/**
 * Binary Search Algorithm
 *
 * @param {number[]} sortedArray - The sorted array to search
 * @param {number} targetValue - The value to search for
 * @returns {number} - The index of the target value, or -1 if not found
 */
function binarySearch(sortedArray, targetValue) {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    // Calculate the middle index
    const middleIndex = Math.floor((left + right) / 2);
    const middleValue = sortedArray[middleIndex];

    // If the target value is found, return the index
    if (middleValue === targetValue) {
      return middleIndex;
    }
    // If the target value is less than the middle value, search the left half
    else if (targetValue < middleValue) {
      right = middleIndex - 1;
    }
    // If the target value is greater than the middle value, search the right half
    else {
      left = middleIndex + 1;
    }
  }

  // Target value not found
  return -1;
}

// Test cases
console.log(binarySearch([1, 3, 5, 7, 9], 5)); // Output: 2
console.log(binarySearch([1, 3, 5, 7, 9], 6)); // Output: -1
console.log(binarySearch([1, 3, 5, 7, 9], 1)); // Output: 0
console.log(binarySearch([1, 3, 5, 7, 9], 9)); // Output: 4

// Explanation:
// The binarySearch function takes a sorted array and a target value as input.
// It initializes left and right pointers to the start and end of the array, respectively.
// It then enters a loop that continues as long as left is less than or equal to right.
// In each iteration, it calculates the middle index and the corresponding middle value.
// It compares the target value with the middle value:
// If they are equal, the target value is found, and the function returns the middle index.
// If the target value is less than the middle value, the search space is narrowed to the left half of the array.
// If the target value is greater than the middle value, the search space is narrowed to the right half of the array.
// If the loop completes without finding the target value, the function returns -1 to indicate that the value was not found.
// Time Complexity:
// Best Case: O(1) - when the target value is found at the middle index.
// Average Case: O(log n) - where n is the size of the input array.
// Worst Case: O(log n) - when the target value is not found in the array.
// Use Cases:
// Searching for an element in a sorted array.
// Implementing binary search trees (BSTs) and other data structures that rely on sorted data.
// Solving problems that can be reduced to a binary search, such as finding the square root of a number.
