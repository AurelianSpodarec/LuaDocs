---
  title: error()
---

The `error` function in lua raises an error with a specified message as the error object. This function never returns, immediately halting the program unless the error is caught in protected mode (e.g., using `pcall` or `xpcall`). When the error message is a string, `error` adds information about the error position by default. You can customize this behavior using the optional `level` argument.  

---

### Syntax  
```lua
error(message [, level])
```

### Parameters  

- **`message`**:  
  The error message or object. If a string, additional information about the error position may be appended.  

- **`level`** *(optional)*:  
  Specifies how to determine the error position:  
  - **`1` (default)**: The error position is where `error` was called.  
  - **`2`**: Points to where the function that called `error` was called.  
  - **`0`**: Suppresses additional error position information in the message.  

---

### Behavior  

1. **Error Raising**:  
   - Halts execution and propagates the error to the nearest protected call (`pcall` or `xpcall`).  
   - If no protected call is present, the program terminates and displays the error.  

2. **Error Position**:  
   - By default, `error` appends information about the location of the error to the message if it is a string.  

3. **Custom Error Levels**:  
   - You can control how far back in the call stack the error position points by adjusting the `level` argument.  

---

### Use Cases  

- Raising errors when an invalid condition is encountered in your program.  
- Providing detailed feedback when inputs or configurations are incorrect.  
- Debugging by intentionally raising errors with helpful messages.  

---

### Examples  

#### Basic Error Raising  
```lua
error("Something went wrong!")
-- Output: lua: <file>:<line>: Something went wrong!
```

#### Suppressing Error Position Information  
```lua
error("No position info", 0)
-- Output: No position info
```

#### Custom Error Level  
```lua
local function levelTwo()
    error("Error raised at level 2", 2)
end

local function levelOne()
    levelTwo()
end

levelOne()
-- Output: lua: <file>:<line>: Error raised at level 2
-- The line will point to where levelOne() was called, not levelTwo().
```

#### Handling Errors with `pcall`  
```lua
local status, err = pcall(function()
    error("This is a controlled error.")
end)

if not status then
    print("Caught error:", err)
end
-- Output: Caught error: <file>:<line>: This is a controlled error.
```

---

### Notes  

1. **Error Propagation**:  
   Uncaught errors will terminate the program. Always handle errors using `pcall` or `xpcall` when robustness is required.  

2. **Custom Error Objects**:  
   While `message` is often a string, you can pass any lua value. This allows you to use tables or other data structures as error objects.  
   ```lua
   error({code = 404, message = "Not Found"})
   ```

3. **Stack Levels**:  
   Adjusting the `level` argument is particularly useful when creating helper functions that raise errors, as it allows you to point the error to the appropriate context.  

4. **String Concatenation**:  
   If `message` is a string, additional error details (e.g., file and line number) are automatically appended unless `level` is `0`.  

---

### Comparison With Similar Functions  

- **`assert`**:  
  Use `assert` to validate conditions and raise errors when they are not met. Unlike `error`, `assert` is primarily used for inline checks.  
  ```lua
  assert(false, "Assertion failed!")
  -- Output: lua: <file>:<line>: Assertion failed!
  ```

- **`pcall` and `xpcall`**:  
  Use `pcall` or `xpcall` to handle errors raised by `error` or other exceptions gracefully. These functions allow execution to continue after an error.  

---

### Summary  

- **Purpose**: Immediately raises an error and halts program execution unless handled.  
- **Usage**: Best for providing detailed feedback and enforcing program constraints.  
- **Caution**: Be mindful of unhandled errors in production environments; always handle critical errors with `pcall` or similar mechanisms.  