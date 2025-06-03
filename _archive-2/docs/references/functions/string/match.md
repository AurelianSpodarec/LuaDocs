---

    title: string.match() 

---

The `string.match` function searches a string for the first match of a pattern and returns it.

| **Pattern**         | **Description**                                                                 |
|----------------------|---------------------------------------------------------------------------------|
| `%a`                | Matches any letter (A-Z, a-z).                                                 |
| `%A`                | Matches any non-letter character.                                              |
| `%d`                | Matches any digit (0-9).                                                       |
| `%D`                | Matches any non-digit character.                                               |
| `%l`                | Matches any lowercase letter (a-z).                                            |
| `%L`                | Matches any non-lowercase letter.                                              |
| `%u`                | Matches any uppercase letter (A-Z).                                            |
| `%U`                | Matches any non-uppercase letter.                                              |
| `%w`                | Matches any alphanumeric character (letters and digits).                       |
| `%W`                | Matches any non-alphanumeric character.                                        |
| `%s`                | Matches any space character (spaces, tabs, newlines).                         |
| `%S`                | Matches any non-space character.                                               |
| `%p`                | Matches any punctuation character.                                             |
| `%P`                | Matches any non-punctuation character.                                         |
| `%x`                | Matches any hexadecimal digit (0-9, A-F, a-f).                                 |
| `%X`                | Matches any non-hexadecimal digit.                                             |
| `%z`                | Matches the null character (`\0`).                                             |
| `.`                 | Matches any character (except newline by default).                             |
| `%`                 | Escape character, used to match special characters like `.` or `%`.            |
| `[set]`             | Matches any character in the set (e.g., `[abc]` matches `a`, `b`, or `c`).     |
| `[^set]`            | Matches any character not in the set (e.g., `[^abc]` matches any except `a, b, c`). |
| `x*`                | Matches 0 or more occurrences of `x`.                                          |
| `x+`                | Matches 1 or more occurrences of `x`.                                          |
| `x-`                | Matches 0 or more occurrences of `x` (as few as possible).                     |
| `x?`                | Matches 0 or 1 occurrence of `x`.                                              |
| `x{n}`              | Matches exactly `n` occurrences of `x`.                                        |
| `x{n,}`             | Matches at least `n` occurrences of `x`.                                       |
| `x{n,m}`            | Matches between `n` and `m` occurrences of `x`.                                |
| `^`                 | Matches the beginning of the string.                                           |
| `$`                 | Matches the end of the string.                                                 |


### Syntax  
```lua
string.match(s, pattern, init)
```  

### Parameters  

#### `s`  
The string to search in.  

#### `pattern`  
The pattern to search for.  

#### `init (optional)`  
The starting position for the search. Defaults to `1`.  

### Return Value  
Returns the first match of the pattern or `nil` if no match is found.

### Examples  

#### Basic usage.
```lua
local result = string.match("hello world", "world")
print(result)

-- Output: world
```  

#### Using patterns.
```lua
local result = string.match("123-456-7890", "%d%d%d")
print(result)

-- Output: 123
```  



