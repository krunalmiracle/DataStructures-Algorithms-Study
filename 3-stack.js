// File: Stack.js

class Stack {
  constructor() {
    this.items = [];
  }

  /**
   * Push Operation
   *
   * Reasoning:
   * The push operation adds an element to the top of the stack. This is fundamental
   * to the Last-In-First-Out (LIFO) principle of stacks.
   *
   * Assumptions:
   * - The stack has no fixed size limit (can grow dynamically).
   * - Adding an element is always possible (no overflow check).
   *
   * Algorithm:
   * 1. Add the element to the end of the internal array.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  push(element) {
    this.items.push(element);
  }

  /**
   * Pop Operation
   *
   * Reasoning:
   * The pop operation removes and returns the top element of the stack, adhering
   * to the LIFO principle.
   *
   * Assumptions:
   * - The stack may be empty, in which case an error message is returned.
   *
   * Algorithm:
   * 1. If the stack is empty, return an error message.
   * 2. Remove and return the last element of the internal array.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop();
  }

  /**
   * Peek Operation
   *
   * Reasoning:
   * Peek allows viewing the top element without removing it, which is useful
   * for making decisions based on the top element without modifying the stack.
   *
   * Assumptions:
   * - The stack may be empty, in which case an error message is returned.
   *
   * Algorithm:
   * 1. If the stack is empty, return an error message.
   * 2. Return the last element of the internal array without removing it.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }

  /**
   * isEmpty Operation
   *
   * Reasoning:
   * Checking if the stack is empty is crucial for preventing errors when
   * attempting to pop or peek from an empty stack.
   *
   * Assumptions:
   * - An empty stack has no elements.
   *
   * Algorithm:
   * 1. Return true if the internal array's length is 0, false otherwise.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Size Operation
   *
   * Reasoning:
   * Knowing the size of the stack is useful for various applications and can
   * help in decision-making processes.
   *
   * Assumptions:
   * - The size is always non-negative.
   *
   * Algorithm:
   * 1. Return the length of the internal array.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  size() {
    return this.items.length;
  }

  /**
   * Clear Operation
   *
   * Reasoning:
   * Clearing the stack is useful when you need to reset it to its initial state
   * without creating a new stack instance.
   *
   * Assumptions:
   * - After clearing, the stack should be empty.
   *
   * Algorithm:
   * 1. Reset the internal array to an empty array.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  clear() {
    this.items = [];
  }

  /**
   * Print Operation
   *
   * Reasoning:
   * Printing the stack contents is useful for debugging and visualization purposes.
   *
   * Assumptions:
   * - The elements in the stack can be converted to strings.
   *
   * Algorithm:
   * 1. Join the elements of the internal array into a string and print it.
   *
   * Time Complexity: O(n), where n is the number of elements in the stack.
   * Space Complexity: O(n) for creating the string representation.
   */
  print() {
    console.log(this.items.toString());
  }
}

/**
 * Balanced Parentheses Checker
 *
 * Reasoning:
 * Checking for balanced parentheses is a common problem in parsing expressions,
 * validating syntax in programming languages, and ensuring correct nesting in various structures.
 *
 * Assumptions:
 * - Only considers parentheses, square brackets, and curly braces.
 * - Other characters in the string are ignored.
 *
 * Algorithm:
 * 1. Create an empty stack.
 * 2. Iterate through each character in the string:
 *    a. If it's an opening bracket, push it onto the stack.
 *    b. If it's a closing bracket:
 *       - If the stack is empty, return false (unmatched closing bracket).
 *       - If the top of the stack doesn't match the current closing bracket, return false.
 *       - Otherwise, pop the top element from the stack.
 * 3. After iterating, return true if the stack is empty, false otherwise.
 *
 * Time Complexity: O(n), where n is the length of the string.
 * Space Complexity: O(n) in the worst case, when all characters are opening brackets.
 */
function isBalancedParentheses(str) {
  let stack = new Stack();
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else if (char === ")" || char === "]" || char === "}") {
      if (stack.isEmpty()) {
        return false;
      }
      let last = stack.pop();
      if (
        (char === ")" && last !== "(") ||
        (char === "]" && last !== "[") ||
        (char === "}" && last !== "{")
      ) {
        return false;
      }
    }
  }
  return stack.isEmpty();
}

// Example usage
let stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log("Stack:");
stack.print();
console.log("Top element:", stack.peek());
console.log("Popped element:", stack.pop());
console.log("Stack size:", stack.size());

console.log(
  "Balanced parentheses: ((){}[])",
  isBalancedParentheses("((){}[])")
);
console.log("Balanced parentheses: (()", isBalancedParentheses("(()"));
