---
  title: loadfile()
---

## `loadfile()`

The `loadfile` function in lua is used to load a chunk of code from a specified file or from the standard input if no filename is provided. This function is useful for executing lua code stored in external files.

---

### Syntax

```lua
loadfile([filename [, mode [, env]]])
```

### Parameters

- **`filename`** (optional):  
  The name of the file containing the lua code to be loaded. If not provided, `loadfile` reads from standard input (stdin).

- **`mode`** (optional):  
  A string that controls whether the loaded chunk can be text or binary. Possible values are:  
  - **`"b"`**: Load only binary chunks. Binary chunks are precompiled lua code files that are not human-readable and are typically created using the lua compiler. If you try to load a plain text lua script in this mode, it will result in an error.
  - **`"t"`**: Load only text chunks. This mode allows loading plain text lua scripts, which are human-readable and not compiled. If you specify this mode, `loadfile` will reject any binary chunk files.
  - **`"bt"`** (default): Load both binary and text chunks. This is the default behavior, allowing the function to accept either format. If a file is in binary format, it will be loaded as a compiled chunk; if it is in text format, it will be loaded as source code.

- **`env`** (optional):  
  A table that sets the environment for the loaded chunk. If provided, the first upvalue of the resulting function is set to this value.

---

### Return Values

- If the chunk is loaded successfully and has no syntax errors, `loadfile` returns a compiled function.
- If there are syntax errors or the file cannot be opened, it returns `nil` followed by the error message.

---

### Behavior

1. **Loading from File or Standard Input**:  
   - When a `filename` is provided, `loadfile` attempts to load the lua code from that file.
   - If no filename is specified, it reads the lua code from standard input.

2. **Error Handling**:  
   - If the specified file cannot be opened or the chunk contains syntax errors, `loadfile` returns an error message.

3. **Upvalues and Environment**:  
   - The resulting function has one upvalue, `_ENV`, when loading a main chunk.
   - If an `env` table is provided, the first upvalue is initialized with its value; otherwise, it defaults to the global environment.

4. **Mode Control**:  
   - The `mode` parameter determines whether to load text, binary, or both types of chunks.

---

### Use Cases

- Loading and executing lua code from external files.
- Dynamically loading code during runtime based on file input.
- Handling errors gracefully when files cannot be accessed or contain invalid code.

---

### Examples

#### Loading a Chunk from a File

```lua
local loadedFunction, err = loadfile("script.lua")
if loadedFunction then
    loadedFunction()  -- Execute the loaded function
else
    print("Error:", err)
end
```

#### Loading from Standard Input

```lua
print("Enter lua code (press Ctrl+D to end):")
local loadedFunction, err = loadfile()
if loadedFunction then
    loadedFunction()  -- Execute the loaded function
else
    print("Error:", err)
end
```

#### Handling File Not Found

```lua
local loadedFunction, err = loadfile("nonexistent.lua")
if not loadedFunction then
    print("Error:", err)  -- Output: Error: <error message>
end
```

#### Specifying a Mode for the Loaded Chunk

```lua
local loadedFunction, err = loadfile("binary_chunk.luac", "b")
if loadedFunction then
    loadedFunction()  -- Execute the loaded function
else
    print("Error:", err)
end
```

#### Using a Custom Environment

```lua
local customEnv = {x = 10}
setmetatable(customEnv, {__index = _G})  -- Inherit from global environment
local loadedFunction, err = loadfile("script.lua", nil, customEnv)
if loadedFunction then
    loadedFunction()  -- Execute the loaded function with the custom environment
else
    print("Error:", err)
end
```

---

### Notes

1. **Main vs. Non-Main Chunks**:  
   - The resulting function from loading a main chunk will always have `_ENV` as its first upvalue.

2. **Error Handling with Files**:  
   - If the file cannot be opened, `loadfile` will provide an error message indicating the issue.

3. **Flexibility with Environments**:  
   - You can control the environment for the loaded chunk using the `env` parameter, enabling sandboxing or encapsulation of the code.

4. **Safety Considerations**:  
   - Ensure that the loaded files are from trusted sources to avoid potential security risks when executing external code.

---

### Summary

- **Purpose**: Load and compile lua code from a specified file or standard input.
- **Behavior**: Supports error handling for file access issues and syntax errors.
- **Upvalues**: Allows setting the environment for the loaded chunk.
- **Security**: Exercise caution when executing code from external sources to prevent potential risks.
