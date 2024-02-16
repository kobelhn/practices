function log(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
  
    // #region snippet
    descriptor.value = function (...args: any[]) {
      console.log(`Calling method ${key} with arguments: ${args}`);
      return originalMethod.apply(this, args);
    };
    // #endregion snippet
  
    return descriptor;
  }
  
  class MyClass {
    @log
    myMethod(message: string) {
      console.log(`Executing myMethod: ${message}`);
    }
  }
  
  const instance = new MyClass();
  instance.myMethod("Hello, world!");
  