---
  title: pairs()
---

The `pairs` function in lua is used to iterate over all key-value pairs in a table. It provides an iterator function that works with any table, allowing developers to traverse the table and access its contents.  

---

### Syntax  
```lua
pairs(tableData)
```

### Parameters  

- **`tableData`**:  
  The table to be traversed. This argument is required.  

---

### Return Values  

- If the table `tableData` has a metamethod `__pairs`, `pairs` calls this metamethod with `tableData` as the argument and returns the first three results from that call.  
- Otherwise, `pairs` returns three values: the `next` function, the table `tableData`, and `nil`. This enables the following construction:  
  ```lua
  for key, value in pairs(tableData) do body end
  ```
  This loop will iterate over all key-value pairs in the table `tableData`.  

---

### Behavior  

1. **Iteration Process**:  
   - The `pairs` function allows for iterating through all key-value pairs in a table. It returns an iterator function, which can be used in a loop to access each key and its associated value.  

2. **Metamethods**:  
   - If the table has a `__pairs` metamethod defined, it is called to retrieve the values for iteration instead of using the default behavior.  

3. **Order of Enumeration**:  
   - The order in which keys are returned is not specified and may vary. This behavior means that the traversal does not guarantee any particular sequence, unlike numerical indices.  

4. **Modifying Tables During Traversal**:  
   - Similar to the `next` function, modifying a table while iterating over it can lead to unexpected behavior. It is generally advised to avoid adding or removing keys during iteration, although existing keys can be modified.  

---

### Use Cases  

- Implementing custom iteration over tables.  
- Accessing all key-value pairs in a table without concern for order.  
- Utilizing metamethods for specialized table behavior during iteration.  

---

### Examples  

#### Basic Usage  
```lua
local tableData = {a = 1, b = 2, c = 3}
for key, value in pairs(tableData) do
    print(key, value)  -- Output: a 1, b 2, c 3 (order may vary)
end
```

#### Using Metamethods  
```lua
local tableData = setmetatable({}, {
    __pairs = function(t)
        return function() return "customKey", "customValue" end
    end
})

for key, value in pairs(tableData) do
    print(key, value)  -- Output: customKey customValue
end
```

#### Checking for Empty Tables  
```lua
local tableData = {}
for key, value in pairs(tableData) do
    print(key, value)  -- This block will not execute
end
print("Table is empty.")  -- Output: Table is empty.
```

#### Modifying a Table During Iteration  
```lua
local tableData = {a = 1, b = 2, c = 3}
for key, value in pairs(tableData) do
    if key == "b" then
        tableData[key] = nil  -- Set the field 'b' to nil
    end
end

-- After modification
for k, v in pairs(tableData) do
    print(k, v)  -- Output: a 1, c 3 (b is not printed)
end
```

---

### Notes  

1. **Non-Specified Order**:  
   - Be cautious when relying on the order of keys when using `pairs`, as the enumeration order is not guaranteed.  

2. **Performance**:  
   - The `pairs` function is efficient for table iteration and is often used in loops.  

3. **Empty Tables**:  
   - If a table is empty, the loop body will not execute, and no errors will occur.  

---

### Summary  

- **Purpose**: Iterate over all key-value pairs in a table.  
- **Return Behavior**: Returns the `next` function, the table, and `nil` for iteration or invokes a metamethod if defined.  
- **Modifications**: Avoid adding or removing keys during iteration to prevent unexpected results.  
- **Order**: The order of keys is not guaranteed; use a numerical for loop for ordered iteration.  
