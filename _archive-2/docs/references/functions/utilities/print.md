---
  title: print()
---

The `print` function in lua is a simple utility for outputting values to the standard output (stdout). It accepts a variable number of arguments, converts each to a string, and displays them. This function is commonly used for debugging purposes or for quick demonstrations of values.  

---

### Syntax  
```lua
print(...)
```

### Parameters  

- **`...`**:  
  Any number of arguments. These can be of any type, and they will be converted to strings for output.  

---

### Return Values  

- The `print` function does not return any values; its purpose is solely to output to the standard output.  

---

### Behavior  

1. **Conversion to String**:  
   - Each argument passed to `print` is converted to a string using the `tostring` function. This means that values of any type (numbers, tables, booleans, etc.) can be printed.  

2. **Output Format**:  
   - The `print` function outputs the arguments as they are, separated by a space. It does not provide any formatting options; for formatted output, consider using `string.format` or `io.write`.  

3. **Line Break**:  
   - After printing the values, `print` automatically adds a newline character, moving the cursor to the next line for subsequent outputs.  

---

### Use Cases  

- Debugging: Quickly display variable values during development.  
- Demonstration: Show outputs in examples or tutorials.  
- Basic logging: Provide simple console output for applications.  

---

### Examples  

#### Basic Usage  
```lua
print("Hello, World!")  -- Output: Hello, World!
```

#### Printing Multiple Values  
```lua
local a = 10
local b = 20
print("The sum is:", a + b)  -- Output: The sum is: 30
```

#### Printing Different Data Types  
```lua
local str = "lua"
local num = 3.14
local bool = true
print("String:", str, "Number:", num, "Boolean:", bool)  
-- Output: String: lua Number: 3.14 Boolean: true
```

#### Printing Tables  
```lua
local tableData = {x = 1, y = 2}
print("Table:", tableData)  -- Output: Table: table: 0x... (memory address)
```

#### Debugging Example  
```lua
local function debugInfo(var1, var2)
    print("Debugging values:", var1, var2)
end

debugInfo(5, "test")  -- Output: Debugging values: 5 test
```

---

### Notes  

1. **Limitations**:  
   - The `print` function is not designed for formatted output. For formatted strings, use `string.format`.  

2. **Output Redirection**:  
   - By default, `print` sends output to stdout, but this can be redirected in certain environments or through lua's I/O libraries.  

3. **Performance**:  
   - While `print` is suitable for debugging, excessive use in production code can lead to performance issues, particularly in performance-sensitive applications.  

---

### Summary  

- **Purpose**: Output values to standard output for debugging or demonstration.  
- **Return Behavior**: Does not return any values; simply outputs to stdout.  
- **Use Cases**: Debugging, displaying values, and basic logging.  
