---
  title: tostring()
---

The `tostring` function in lua is used to convert a value of any type into a string representation. It is particularly useful for displaying values in a human-readable format.

---

### Syntax  
```lua
tostring(value)
```

### Parameters  

- **`value`**:  
  The value to be converted to a string. This can be of any lua type, including numbers, tables, functions, and more.

---

### Return Value  

- Returns the string representation of the input value `value`.

---

### Behavior  

1. **Default Conversion**:  
   - If the value `value` is a number, string, boolean, or nil, `tostring` converts it to a string using lua's default conversion rules.

2. **Metatables and Custom Formatting**:  
   - If `value` has a metatable with a `__tostring` field, `tostring` calls the function stored in this field, passing `value` as the argument. The return value from this function is used as the result of `tostring`.
   - If the metatable contains a `__name` field with a string value, this string may be included in the final output of `tostring`.

3. **Full Control**:  
   - For complete control over the formatting of numbers or other types, the `string.format` function should be used instead.

---

### Use Cases  

- **Displaying Values**: This function is often used for printing or logging values in a readable format.
  
- **Debugging**: It helps in debugging by converting complex types, such as tables, into strings that can be easily viewed.

---

### Examples  

#### Basic Usage  
```lua
print(tostring(42))          -- Output: "42"
print(tostring(3.14))        -- Output: "3.14"
print(tostring(true))        -- Output: "true"
print(tostring(nil))         -- Output: "nil"
print(tostring("Hello"))     -- Output: "Hello"
```

#### Using Metatables  
```lua
-- Define a table with a custom __tostring method
local tableData = {}
setmetatable(tableData, {
    __tostring = function(t) 
        return "This is a custom table!"
    end
})

print(tostring(tableData))      -- Output: "This is a custom table!"

-- Define a table with a __name field
local anotherTable = {}
setmetatable(anotherTable, {
    __name = "AnotherTable"
})

print(tostring(anotherTable))  -- Output may include the name based on implementation
```

#### Formatting Numbers  
```lua
-- Using string.format for detailed control
print(string.format("Formatted number: %.2f", 3.14159))  -- Output: "Formatted number: 3.14"
```

---

### Notes  

- **Metatable Behavior**: If both `__tostring` and `__name` fields are present, `__tostring` will take precedence.
  
- **Non-string Results**: If the value does not have a `__tostring` method and is not directly convertible, `tostring` will call the default string conversion behavior for that type.

---

### Summary  

- **Purpose**: Converts any lua value into a human-readable string format.  
- **Return Behavior**: Returns the string representation of the input value.  
- **Use Cases**: Ideal for displaying values for debugging or logging, as well as for providing custom string representations of complex types through metatables.
