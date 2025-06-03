---

    title: string.sub() 

---

The `string.sub` function extracts a substring from a string, based on specified start and end positions. So it returns the substring from position `i` to `j`.

### Syntax  
```lua
string.sub(s, i, j)
```  

### Parameters  

#### `s`  
The string to extract from.  

#### `i`  
The starting position of the substring.  

#### `j (optional)`  
The ending position of the substring. Defaults to the end of the string.  

### Examples  

#### Basic usage.
```lua
local result = string.sub("Hello World", 1, 5)
print(result)

-- Output: Hello
```  

