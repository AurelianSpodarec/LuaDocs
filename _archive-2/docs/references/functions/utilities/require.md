---
  title: require()
---

The `require` function in lua is used to load modules. It checks if the module has already been loaded, finds the appropriate loader if not, and then executes the loader to obtain the module's functionality.

---

### Syntax  
```lua
require(modname)
```

### Parameters  

- **`modname`**:  
  A string representing the name of the module to load. The name is used to identify and locate the module within the package search paths.

---

### Return Values  

- Returns the value stored in `package.loaded[modname]`, which is the result of loading the module.  
- Additionally, it returns the loader data, indicating how the module was found.

---

### Behavior  

1. **Check for Existing Module**:  
   The function first checks `package.loaded` to see if `modname` is already loaded. If it is, it returns the stored value and the loader data without reloading the module.  

2. **Module Search Process**:  
   If the module is not found in `package.loaded`, `require` searches for a loader:
   - It first checks `package.preload[modname]`. If a value is found, it is treated as the loader function.
   - If not found, it looks for a lua loader using the paths specified in `package.path`.
   - If that fails, it searches for a C loader using the paths in `package.cpath`.
   - If all previous attempts fail, it resorts to an all-in-one loader as specified in `package.searchers`.

3. **Loading the Module**:  
   If a loader is found, `require` calls the loader with two arguments: `modname` and additional loader data provided by the searcher.  
   - If the loader returns a non-nil value, that value is assigned to `package.loaded[modname]`.  
   - If the loader does not return a non-nil value and has not assigned a value, `require` assigns `true` to `package.loaded[modname]`.  
   - The final value of `package.loaded[modname]` is returned.

4. **Error Handling**:  
   If any errors occur during loading or execution of the module, or if no loader can be found, `require` raises an error.

---

### Use Cases  

- **Loading Modules**: `require` is essential for organizing code into reusable modules, allowing for better structure and maintainability.  
- **Dependency Management**: It manages module dependencies by ensuring that a module is loaded only once, avoiding duplicate loading.

---

### Examples  

#### Loading a lua Module  
```lua
local myModule = require("myModule")  
-- Loads the module "myModule" and assigns its value to the variable myModule.
```

#### Loading a C Module  
```lua
local myCLibrary = require("myCLibrary")  
-- Loads a C module named "myCLibrary" if available in the specified cpath.
```

#### Handling Errors  
```lua
local status, err = pcall(function()
    return require("nonExistentModule")
end)

if not status then
    print("Error loading module:", err)  -- Output: Error loading module: [error message]
end
```

---

### Notes  

1. **Module Names**:  
   The module name may be subject to transformation based on the search paths configured in `package.path` and `package.cpath`.  

2. **Module Caching**:  
   Modules are cached in `package.loaded` to prevent reloading and to preserve the state of the module across multiple `require` calls.

3. **Customization**:  
   You can customize the behavior of `require` by modifying `package.searchers` to change how modules are located and loaded.

---

### Summary  

- **Purpose**: Loads a specified module and ensures that it is only loaded once.  
- **Return Behavior**: Provides the loaded module's value and loader data.  
- **Use Cases**: Essential for modular programming and dependency management in lua.
