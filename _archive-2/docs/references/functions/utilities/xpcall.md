---
  title: xpcall()
---

The `xpcall` function in lua is an extended version of `pcall` that allows for error handling with a custom message handler. It provides a way to call a function in protected mode while also specifying how to handle any errors that occur during the execution of that function.

---

### Syntax  
```lua
xpcall(f, message [, arg1, ···])
```

### Parameters  

- **`f`**:  
  The function to be called.

- **`message`**:  
  A message handler function that will be called when an error occurs. This function receives the error message as its argument.

- **`arg1, ···`**:  
  Optional arguments to pass to the function `f`.

---

### Return Value  

- Returns a boolean status code (true if the call succeeded without errors, false otherwise) and any additional results returned by the function `f`, or the error message if an error occurred.

---

### Behavior  

1. **Protected Call**:  
   Similar to `pcall`, `xpcall` invokes the function `f` in protected mode, meaning that errors inside `f` do not propagate but are caught by `xpcall`.

2. **Custom Error Handling**:  
   If an error occurs, `xpcall` calls the provided message handler `message`, passing the error message to it. The handler can format or log the error message as needed.

3. **Returns**:  
   - If the function `f` executes successfully, `xpcall` returns true followed by the results from `f`.
   - If `f` fails, it returns false and the error message.

---

### Use Cases  

- **Error Handling**: `xpcall` is useful for handling errors in a controlled manner, especially in complex applications where custom error reporting is needed.

- **Logging Errors**: The message handler can be used to log errors in a specific format, making it easier to debug issues.

---

### Examples  

#### Basic Usage  
```lua
function faultyFunction()
    error("Something went wrong!")
end

local function errorHandler(err)
    print("Error occurred: " .. err)
end

local status, result = xpcall(faultyFunction, errorHandler)

print(status)  -- Output: false
print(result)  -- Output: "Error occurred: Something went wrong!"
```

#### Custom Error Handling  
```lua
function division(a, b)
    if b == 0 then
        error("Division by zero!")
    end
    return a / b
end

local function errorHandler(err)
    print("Custom Error: " .. err)
end

local status, result = xpcall(function() return division(10, 0) end, errorHandler)

print(status)  -- Output: false
print(result)  -- Output: "Custom Error: Division by zero!"
```

---

### Notes  

- **Custom Message Handler**: The message handler can perform additional operations, such as logging errors to a file or sending alerts.

- **Error Message**: The error message passed to `message` can be modified or formatted as desired within the handler.

---

### Summary  

- **Purpose**: Calls a function in protected mode with a custom error message handler.  
- **Return Behavior**: Returns a boolean status code and either results from the function or the error message.  
- **Use Cases**: Ideal for controlled error handling and custom error logging.
