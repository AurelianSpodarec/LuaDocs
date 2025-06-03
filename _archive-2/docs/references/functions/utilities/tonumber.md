---
  title: tonumber()
---

The `tonumber` function in lua is used to convert a given value into a number, either from a string or another number type. It offers flexibility in handling different numeric representations, including various bases for numeral conversion.

---

### Syntax  
```lua
tonumber(value [, base])
```

### Parameters  

- **`value`**:  
  The value to be converted into a number. This can be a number or a string.

- **`base`** (optional):  
  An integer that specifies the base of the numeral system to interpret the string `value`. This base can range from 2 to 36.

---

### Return Value  

- Returns the converted number if the conversion is successful. If the conversion fails, it returns `nil`.

---

### Behavior  

1. **Without Base**:  
   - When called without the `base` parameter, `tonumber` attempts to convert `value` to a number. If `value` is already a number or a string that can be interpreted as a number (with possible leading/trailing spaces and a sign), it returns the corresponding numeric value.
   - If `value` cannot be converted, it returns `nil`.

2. **With Base**:  
   - If the `base` parameter is provided, `value` must be a string representing an integer in that base. The `base` can be any integer from 2 to 36.
   - The letters 'A' to 'Z' (and 'a' to 'z') represent values from 10 to 35, respectively.
   - If `value` is not a valid numeral in the specified base, the function returns `nil`.

---

### Use Cases  

- **Converting User Input**: This function is useful for converting user input (typically in string format) into numeric values for calculations.
  
- **Base Conversion**: It can convert strings representing numbers in different bases (binary, octal, hexadecimal, etc.) into their decimal equivalents.

---

### Examples  

#### Basic Conversion  
```lua
print(tonumber("  42  "))  -- Output: 42
print(tonumber("3.14"))     -- Output: 3.14
print(tonumber("abc"))      -- Output: nil
```

#### Conversion with Base  
```lua
print(tonumber("1010", 2))  -- Output: 10 (binary to decimal)
print(tonumber("1A", 16))   -- Output: 26 (hexadecimal to decimal)
print(tonumber("Z", 36))     -- Output: 35 (base 36)
print(tonumber("100", 2))    -- Output: 4 (binary to decimal)
print(tonumber("100", 10))   -- Output: 100 (decimal)
print(tonumber("123", 8))    -- Output: 83 (octal to decimal)
print(tonumber("1G", 16))    -- Output: nil (invalid hexadecimal)
```

---

### Notes  

- **String Formatting**: When converting strings, leading and trailing spaces are ignored, and signs (+ or -) are considered.
  
- **Invalid Input**: If the input string does not conform to the expected numeric format (for example, letters in a base 10 or 16 string), the function will return `nil`.

---

### Summary  

- **Purpose**: Converts a value (number or string) to a number, optionally interpreting it as an integer in a specified base.  
- **Return Behavior**: Returns the converted number or `nil` if conversion fails.  
- **Use Cases**: Ideal for handling numeric input from users and performing base conversions.
