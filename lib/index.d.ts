import { Reducer, Action as ReduxAction } from 'redux';
export declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
export interface Action<T> extends ReduxAction {
    type: string;
    payload: T;
    error?: boolean;
}
export interface ActionHandlers<TState> {
    [key: string]: (state: TState, action: Action<any>) => TState;
}
export declare function createActionHandlers<TState>(handlers: ActionHandlers<TState>, initialState: Partial<TState>, fallback?: (state: TState, action: any) => TState): Reducer<TState>;
export interface Async<R> {
    (dispatch: any, getState: any): Promise<R>;
}
export interface Func<R> {
    (...args: any[]): R | Async<R>;
}
export declare function createAction<TFunc, TAction>(type: string, func: TFunc & (Func<TAction>)): TFunc & {
    type: string;
};
export declare function createActionHandler<TState, TPayload>(action: {
    type: string;
} & ((...args: any[]) => TPayload), handler: (state: TState, action: Action<TPayload>) => TState): {
    [x: string]: (state: TState, action: Action<TPayload>) => TState;
};
