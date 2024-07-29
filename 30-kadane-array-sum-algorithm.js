/**
 * Kadane's Algorithm to find the maximum sum contiguous subarray
 * @param {number[]} arr - The input array of numbers
 * @return {object} - An object containing the maximum sum and the start and end indices of the subarray
 */
function kadanesAlgorithm(arr) {
  // Initialize variables to keep track of the maximum sum and current sum
  let maxSum = arr[0];
  let currentSum = arr[0];
  let start = 0;
  let end = 0;
  let tempStart = 0;

  // Iterate through the array starting from the second element
  for (let i = 1; i < arr.length; i++) {
    // If the current element is greater than the sum of itself and the previous subarray,
    // start a new subarray from this element
    if (arr[i] > currentSum + arr[i]) {
      currentSum = arr[i];
      tempStart = i;
    } else {
      // Otherwise, extend the previous subarray by including this element
      currentSum = currentSum + arr[i];
    }

    // Update the maximum sum and the end index if we've found a new maximum
    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  // Return an object with the maximum sum and the start and end indices of the subarray
  return { maxSum, start, end };
}

// Test the Kadane's Algorithm
const testArray = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const result = kadanesAlgorithm(testArray);
console.log(`Maximum sum: ${result.maxSum}`);
console.log(`Subarray: [${testArray.slice(result.start, result.end + 1)}]`);

// This implementation of Kadane's Algorithm does the following:
// We initialize variables to keep track of the maximum sum, current sum, and the start and end indices of the maximum subarray.
// We iterate through the array, updating the current sum and comparing it with the maximum sum found so far.
// If we find a new maximum sum, we update the maxSum and the start and end indices.
// Finally, we return an object containing the maximum sum and the indices of the subarray.
// Test problems for Kadane's Algorithm:
// Find the maximum sum subarray in [1, -3, 2, 1, -1]
// Handle an array with all negative numbers: [-2, -3, -1, -5]
// Find the maximum sum subarray in an array with all positive numbers: [1, 2, 3, 4, 5]
// Test with a large array of alternating positive and negative numbers
