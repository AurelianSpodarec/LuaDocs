---
  title: string.byte() 
---

The `string.byte` function retrieves the numeric ASCII (or Unicode) value of a character in a string.

### Syntax  
```lua
string.byte(s, start, end_)
```  

### Parameters  
#### `s`

The string from which the ASCII (or Unicode) values of characters will be extracted. 

#### `start (defaults to 1)` 

The starting position in the string to begin retriving character values.

#### `end_ (optional)`  
The ending position in the string up to which character values will be extracted. If omitted, only the value at the `start` position will be returned. (This will **not** return a table,it will return the individual numbers!)

### Examples

#### No ending provided.
```lua
print(string.byte("Hello")) 

-- Output: 72 (ASCII for 'H')
```

#### Ending provided.
```lua
local text = {string.byte("Hello", 1, 5)}

print(table.concat(text, ", ")) 

-- Output: 72, 101, 108, 108, 111
```
