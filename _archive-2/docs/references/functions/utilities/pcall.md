---
  title: pcall()
---

The `pcall` function in lua is used to call another function in protected mode. This means that it safely handles errors that occur during the execution of the function, preventing them from propagating and potentially crashing the program. Instead, it returns a status code and any results from the function or an error message.  

---

### Syntax  
```lua
pcall(f [, arg1, ...])
```

### Parameters  

- **`f`**:  
  The function to be called. This argument is required.  
- **`arg1, ...`**:  
  Additional arguments to be passed to the function `f`. These arguments are optional.  

---

### Return Values  

- **Status Code (boolean)**:  
  The first return value is a boolean that indicates whether the function call succeeded (`true`) or failed (`false`).  
- **Results from the Function (if successful)**:  
  If the call to `f` succeeds without errors, `pcall` returns all results from the function after the status code.  
- **Error Object (if failed)**:  
  If the call to `f` fails due to an error, `pcall` returns `false` followed by the error object (error message).  

---

### Behavior  

1. **Protected Mode**:  
   - The primary purpose of `pcall` is to call a function while preventing errors from propagating up the call stack. This allows developers to handle errors gracefully without terminating the program.  

2. **Error Handling**:  
   - If the function `f` raises an error, `pcall` catches it and returns a `false` status along with the error message. This prevents the program from crashing and allows for custom error handling.  

3. **No Message Handler**:  
   - Unlike regular error handling in lua, errors caught by `pcall` do not invoke a message handler, meaning they do not trigger any custom error functions.  

---

### Use Cases  

- Safely calling functions that may produce errors.  
- Implementing error handling in a lua script without crashing the program.  
- Managing multiple function calls with different potential error sources in a controlled manner.  

---

### Examples  

#### Basic Usage  
```lua
local function successFunction()
    return "Success!"
end

local status, result = pcall(successFunction)
print(status, result)  -- Output: true Success!
```

#### Handling Errors  
```lua
local function errorFunction()
    error("This is an error!")
end

local status, errorMsg = pcall(errorFunction)
print(status, errorMsg)  -- Output: false This is an error!
```

#### Using Arguments  
```lua
local function add(a, b)
    return a + b
end

local status, result = pcall(add, 5, 10)
print(status, result)  -- Output: true 15
```

#### Catching Errors in Multiple Calls  
```lua
local function riskyOperation()
    error("Something went wrong!")
end

local function safeOperation()
    return "All good!"
end

local status1, msg1 = pcall(riskyOperation)
local status2, msg2 = pcall(safeOperation)

print(status1, msg1)  -- Output: false Something went wrong!
print(status2, msg2)  -- Output: true All good!
```

---

### Notes  

1. **Error Handling in lua**:  
   - `pcall` is a crucial function for managing errors in lua, especially in larger applications where unhandled errors can lead to crashes.  

2. **Return Values**:  
   - Always check the first return value of `pcall` to determine whether the call was successful before accessing any additional return values.  

3. **Performance Considerations**:  
   - While `pcall` adds some overhead due to error handling, its benefits in stability and error management often outweigh these costs.  

---

### Summary  

- **Purpose**: Call a function in protected mode to handle errors gracefully.  
- **Return Behavior**: Returns a status code indicating success or failure, followed by the results or error message.  
- **Use Cases**: Safe function calls, error management, and controlled execution of potentially error-prone code.  
