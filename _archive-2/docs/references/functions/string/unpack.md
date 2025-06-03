---

    title: string.unpack() 

---

The `string.unpack` function reads values from a binary string based on a specified format, and so returns the unpacked values and the position of the next unread byte.

.
### Syntax  
```lua
string.unpack(format, s, pos)
```  

### Parameters  

#### `format`  
The format string specifying how to interpret the binary data.  

#### `s`  
The binary string to unpack.  

#### `pos (optional)`  
The starting position in the string. Defaults to `1`.  

### Examples  

#### Basic usage.
```lua
local a, b = string.unpack("i4 i4", "\1\0\0\0\2\0\0\0")
print(a, b)

-- Output: 1 2
```  

