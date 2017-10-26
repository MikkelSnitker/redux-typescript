import { Reducer as ReduxReducer, combineReducers as ReduxCombineReducers, StoreEnhancer, Store } from 'redux';
export declare function createStore<S>(reducer: ReduxReducer<S> | ReduxReducer<{
    [key in keyof S]: ReduxReducer<S[key]>;
}>, enhancer?: StoreEnhancer<S>): Store<S>;
export declare const combineReducers: typeof ReduxCombineReducers;
export declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
export declare type Dispatch<TPayload> = (dispatch: <TAction>(action: Action<TAction>) => Promise<any>, getState: () => TPayload) => void | Promise<void>;
export declare type ActionContext = {
    dispatch: <TPayload>(action: Action<TPayload>) => void;
    getState: <TStore>() => TStore;
};
export declare type Action<TPayload> = {
    type?: string;
    payload: TPayload | Promise<TPayload>;
};
export declare type DispatchedAction<TState, TPayload> = Promise<void> & {
    dispatch: Dispatch<TPayload>;
};
export declare function dispatchedAction<TState, TPayload>(f: Dispatch<TPayload>): DispatchedAction<TState, TPayload>;
export declare type ActionHandler<TState, TPayload> = (state: TState, action: Action<TPayload>) => TState;
export declare type ActionPayload<TPayload> = ((...args: any[]) => ActionPayload<TPayload>) | Promise<TPayload> | TPayload;
export declare type ActionCreator = <Func1 extends (...args: any[]) => TRet, Func extends (this: ActionContext, ...args: any[]) => TRet, TRet extends TPayload, TPayload>(type: string, func: Func) => Func1;
export declare type ReducerExtension<TState> = {
    createHandler: <TPayload>(action: (...args: any[]) => ActionPayload<TPayload>, handler: ActionHandler<TState, TPayload>) => void;
    createAction: ActionCreator;
};
export declare type Reducer<TState> = ReduxReducer<TState> & ReducerExtension<TState>;
export declare type Test<T> = (this: ActionContext, ...args: any[]) => any & T;
export declare type FuncContext<TFunc> = TFunc & {
    (this: ActionContext, ...args: any[]): any;
};
export declare function createAction1<Func>(type: string, func: FuncContext<Func>): Func;
export declare const createAction: ActionCreator;
export declare function createReducer<TState>(initialState: Partial<TState>): Reducer<TState>;
