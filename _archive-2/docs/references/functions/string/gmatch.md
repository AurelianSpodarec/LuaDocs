---

    title: string.gmatch() 

---

The `string.gmatch` function returns an iterator that yields all matches of a pattern in a string.

### Syntax  
```lua
string.gmatch(s, pattern)
```  

### Parameters  

#### `s`  
The string to search in.  

#### `pattern`  
The pattern to search for.  

### Examples  

#### Basic usage.
```lua
for word in string.gmatch("lua is fun", "%a+") do
    print(word)
end

-- Output:
-- lua
-- is
-- fun
```  
