---
  title: assert()
---

The `assert()` function raises an error if the value of its argument `assertValue` is false (i.e., `nil` or `false`); otherwise, it returns all its arguments. In case of an error, `errorMessage` is the error object; when absent, it defaults to "assertion failed!"

**Syntax**  
`assert(assertValue [, errorMessage])`

**Parameters**  
- **`assertValue`**: The value to be asserted; if false, an error will be raised.  
- **`errorMessage`** (optional): The error message to display if the assertion fails.

**Use Cases**  
The `assert()` function is useful for debugging and validating conditions in your code. It helps ensure that certain assumptions hold true during execution. By raising an error when a condition is not met, it prevents further code execution that might rely on that assumption, making it easier to identify issues early in the development process.

**Examples**  

- **When only the value is provided**:  
  If the value is truthy, the function returns the value.

  ```lua
  print(assert(true))  
  -- Output: true
  ```

- **When the value is false**:  
  The function raises an error with the default message.

  ```lua
  print(assert(false))  
  -- Output: lua: ...: assertion failed!
  ```

- **When a message is provided**:  
  If the value is false, the function raises an error with the specified message.

  ```lua
  print(assert(false, "Custom error message"))  
  -- Output: lua: ...: Custom error message
  ```

- **When the value is true and a message is provided**:  
  The function returns the value regardless of the message.

  ```lua
  print(assert(true, "This will not be shown"))  
  -- Output: true
  ```

**Reference**: [lua 5.4 Manual - assert()](https://lua.org/manual/5.4/manual.html#pdf-assert)
