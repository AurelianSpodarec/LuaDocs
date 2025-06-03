---

    title: string.dump() 

---

The `string.dump` function converts a `function` into a binary string representing its compiled bytecode.

### Syntax  
```lua
string.dump(func, strip)
```  

### Parameters  

#### `func`  
The function to convert into bytecode.  

#### `strip (optional)`  
If `true`, removes debug information from the bytecode. Defaults to `false`.  

### Examples  

#### Basic usage.
```lua
local func = function(a, b)
    return a + b
end

local dumped = string.dump(func)

print(type(dumped)) 

-- Output: string
```  
