---
  title: setmetatable()
---

The `setmetatable` function in lua is used to assign a metatable to a given table, enabling the customization of table behaviors through metamethods.

---

### Syntax  
```lua
setmetatable(table, metatable)
```

### Parameters  

- **`table`**:  
  The table for which you want to set the metatable.

- **`metatable`**:  
  The metatable to be associated with the table. If this parameter is `nil`, it removes the current metatable from the table.

---

### Return Value  

- Returns the original `table` after setting or removing the metatable.

---

### Behavior  

1. **Setting a Metatable**:  
   If the `metatable` parameter is not `nil`, it assigns the specified metatable to the provided table. This allows the table to utilize metamethods defined in the metatable.

2. **Removing a Metatable**:  
   If `metatable` is `nil`, the function removes any existing metatable from the specified table.

3. **Error Handling**:  
   If the original metatable has a `__metatable` field, an error is raised when attempting to change the metatable. This mechanism is used to protect certain tables from modification.

4. **Debugging**:  
   To change the metatable of other lua types (e.g., userdata), you need to use the debug library, as `setmetatable` can only be applied to tables directly.

---

### Use Cases  

- **Customizing Table Behavior**: By defining metamethods (like `__index`, `__newindex`, `__add`, etc.) in the metatable, you can control how the table interacts with operators and functions.

- **Implementing Object-Oriented Programming**: You can use metatables to simulate classes and inheritance in lua, allowing for more structured code.

---

### Examples  

#### Setting a Metatable  
```lua
local myTable = {}
local myMetatable = {
    __index = function(table, key)
        return "Key not found: " .. key
    end
}

setmetatable(myTable, myMetatable)

print(myTable.nonExistentKey)  -- Output: Key not found: nonExistentKey
```

#### Removing a Metatable  
```lua
local anotherTable = {}
setmetatable(anotherTable, { __metatable = "protected" })

-- Attempting to remove the metatable will raise an error
local status, err = pcall(function() 
    setmetatable(anotherTable, nil) 
end)

print(status)  -- Output: false
print(err)     -- Output: [error message about __metatable field]
```

---

### Notes  

1. **Metatables and Protection**: The presence of a `__metatable` field in an existing metatable serves as a safeguard to prevent unauthorized changes, ensuring the integrity of sensitive tables.

2. **Debug Library**: When working with non-table types, such as userdata or threads, you must rely on functions provided by the debug library to manipulate their metatables.

---

### Summary  

- **Purpose**: Sets or removes the metatable of a specified table.  
- **Return Behavior**: Always returns the original table.  
- **Use Cases**: Essential for customizing table behavior and implementing object-oriented design in lua.
