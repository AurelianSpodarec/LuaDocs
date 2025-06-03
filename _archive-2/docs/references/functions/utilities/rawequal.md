---
  title: rawequal()
---

The `rawequal` function in lua is used to check if two values are equal without invoking the `__eq` metamethod. This allows for a strict comparison, ensuring that the equality check is performed without any custom behavior defined by the metatables of the values being compared.  

---

### Syntax  
```lua
rawequal(v1, v2)
```

### Parameters  

- **`v1`**:  
  The first value to compare. This can be of any type.  

- **`v2`**:  
  The second value to compare. This can also be of any type.  

---

### Return Values  

- Returns **`true`** if `v1` is equal to `v2`.  
- Returns **`false`** if `v1` is not equal to `v2`.  

---

### Behavior  

- The `rawequal` function performs a direct comparison of the two values without considering any potential equality metamethods defined in their respective metatables.  

- This function is useful in scenarios where you need to ensure that the comparison is not influenced by custom equality logic that may have been defined by the user.  

---

### Use Cases  

- **Strict Comparison**: When you need to verify that two values are exactly the same in value and type, without any metamethods intervening.  

- **Working with Metatables**: When you are dealing with tables that have custom equality behaviors and want to perform a comparison that ignores these behaviors.  

---

### Examples  

#### Basic Usage  
```lua
local a = {1, 2, 3}
local b = {1, 2, 3}

print(rawequal(a, b))  -- Output: false (different table references)
```

#### Comparing Different Types  
```lua
local num = 10
local str = "10"

print(rawequal(num, str))  -- Output: false (different types)
```

#### Comparing Tables with Metatables  
```lua
local t1 = setmetatable({}, {
    __eq = function() return false end
})
local t2 = setmetatable({}, {
    __eq = function() return true end
})

print(rawequal(t1, t2))  -- Output: false (strict comparison)
```

#### Example with Same References  
```lua
local c = {1, 2, 3}

print(rawequal(a, a))  -- Output: true (same table reference)
```

---

### Notes  

1. **Strict Equality**:  
   - `rawequal` checks for equality based solely on value and type, providing a strict equality comparison that is not affected by user-defined behaviors.  

2. **Type Sensitivity**:  
   - Two values of different types will always return `false`, even if they represent similar data.  

3. **Performance**:  
   - Using `rawequal` can be slightly more efficient than a normal equality check when dealing with tables that have equality metamethods, as it bypasses additional function calls.  

---

### Summary  

- **Purpose**: Check if two values are equal without invoking the `__eq` metamethod.  
- **Return Behavior**: Returns a boolean indicating equality.  
- **Use Cases**: Strict comparisons, working with tables that have custom equality behaviors.  
