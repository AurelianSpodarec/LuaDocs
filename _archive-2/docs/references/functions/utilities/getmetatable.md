---
  title: getmetatable()
---

The `getmetatable` function in lua retrieves the metatable of a given object. If the object does not have a metatable, it returns `nil`. If the metatable contains a `__metatable` field, `getmetatable` returns the value of that field instead of the actual metatable. This function is particularly useful for inspecting or working with metatables while respecting the protections afforded by the `__metatable` field.

### Syntax  
```lua
getmetatable(object)
```

### Parameters  
- **`object`**: The object whose metatable is to be retrieved. This can be any lua value except `nil`.

### Return Values  
- **`nil`**: Returned if the object does not have a metatable.  
- **`value of __metatable`**: If the metatable contains a `__metatable` field, its value is returned instead of the actual metatable.  
- **`metatable`**: If the object has a metatable and no `__metatable` field, the actual metatable is returned.

### Behavior  
1. **Accessing the Metatable**: If the object has a metatable without a `__metatable` field, the metatable is returned.  
2. **Respecting the `__metatable` Field**: If the object's metatable contains a `__metatable` field, `getmetatable` returns the value of this field, which restricts direct access to the metatable.  
3. **No Metatable**: If the object does not have a metatable, `getmetatable` returns `nil`.

### Use Cases  
- Inspecting an object's metatable.  
- Debugging and understanding the behavior of objects that use metatables.  
- Implementing controlled access to metatables using the `__metatable` field.

### Examples  

#### Retrieving a Metatable  
```lua
local tableData = {}
setmetatable(tableData, {key = "value"})

local metatableData = getmetatable(tableData)
print(metatableData.key)  -- Output: value
```

#### No Metatable  
```lua
local tableData = {}
print(getmetatable(tableData))  -- Output: nil
```

#### Using `__metatable` for Protection  
```lua
local tableData = {}
setmetatable(tableData, {__metatable = "Access denied!"})

print(getmetatable(tableData))  -- Output: Access denied!
```

#### Retrieving `__metatable` Value  
```lua
local tableData = {}
setmetatable(tableData, {__metatable = {info = "Protected metatable"}})

local metatableData = getmetatable(tableData)
print(metatableData.info)  -- Output: Protected metatable
```

#### Attempting to Modify a Protected Metatable  
```lua
local tableData = {}
setmetatable(tableData, {__metatable = "Protected metatable"})

-- Uncommenting the following line will raise an error:
-- setmetatable(tableData, {})  -- Error: cannot change a protected metatable
```

### Notes  
1. **Protection via `__metatable`**: The `__metatable` field acts as a safeguard against unwanted access or modification of a metatable. This is useful in designing robust APIs where you want to prevent external interference with the object's behavior.  
2. **No Side Effects**: `getmetatable` does not modify the object or its metatable in any way. It is purely an accessor function.  
3. **Default Behavior**: Objects like tables and userdata can have metatables. However, lua's primitive types like `number`, `string`, and `boolean` do not have metatables by default.  
4. **Combining with `setmetatable`**: The `getmetatable` function is often used in conjunction with `setmetatable` to dynamically inspect and modify object behavior.

### Summary  
- **Purpose**: Retrieve the metatable of an object or return the value of its `__metatable` field if it exists.  
- **Usage**: Ideal for inspecting and debugging objects that use metatables.  
- **Caution**: Respect the `__metatable` field when working with protected metatables to ensure code integrity.
