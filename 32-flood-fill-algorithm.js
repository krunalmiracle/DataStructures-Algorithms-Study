/**
 * Flood Fill Algorithm
 * @param {number[][]} image - The 2D array representing the image
 * @param {number} sr - The starting row
 * @param {number} sc - The starting column
 * @param {number} newColor - The new color to fill with
 * @return {number[][]} - The modified image after flood fill
 */
function floodFill(image, sr, sc, newColor) {
  const originalColor = image[sr][sc];

  // If the start pixel is already the new color, no need to do anything
  if (originalColor === newColor) {
    return image;
  }

  const dfs = (row, col) => {
    // Check if we're out of bounds or if the current pixel is not the original color
    if (
      row < 0 ||
      row >= image.length ||
      col < 0 ||
      col >= image[0].length ||
      image[row][col] !== originalColor
    ) {
      return;
    }

    // Change the color of the current pixel
    image[row][col] = newColor;

    // Recursively fill the neighboring pixels
    dfs(row + 1, col); // Down
    dfs(row - 1, col); // Up
    dfs(row, col + 1); // Right
    dfs(row, col - 1); // Left
  };

  // Start the flood fill from the given starting point
  dfs(sr, sc);

  return image;
}

// Test the Flood Fill Algorithm
const image = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
];
const sr = 1,
  sc = 1,
  newColor = 2;

console.log("Original image:");
console.log(image);

const filledImage = floodFill(image, sr, sc, newColor);

console.log("Image after flood fill:");
console.log(filledImage);

// This implementation of the Flood Fill Algorithm does the following:
// We first check if the starting pixel is already the new color. If so, we return the image unchanged.
// We use a depth-first search (DFS) approach to recursively fill connected pixels.
// In the DFS function, we first check if we're out of bounds or if the current pixel is not the original color.
// If either is true, we return.
// If the checks pass, we change the color of the current pixel to the new color.
// We then recursively call the DFS function on the four neighboring pixels (up, down, left, right).
// Finally, we return the modified image.
// Test problems for Flood Fill Algorithm:
// Fill a large area in a complex image
// Fill an area that's already the target color
// Fill from a corner of the image
// Fill an image where the target area is surrounded by a different color
