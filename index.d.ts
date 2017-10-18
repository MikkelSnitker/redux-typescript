import { Reducer as ReduxReducer, StoreCreator as ReduxStoreCreator } from 'redux';
export declare type StoreCreator = ReduxStoreCreator;
export declare const createStore: ReduxStoreCreator;
export declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
export declare type Dispatch<TPayload> = (dispatch: <TAction>(action: Action<TAction>) => Promise<any>, getState: () => TPayload) => void | Promise<void>;
export declare type Action<TPayload> = {
    type?: string;
    payload: TPayload;
};
export declare type AsyncAction<TPayload> = Promise<Action<TPayload>>;
export declare type DispatchedAction<TState, TPayload> = Promise<void> & {
    dispatch: Dispatch<TPayload>;
};
export declare function dispatchedAction<TState, TPayload>(f: Dispatch<TPayload>): DispatchedAction<TState, TPayload>;
export declare type ActionHandler<TState, TPayload> = (state: TState, action: TPayload | Promise<TPayload>) => TState;
export declare type ActionPayload<TPayload> = ((...args: any[]) => ActionPayload<TPayload>) | Promise<TPayload> | TPayload;
export declare type Reducer<TState> = ReduxReducer<TState> & {
    createHandler: <TPayload>(action: (...args: any[]) => ActionPayload<TPayload>, handler: ActionHandler<TState, TPayload>) => void;
    createAction: <Func extends (...args: any[]) => TRet, TRet extends Action<TPayload> | AsyncAction<TPayload> | DispatchedAction<TState>, TPayload>(type: string, func: Func) => Func;
};
export declare function createReducer<TState>(initialState: Partial<TState>): Reducer<TState>;
