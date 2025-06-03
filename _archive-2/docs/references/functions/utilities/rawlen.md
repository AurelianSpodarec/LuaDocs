---
  title: rawlen()
---

The `rawlen` function in lua returns the length of a given object, which can be a table or a string, without invoking the `__len` metamethod. This allows for a direct measurement of the length of the object, bypassing any custom behavior that may be defined for length calculations.  

---

### Syntax  
```lua
rawlen(value)
```

### Parameters  

- **`value`**:  
  The object whose length is to be determined. This can be either a table or a string.  

---

### Return Value  

- Returns an integer representing the length of the object `value`.  
- If `value` is a table, it returns the number of keys in the table.  
- If `value` is a string, it returns the number of characters in the string.  

---

### Behavior  

- The `rawlen` function provides a means to obtain the length of a table or string without invoking the `__len` metamethod, which could potentially alter the expected length.  

- This is particularly useful when you need to ensure that you are getting the actual length without interference from any custom implementations of length measurement.  

---

### Use Cases  

- **Determining Actual Length**: When you need to know the true length of a table or string without any modifications from metamethods.  

- **Debugging**: Useful for debugging purposes to confirm the actual size of a data structure.  

---

### Examples  

#### Using with Strings  
```lua
local myString = "Hello, World!"
print(rawlen(myString))  -- Output: 13 (length of the string)
```

#### Using with Tables  
```lua
local tableData = { a = 1, b = 2, c = 3 }
print(rawlen(tableData))  -- Output: 3 (number of keys in the table)

local anotherTable = {}
print(rawlen(anotherTable))  -- Output: 0 (empty table)
```

#### Using with Metatables  
```lua
local mt = {
    __len = function() return 100 end  -- Custom length behavior
}

local tableData = setmetatable({ a = 1, b = 2 }, mt)

print(rawlen(tableData))  -- Output: 2 (actual number of keys in the table)
```

---

### Notes  

1. **Direct Measurement**:  
   - `rawlen` allows for the retrieval of the length without the influence of custom behaviors defined in a metatable.  

2. **Return Value**:  
   - The return value is always an integer representing the length of the object.  

3. **Types Supported**:  
   - The function only supports tables and strings as valid input types. Passing other types may result in an error or unexpected behavior.  

---

### Summary  

- **Purpose**: Returns the length of the object `value` without invoking the `__len` metamethod.  
- **Return Behavior**: Returns the actual length of the string or the number of keys in the table.  
- **Use Cases**: Determining actual length, debugging data structures.  
