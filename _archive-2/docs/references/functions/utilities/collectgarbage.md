---
  title: collectgarbage()
---

lua performs automatic memory management through garbage collection (GC), meaning you do not need to explicitly allocate or free memory. lua's garbage collector automatically tracks memory usage, identifying and reclaiming memory used by objects that are no longer accessible in the program.

### How It Works

- An object is considered **dead** when the garbage collector determines that it cannot be accessed during the program's normal execution.  
- lua ensures that:
  - Objects still accessible will not be collected.
  - Objects that are truly inaccessible will eventually be collected.  

### Collector Modes

The garbage collector operates in two modes:  
1. **Incremental Mode**: Performs collection in small steps to minimize performance impact.  
2. **Generational Mode**: Optimized for programs with a mix of short-lived and long-lived objects.

You can configure and control garbage collection using the `collectgarbage()` function in lua.

---

### `collectgarbage` Function

The `collectgarbage` function provides a generic interface to lua’s garbage collector. Its behavior depends on the `operation` argument provided.  

#### Syntax  
```lua
collectgarbage(operation [, arg])
```

#### Parameters  
- **`operation`**: A string specifying the desired operation (see options below).  
- **`arg`** (optional): An argument for specific operations (e.g., step size or collector settings).  

---

### Options and Descriptions  

Each `operation` parameter determines the action of the garbage collector:  

#### `"collect"`  
- **Description**: Performs a full garbage collection cycle.  

#### `"stop"`  
- **Description**: Stops automatic garbage collection. The collector will only run when explicitly triggered.  

#### `"restart"`  
- **Description**: Resumes automatic garbage collection after it has been stopped.  

#### `"count"`  
- **Description**: Returns the total memory currently in use by lua, measured in kilobytes (including fractional KB).  

#### `"step"`  
- **Description**: Performs a single step of garbage collection.  
- **Argument**:  
  - `0`: Executes one indivisible step.  
  - Non-zero values simulate the allocation of memory in KB and adjust the step size.  
- **Returns**: `true` if the step completes a garbage collection cycle.  

#### `"isrunning"`  
- **Description**: Checks whether the garbage collector is currently running.  
- **Returns**: `true` if the collector is running; otherwise, `false`.  

#### `"incremental"`  
- **Description**: Changes the garbage collector mode to incremental.  
- **Optional Arguments**:  
  1. **Pause**: Adjusts the garbage collection pause value.  
  2. **Step Multiplier**: Modifies the GC speed relative to memory allocation.  
  3. **Step Size**: Determines the amount of work the GC performs in each step.  

#### `"generational"`  
- **Description**: Changes the garbage collector mode to generational.  
- **Optional Arguments**:  
  1. **Minor Multiplier**: Determines the frequency of collection for short-lived objects.  
  2. **Major Multiplier**: Adjusts the collection frequency for long-lived objects.  

---

### Examples  

#### Using `"count"`  
Retrieve the total memory in use by lua:  
```lua
local memoryUsage = collectgarbage("count")
print(memoryUsage .. " KB")
-- Output: Total memory used by lua.
```

#### Using `"step"`  
Perform a single GC step:  
```lua
local stepCompleted = collectgarbage("step", 10)
print(stepCompleted)
-- Output: true (if the step completed a cycle)
```

#### Switching to Incremental Mode  
Change the garbage collector to incremental mode with specific settings:  
```lua
collectgarbage("incremental", 200, 300, 400)
-- Sets pause to 200, step multiplier to 300, and step size to 400.
```

#### Switching to Generational Mode  
Configure the garbage collector for generational behavior:  
```lua
collectgarbage("generational", 50, 100)
-- Sets minor multiplier to 50 and major multiplier to 100.
```

#### Checking If the Collector Is Running  
Verify the current state of the garbage collector:  
```lua
local isRunning = collectgarbage("isrunning")
print(isRunning)
-- Output: true or false
```

#### Performing Full Collection  
Trigger a full garbage collection cycle:  
```lua
collectgarbage("collect")
print("Garbage collection completed.")
```

#### Stopping and Restarting the Collector  
```lua
collectgarbage("stop")
-- Collector is now stopped.

collectgarbage("restart")
-- Collector is now running again.
```

---

### Use Cases for Garbage Collection  

1. **Monitoring Memory Usage**: Use `"count"` to track memory in real-time and debug memory leaks.  
2. **Performance Optimization**: Adjust garbage collector parameters with `"incremental"` or `"generational"` to reduce performance overhead.  
3. **Manual Control**: Temporarily stop the collector in critical sections of code to avoid interruptions.  

---

### Notes  

- lua’s garbage collection behavior can vary across platforms and lua versions. Optimal settings may not be portable.  
- Objects accessible only through the **C registry** (e.g., global environment) are not collected because lua assumes they might be used by C code.  
- Finalizers can temporarily "resurrect" dead objects, delaying their collection (see §2.5.3 in the lua reference manual).  

**Reference**: [lua 5.4 Manual - collectgarbage()](https://lua.org/manual/5.4/manual.html#pdf-collectgarbage)
