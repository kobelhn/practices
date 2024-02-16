/**
 * @title 彻底搞懂什么是浅拷贝，什么是深拷贝
 * @desc 浅拷贝：只复制一层对象的属性，如果属性是引用类型，那么拷贝的是地址，两个对象会共享这个地址，其中一个对象改变了这个地址的值，另一个对象也会受到影响。
 * @desc 深拷贝：递归复制所有层级的对象属性，两个对象互不影响。
 */

// 浅拷贝

// 浅拷贝方法1. Object.assign
const obj1 = { a: { b: 1 } }
console.log(obj1.a.b)

const obj2 = Object.assign({}, obj1)
obj1.a.b = 2
console.log(obj2.a.b) // 2

// 浅拷贝方法2. 扩展运算符
const obj3 = { ...obj1 }
obj1.a.b = 3
console.log(obj3.a.b) // 3

// 浅拷贝方法3. Object.fromEntries & Object.entries
const obj4 = Object.fromEntries(Object.entries(obj1))
obj1.a.b = 4
console.log(obj4.a.b)

// 数组的浅拷贝方法1. slice
const arr1 = [{ a: 1 }, { b: 2 }]
const arr2 = arr1.slice()
arr1[0].a = 2
console.log(arr2[0].a) // 2

// 数组的浅拷贝方法2. 扩展运算符
const arr3 = [...arr1]
arr1[0].a = 3
console.log(arr3[0].a) // 3

// 数组的浅拷贝方法3. Array.from
const arr4 = Array.from(arr1)
arr1[0].a = 4
console.log(arr4[0].a) // 4


// 深拷贝方法
// 深拷贝方法1. JSON.parse(JSON.stringify())
const obj5 = { a: { b: 5 } }
const obj6 = JSON.parse(JSON.stringify(obj5))
obj5.a.b = 6
console.log(obj6.a.b) // 5

// 深拷贝方法2. 递归 需要注意：循环引用和相同引用的情况
export function deepCopy(obj: any, map = new Map()): any {
    // 如果obj已经被复制过，则直接返回复制后的对象
    if (map.has(obj)) {
        return map.get(obj);
    }

    // 处理不可变数据类型，直接返回本身
    if (
        obj === null ||
        typeof obj !== 'object' ||
        obj instanceof Date ||
        obj instanceof RegExp ||
        obj instanceof Map ||
        obj instanceof Set
    ) {
        return obj;
    }

    // 创建一个新的对象或数组
    const newObj = Array.isArray(obj) ? [] : {};

    // 将新对象添加到map中，防止循环引用
    map.set(obj, newObj);

    // 递归地复制对象的属性
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = deepCopy(obj[key], map);
        }
    }

    return newObj;
}

const obj7 = { a: { b: 7 } }
const obj8 = deepCopy(obj7)
obj7.a.b = 8
console.log(obj8.a.b) // 7

const obj: {
    name: string;
    age: number;
    hobbies: string[];
    test: any[];
    address: {
        city: string;
        country: string;
    };
} = {
    name: 'John',
    age: 30,
    hobbies: ['reading', 'coding'],
    test: [{ a: 1 }, { b: 2 }, 'string'],
    address: {
        city: 'New York',
        country: 'USA'
    }
};

const clonedObj = deepCopy(obj);
obj.hobbies.push('eating')
obj.address.city = 'HeFei'
obj.address.country = 'China'
obj.test[0].a = 2
obj.test[2] = 'array'

console.log(obj)
console.log(clonedObj)

// 测试循环引用的情况
const obj9: {
    a: {
        b: any;
    };
} = { a: { b: 9 } }
obj9.a.b = obj9
const obj10 = deepCopy(obj9)
console.log(obj10)

// 测试相同引用的情况
const obj11 = { a: { b: 11 } }
const obj13 = deepCopy(obj11)
console.log(obj13.a === obj11.a)