---

    title: string.gsub() 

---

The `string.gsub` function replaces occurrences of a pattern in a string with a specified replacement.

### Syntax  
```lua
string.gsub(s, pattern, replacement, n)
```  

### Parameters  

#### `s`  
The string to search and replace in.  

#### `pattern`  
The pattern to search for.  

#### `replacement`  
The string or function to replace matches with.  

#### `n (optional)`  
The maximum number of replacements to make. Defaults to replacing all occurrences.  

### Examples  

#### Basic replacement.
```lua
local result = string.gsub("hello world", "world", "lua")
print(result)

-- Output: hello lua
```  

