---

    title: string.rep() 

---

The `string.rep` function repeats a string a specified number of times.

### Syntax  
```lua
string.rep(s, n, sep)
```  

### Parameters  

#### `s`  
The string to repeat.  

#### `n`  
The number of times to repeat the string.  

#### `sep (optional)`  
A string to insert between repetitions. Defaults to an empty string.  

### Examples  

#### Basic repetition.
```lua
local result = string.rep("lua", 3)
print(result)

-- Output: lualualua
```  

#### Using a separator.
```lua
local result = string.rep("lua", 3, "-")
print(result)

-- Output: lua-lua-lua
```  

