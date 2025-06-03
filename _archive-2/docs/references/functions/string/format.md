---

    title: string.format() 

---

The `string.format` function formats strings using a specified template with placeholders.


| Place-holders | Overview                          |
| :---          | :---                              |
| `%d`          | Inserts an integer value.         |
| `%s`          | Inserts a floating point val      |
| `%f`          | Inserts a string value            |

### Syntax  
```lua
string.format(formatstring, ...)
```  

### Parameters  

#### `formatstring`  
The template string containing placeholders.  

#### `...`  
Values to replace the placeholders in the template.  

### Examples  

#### Basic formatting.
```lua
local result = string.format("Hello, %s!", "world!")
print(result)

-- Output: Hello, world!!
```  

#### Number formatting.
```lua
local result = string.format("Pi is approximately %.2f", 3.14159)
print(result)

-- Output: Pi is approximately 3.14
```  

#### Multiple placeholders.
```lua
local result = string.format("%s scored %d points", "Bob", 95)
print(result)

-- Output: Bob scored 95 points
```  
