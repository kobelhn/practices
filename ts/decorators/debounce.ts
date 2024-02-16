function debounce(wait: number = 500) {
    let timer: any = null;

    return function (target: any, key: any, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(() => {
                originalMethod.apply(this, args);
            }, wait);
        };

        return descriptor;
    };
}

class MyClass2 {
    @debounce(2000)
    myFunction(msg: string | number) {
        console.log("Hello, world!" + msg);
    }
}

const instance2 = new MyClass2();
instance2.myFunction('1'); // 在 2 秒内再次调用
instance2.myFunction('2'); // 在 2 秒内再次调用
instance2.myFunction('3'); // 在 2 秒内再次调用