---
  title: dotfile()
---
The `dofile` function in lua executes the contents of a specified file as a lua chunk. It opens the file, runs its code, and returns any values produced by that chunk. If no filename is given, it will read and execute code from standard input (stdin). Unlike some functions, `dofile` does not operate in protected mode, so errors are directly propagated to the caller.

### Syntax  
```lua
dofile([filename])
```

### Parameters  
- **`filename`** *(optional)*: The name of the file to execute. If omitted, `dofile` executes from standard input.

### Behavior  
1. **File Execution**: Executes the contents of the specified file as a lua chunk.
2. **Returns**: Returns all values produced by the executed chunk.
3. **Error Handling**: Errors during execution are propagated to the caller, as `dofile` does not run in protected mode.

### Use Cases  
- Dynamically loading lua code from external files.
- Breaking large scripts into smaller files for modular execution.
- Executing user-provided configurations or scripts.

### Examples  

#### Executing a File  
```lua
-- Assuming 'script.lua' contains:
-- return 1, 2, 3

local a, b, c = dofile("script.lua")
print(a, b, c)  -- Output: 1  2  3
```

#### Error Propagation  
```lua
-- Assuming 'error_script.lua' contains invalid lua code:
-- This will throw an error and stop execution.

local result = dofile("error_script.lua")
-- Output: lua: error_script.lua:1: unexpected symbol
```

#### Reading From Standard Input  
```lua
-- Running dofile() without arguments reads lua code from stdin.
dofile()
-- Input: print("Hello, world!")
-- Output: Hello, world!
```

### Notes  
1. **Unprotected Execution**: Use `pcall` or `xpcall` to handle errors gracefully when using `dofile`.
   ```lua
   local status, err = pcall(dofile, "error_script.lua")
   if not status then
       print("Error:", err)
   end
   ```

2. **File Path**: Ensure the file path is valid; errors will occur if the file cannot be opened.

3. **Chunk Independence**: Variables within the file are local to that chunk unless explicitly made global.

### Comparison With Similar Functions  
- **`loadfile`**: Loads a lua chunk from a file without executing it. Use `loadfile` for later execution.
   ```lua
   local chunk = loadfile("script.lua")
   if chunk then
       chunk()  -- Executes the loaded chunk
   end
   ```

- **`require`**: Loads modules and caches results to prevent re-execution.
   ```lua
   require("module")  -- Loads 'module.lua' only once
   ```

### Summary  
- **Purpose**: Executes lua code from a file or stdin.
- **Usage**: Ideal for dynamic script execution and modularizing large programs.
- **Caution**: Handle errors carefully, as `dofile` does not provide internal error protection.

Reference: [lua 5.4 Manual](https://lua.org/manual/5.4/manual.html#dotfile)
