---
  title: rawset()
---

The `rawset` function in lua allows you to set the value of a specified index in a table directly, bypassing any `__newindex` metamethod that might be defined for that table. This function is useful when you want to ensure that the value is set without triggering any custom behavior that may be associated with setting values in the table.  

---

### Syntax  
```lua
rawset(table, index, value)
```

### Parameters  

- **`table`**:  
  The table in which the value is to be set. This must be a valid table.  

- **`index`**:  
  The index at which to set the value. This can be any value except `nil` or `NaN`.  

- **`value`**:  
  The value to assign to the specified index in the table. This can be any lua value.  

---

### Return Value  

- Returns the `table` itself after setting the specified index to the provided value.  

---

### Behavior  

- The `rawset` function provides a way to set values in a table without invoking the `__newindex` metamethod.  

- This is particularly useful for directly manipulating tables in situations where you do not want to trigger any custom behavior that may interfere with standard assignment.  

---

### Use Cases  

- **Direct Value Assignment**: When you need to set a value in a table without invoking any metamethods.  

- **Modifying Protected Tables**: Useful for modifying tables that may have restrictions due to custom behavior defined by metamethods.  

---

### Examples  

#### Setting Values in a Table  
```lua
local myTable = {}

rawset(myTable, "key1", "value1")  
print(myTable.key1)  -- Output: value1
```

#### Using with Metatables  
```lua
local mt = {
    __newindex = function(table, key, value)
        print("Attempting to set " .. key .. " to " .. value)  -- Custom behavior
    end
}

local myTable = setmetatable({}, mt)

rawset(myTable, "key2", "value2")  
print(myTable.key2)  -- Output: value2 (sets without invoking __newindex)
```

#### Setting Values with Non-standard Indices  
```lua
local anotherTable = {}

rawset(anotherTable, 5, "fifth value")  
print(anotherTable[5])  -- Output: fifth value

rawset(anotherTable, "name", "example")  
print(anotherTable.name)  -- Output: example
```

---

### Notes  

1. **Direct Manipulation**:  
   - Use `rawset` when you need to manipulate a table directly without the interference of metamethods.  

2. **Return Value**:  
   - The function always returns the original table, allowing for method chaining if desired.  

3. **Index Restrictions**:  
   - The `index` parameter must be a value that is neither `nil` nor `NaN`; otherwise, the function will not behave as expected.  

---

### Summary  

- **Purpose**: Sets the real value of `table[index]` to `value`, without invoking the `__newindex` metamethod.  
- **Return Behavior**: Returns the modified table itself after the assignment.  
- **Use Cases**: Direct value assignment, modifying protected tables.  
