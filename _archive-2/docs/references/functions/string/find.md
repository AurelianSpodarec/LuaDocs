---

    title: string.find() 

---

The `string.find` function searches for a pattern within a string and returns the start and end positions of the first match.

### Syntax  
```lua
string.find(s, pattern, init, plain)
```  

### Parameters  

#### `s`  
The string to search in.  

#### `pattern`  
The pattern to search for.  

#### `init (optional)`  
The starting position for the search. Defaults to `1`.  

#### `plain (optional)`  
If `true`, disables pattern matching and searches for the plain text. Defaults to `false`.  

### Examples  

#### Basic usage.
```lua
local start, finish = string.find("Hello World", "World")
print(start, finish)

-- Output: 7, 11
```  

#### Search with starting position.
```lua
local start, finish = string.find("Hello World", "o", 5)
print(start, finish)

-- Output: 5, 5
```  

#### Plain text search.
```lua
local start, finish = string.find("Hello (World)", "(", 1, true)
print(start, finish)

-- Output: 7 7
```  
