type PiniaStoreOptions<State> = {
    state?: State;
    actions?: Record<string, (store: PiniaStore<State>, payload?: any) => void>;
};

class PiniaStore<State> {
    state: State;
    actions: Record<string, (store: PiniaStore<State>, payload?: any) => void>;

    constructor(options: PiniaStoreOptions<State>) {
        this.state = options.state || {} as State;
        this.actions = options.actions || {};
    }

    getState(): State {
        return this.state;
    }

    setState(newState: State): void {
        this.state = newState;
    }

    dispatch(action: string, payload?: any): void {
        const actionFn = this.actions[action];
        if (actionFn) {
            actionFn(this, payload);
        }
    }
}

class Pinia {
    stores: Record<string, PiniaStore<any>>;

    constructor() {
        this.stores = {};
    }

    store<State>(name: string, options: PiniaStoreOptions<State>): void {
        if (this.stores[name]) {
            throw new Error(`Store '${name}' already exists.`);
        }

        this.stores[name] = new PiniaStore<State>(options);
    }

    useStore<State>(name: string): PiniaStore<State> {
        const store = this.stores[name];
        if (!store) {
            throw new Error(`Store '${name}' does not exist.`);
        }

        return store;
    }
}

// 创建一个Pinia实例
const pinia = new Pinia();

// 创建一个store
pinia.store("counter", {
    state: {
        count: 0
    },
    actions: {
        increment(store) {
            store.setState({
                count: store.state.count + 1
            });
        },
        decrement(store) {
            store.setState({
                count: store.state.count - 1
            });
        }
    }
});

// 使用store
const counterStore = pinia.useStore("counter");

console.log(counterStore.getState()); // { count: 0 }

counterStore.dispatch("increment");
console.log(counterStore.getState()); // { count: 1 }

counterStore.dispatch("decrement");
console.log(counterStore.getState()); // { count: 0 }
