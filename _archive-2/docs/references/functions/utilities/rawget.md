---
  title: rawget()
---

The `rawget` function in lua retrieves the real value of a specified index from a table without invoking the `__index` metamethod. This allows for direct access to the table's contents, bypassing any custom behaviors defined by the table's metatable.  

---

### Syntax  
```lua
rawget(table, index)
```

### Parameters  

- **`table`**:  
  A table from which to retrieve the value. This parameter must be of type table.  

- **`index`**:  
  The index for which the value is being retrieved. This can be of any lua type, including strings, numbers, or other values.  

---

### Return Values  

- Returns the value associated with `index` in `table`.  
- If `index` does not exist in the table, it returns `nil`.  

---

### Behavior  

- The `rawget` function retrieves the value directly from the specified table, ignoring any `__index` metamethods that may be defined in the table's metatable.  

- This is useful for scenarios where you need to access the raw data in a table without interference from custom behaviors that could alter the expected value.  

---

### Use Cases  

- **Accessing Raw Data**: When you want to retrieve the actual contents of a table without any custom retrieval logic affecting the result.  

- **Working with Metatables**: Useful in situations where you are dealing with tables that have metatables defining custom behaviors, and you need to bypass these behaviors.  

---

### Examples  

#### Basic Usage  
```lua
local myTable = { a = 10, b = 20 }

print(rawget(myTable, 'a'))  -- Output: 10
print(rawget(myTable, 'b'))  -- Output: 20
print(rawget(myTable, 'c'))  -- Output: nil (key does not exist)
```

#### Using with Metatables  
```lua
local mt = {
    __index = function(t, k) return "default" end
}

local myTable = setmetatable({ a = 10 }, mt)

print(rawget(myTable, 'a'))  -- Output: 10 (accesses raw value)
print(rawget(myTable, 'b'))  -- Output: nil (key does not exist)
print(myTable.b)              -- Output: "default" (calls __index metamethod)
```

#### Retrieving from Nested Tables  
```lua
local nestedTable = { subTable = { x = 5, y = 10 } }

print(rawget(nestedTable.subTable, 'x'))  -- Output: 5
print(rawget(nestedTable.subTable, 'y'))  -- Output: 10
print(rawget(nestedTable.subTable, 'z'))  -- Output: nil (key does not exist)
```

---

### Notes  

1. **Direct Access**:  
   - `rawget` provides a means of accessing the true contents of a table, ensuring that the retrieval process is not affected by any potential custom behaviors associated with the table's metatable.  

2. **Return Value**:  
   - If the specified index does not exist, `rawget` will return `nil`, which is important to consider when checking for the existence of values in a table.  

3. **Performance**:  
   - Using `rawget` can be more efficient in certain scenarios where you want to avoid the overhead of metamethod invocations.  

---

### Summary  

- **Purpose**: Retrieve the real value of `table[index]` without invoking the `__index` metamethod.  
- **Return Behavior**: Returns the associated value or `nil` if the index does not exist.  
- **Use Cases**: Accessing raw data, working with tables that have custom behaviors defined by metatables.  
