/**
 * Boyer–Moore Majority Vote Algorithm
 */

/**
 * Find the majority element in an array
 * @param {number[]} arr - The input array
 * @return {number|null} - The majority element, or null if none exists
 */
function findMajorityElement(arr) {
  let candidate = null;
  let count = 0;

  // First pass: Find a candidate for the majority element
  for (let num of arr) {
    if (count === 0) {
      // If count is 0, set the current number as the candidate
      candidate = num;
      count = 1;
    } else if (num === candidate) {
      // If the current number is the same as the candidate, increment count
      count++;
    } else {
      // If the current number is different from the candidate, decrement count
      count--;
    }
  }

  // Second pass: Verify if the candidate is actually the majority element
  count = 0;
  for (let num of arr) {
    if (num === candidate) {
      count++;
    }
  }

  // If the count is more than half the array length, it's the majority element
  return count > arr.length / 2 ? candidate : null;
}

// Test the Boyer–Moore Majority Vote Algorithm
let arr = [2, 2, 1, 1, 1, 2, 2];
let result = findMajorityElement(arr);

if (result !== null) {
  console.log(`The majority element is: ${result}`);
} else {
  console.log("No majority element found");
}

// This implementation of the Boyer–Moore Majority Vote Algorithm does the following:
// In the first pass, we use a candidate variable and a count to keep track of a potential majority element.
// If count becomes 0, we set a new candidate.
// We increment count for elements matching the candidate and decrement for others.
// In the second pass, we verify if the candidate is actually the majority element by counting its occurrences.
// If the count is more than half the array length, we return the candidate as the majority element.
// The Boyer–Moore Majority Vote Algorithm is efficient for finding a majority element (an element that appears more than n/2 times in an array of n elements) in linear time and constant space.
