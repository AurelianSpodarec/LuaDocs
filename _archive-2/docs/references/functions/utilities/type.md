---
  title: type()
---

The `type` function in lua is used to determine the type of a given value. It returns a string that represents the type of the value passed to it.

---

### Syntax  
```lua
type(value)
```

### Parameters  

- **`value`**:  
  The value whose type is to be determined. This can be of any lua type.

---

### Return Value  

- Returns a string representing the type of the input value `value`.

---

### Possible Return Types  

The `type` function can return one of the following strings:  

- **`"nil"`**: Indicates that the value is nil.
- **`"number"`**: Indicates that the value is a number.
- **`"string"`**: Indicates that the value is a string.
- **`"boolean"`**: Indicates that the value is a boolean (true or false).
- **`"table"`**: Indicates that the value is a table.
- **`"function"`**: Indicates that the value is a function.
- **`"thread"`**: Indicates that the value is a coroutine (thread).
- **`"userdata"`**: Indicates that the value is a userdata, which is a mechanism to store C data in lua.

---

### Use Cases  

- **Type Checking**: The `type` function is commonly used to check the type of variables or return values, which can help in ensuring that functions receive arguments of the expected types.
  
- **Debugging**: It aids in debugging by allowing developers to inspect the types of values during execution.

---

### Examples  

#### Basic Usage  
```lua
print(type(nil))          -- Output: "nil"
print(type(42))           -- Output: "number"
print(type("Hello"))      -- Output: "string"
print(type(true))         -- Output: "boolean"
print(type({}))           -- Output: "table"
print(type(function() end)) -- Output: "function"
print(type(coroutine.create(function() end))) -- Output: "thread"
print(type(newproxy()))    -- Output: "userdata"
```

#### Type Checking Example  
```lua
local function checkType(value)
    if type(value) == "number" then
        print("It's a number!")
    elseif type(value) == "string" then
        print("It's a string!")
    else
        print("It's of type: " .. type(value))
    end
end

checkType(10)         -- Output: "It's a number!"
checkType("lua")      -- Output: "It's a string!"
checkType({})         -- Output: "It's of type: table"
```

---

### Notes  

- **Nil Type**: The string returned for the nil value is `"nil"`, which is important to distinguish from the actual `nil` value.
  
- **Userdata Type**: Userdata is a type that allows lua to interface with C data, and its specifics depend on the implementation.

---

### Summary  

- **Purpose**: Determines the type of a given value in lua.  
- **Return Behavior**: Returns a string indicating the type of the input value.  
- **Use Cases**: Useful for type checking, debugging, and ensuring function arguments are of the expected type.
