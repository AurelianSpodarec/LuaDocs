---
  title: load()
---

The `load` function in lua is used to load a chunk of code, either from a string or a function, compiling it into a lua function that can be executed later. This function is essential for dynamically loading and executing lua code at runtime.

---

### Syntax  
```lua
load(chunkData [, chunkName [, mode [, environment]]])
```

### Parameters  

- **`chunkData`**:  
  The code to be loaded. It can either be:  
  - A **string** containing the lua code, or  
  - A **function** that, when called, returns pieces of the lua code as strings.  

- **`chunkName`** (optional):  
  A string that serves as the name of the chunk, primarily for error messages and debugging.  
  Defaults to `chunk` if `chunkData` is a string, or to `="(load)"` otherwise.  

- **`mode`** (optional):  
  A string that controls the type of chunk to load:  
  - `"b"`: Load only binary chunks.  
  - `"t"`: Load only text chunks.  
  - `"bt"`: Load both binary and text chunks (default).  

- **`environment`** (optional):  
  A table that serves as the environment for the loaded chunk. If provided, the first upvalue of the resulting function is set to this value.  

---

### Return Values  

- If the chunk is loaded successfully and has no syntax errors, `load` returns a compiled function.  
- If there are syntax errors, it returns `nil` followed by the error message.  

---

### Behavior  

1. **Loading from String or Function**:  
   - When `chunkData` is a string, the entire string is treated as the lua code to load.  
   - When `chunkData` is a function, `load` calls it repeatedly to gather pieces of the code until it returns an empty string, `nil`, or no value, indicating the end of the chunk.  

2. **Error Handling**:  
   - If the chunk contains syntactical errors, `load` does not execute the code but returns an error message.  

3. **Upvalues and Environments**:  
   - The resulting function has exactly one upvalue, `_ENV`, when loading a main chunk.  
   - For binary chunks, the number of upvalues can vary, and there is no guarantee that the first upvalue is `_ENV`.  
   - If an `environment` table is provided, the first upvalue is initialized with its value; otherwise, it defaults to the global environment. Other upvalues are set to `nil`.  

4. **Mode Control**:  
   - The `mode` parameter specifies whether to load text, binary, or both types of chunks.  

5. **Safety Considerations**:  
   - Although it is safe to load malformed binary chunks (which will return an error), lua does not verify the consistency of the code within binary chunks. Running maliciously crafted bytecode can crash the interpreter.  

---

### Use Cases  

- Dynamically loading lua code from strings or functions at runtime.  
- Loading precompiled binary chunks for performance improvements.  
- Error handling during the loading of potentially unsafe code.  

---

### Examples  

#### Loading a String as a Chunk  
```lua
local compiledFunction, errorMessage = load("return 5 + 3")
if compiledFunction then
    print(compiledFunction())  -- Output: 8
else
    print("Error:", errorMessage)
end
```

#### Handling Syntax Errors  
```lua
local compiledFunction, errorMessage = load("return 5 +")
if not compiledFunction then
    print("Error:", errorMessage)  -- Output: Error: <error message>
end
```

#### Loading a Function that Returns Code  
```lua
local function getChunkData()
    return "return 10 * 2"
end

local compiledFunction, errorMessage = load(getChunkData)
if compiledFunction then
    print(compiledFunction())  -- Output: 20
else
    print("Error:", errorMessage)
end
```

#### Specifying a Chunk Name  
```lua
local compiledFunction, errorMessage = load("return 5 + 5", "my_chunk")
if compiledFunction then
    print(compiledFunction())  -- Output: 10
else
    print("Error:", errorMessage)
end
```

#### Loading Binary Chunks (assuming `binaryChunk` is a valid binary chunk)  
```lua
-- Example of loading a binary chunk
local binaryChunk = "\27lua"  -- This would be an actual binary chunk in practice
local compiledFunction, errorMessage = load(binaryChunk, "my_binary_chunk", "b")
if compiledFunction then
    compiledFunction()  -- Execute the loaded function
else
    print("Error:", errorMessage)
end
```

---

### Notes  

1. **Main vs. Non-Main Chunks**:  
   - When loading a main chunk, the resulting function's first upvalue will always be `_ENV`.  
   - For non-main chunks loaded from binary, the first upvalue may not be `_ENV`.  

2. **Behavior with Malformed Chunks**:  
   - Loading a malformed binary chunk is safe; the `load` function will return an appropriate error message.  

3. **Runtime Environment**:  
   - The environment for the loaded chunk can be controlled using the `environment` parameter, allowing for sandboxing or encapsulation of the loaded code.  

4. **Consistency of Binary Chunks**:  
   - lua does not check the validity of the contents of binary chunks, which could pose security risks if running untrusted code.  

---

### Summary  

- **Purpose**: Load and compile lua code from strings or functions into executable functions.  
- **Behavior**: Supports dynamic loading and provides error handling for syntax issues.  
- **Upvalues**: Allows setting the environment and controlling the number of upvalues.  
- **Security**: Caution is advised when dealing with binary chunks to avoid potential crashes.  
- 