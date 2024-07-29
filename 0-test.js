const a = [2, 4, 5, 9];

function quickSort(arr) {
  if (arr.length <= 1) {
    console.log("array length is less than equal to 1.");
    return arr;
  }
  const pivot = 0;
  console.log("pivot: ", pivot);
  const leftArr = [];
  const rightArr = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[pivot]) leftArr.push(arr[i]);
    else rightArr.push(arr[i]);
  }
  return [...quickSort(leftArr), arr[pivot], ...quickSort(rightArr)];
}

console.log("quickSort array: ", quickSort(a));
