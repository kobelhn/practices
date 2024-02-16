enum PromiseStatus {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
}

type Executor<T> = (resolve: (value: T) => void, reject: (reason: any) => void) => void;

class MyPromise<T> {
    private status: PromiseStatus;
    private value: T | undefined;
    private reason: any;
    private onFulfilledCallbacks: Function[];
    private onRejectedCallbacks: Function[];

    constructor(executor: Executor<T>) {
        this.status = PromiseStatus.Pending;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value: T) => {
            if (this.status === PromiseStatus.Pending) {
                this.status = PromiseStatus.Fulfilled;
                this.value = value;
                this.executeCallbacks(this.onFulfilledCallbacks);
            }
        };

        const reject = (reason: any) => {
            if (this.status === PromiseStatus.Pending) {
                this.status = PromiseStatus.Rejected;
                this.reason = reason;
                this.executeCallbacks(this.onRejectedCallbacks);
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    private executeCallbacks(callbacks: Function[]) {
        callbacks.forEach(callback => {
            try {
                callback(this.value);
            } catch (error) {
                this.rejectWithError(error);
            }
        });
    }

    private rejectWithError(reason: any) {
        if (this.status !== PromiseStatus.Pending) return;

        this.status = PromiseStatus.Rejected;
        this.reason = reason;
        this.executeCallbacks(this.onRejectedCallbacks);
    }

    then<U>(onFulfilled?: (value: T) => U, onRejected?: (reason: any) => U): MyPromise<U> {
        return new MyPromise<U>((resolve, reject) => {
            const fulfilledCallback = (value: T) => {
                try {
                    const result = onFulfilled ? onFulfilled(value) : value;
                    resolve(result as U);
                } catch (error) {
                    reject(error);
                }
            };

            const rejectedCallback = (reason: any) => {
                try {
                    const result = onRejected ? onRejected(reason) : reason;
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            if (this.status === PromiseStatus.Fulfilled) {
                fulfilledCallback(this.value!);
            } else if (this.status === PromiseStatus.Rejected) {
                rejectedCallback(this.reason);
            } else {
                this.onFulfilledCallbacks.push(fulfilledCallback);
                this.onRejectedCallbacks.push(rejectedCallback);
            }
        });
    }

    catch<U>(onRejected: (reason: any) => U): MyPromise<U> {
        return this.then(undefined, onRejected);
    }

    finally(onFinally: () => void): MyPromise<T> {
        return this.then(
            value => {
                onFinally();
                return value;
            },
            reason => {
                onFinally();
                throw reason;
            }
        );
    }

    static resolve<U>(value: U): MyPromise<U> {
        return new MyPromise<U>(resolve => resolve(value));
    }

    static reject(reason: any): MyPromise<never> {
        return new MyPromise<never>((_, reject) => reject(reason));
    }

    static all<U>(promises: MyPromise<U>[]): MyPromise<U[]> {
        return new MyPromise<U[]>((resolve, reject) => {
            const results: U[] = [];
            let fulfilledCount = 0;

            promises.forEach((promise, index) => {
                promise
                    .then(value => {
                        results[index] = value;
                        fulfilledCount++;

                        if (fulfilledCount === promises.length) {
                            resolve(results);
                        }
                    })
                    .catch(reject);
            });
        });
    }

    static race<U>(promises: MyPromise<U>[]): MyPromise<U> {
        return new MyPromise<U>((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(resolve).catch(reject);
            });
        });
    }
}


function delay(ms: number): MyPromise<number> {
    return new MyPromise<number>(resolve => {
        setTimeout(() => {
            resolve(ms);
        }, ms);
    });
}

delay(2000)
    .then(value => {
        console.log(`Resolved after ${value} milliseconds.`);
        return value * 2;
    })
    .then(value => {
        console.log(`Doubled value: ${value}`);
        throw new Error("Oops, something went wrong!");
    })
    .catch(reason => {
        console.error(`Caught error: ${reason.message}`);
        return 0;
    })
    .finally(() => {
        console.log("Finally block executed.");
    });

const promise1 = new MyPromise<string>(resolve => {
    setTimeout(() => {
        resolve("Hello");
    }, 2000);
});

const promise2 = new MyPromise<string>(resolve => {
    setTimeout(() => {
        resolve("World");
    }, 1000);
});

MyPromise.all([promise1, promise2])
    .then(values => {
        const result = values.join(" ");
        console.log(result);
    })
    .catch(reason => {
        console.error(`Caught error: ${reason.message}`);
    });