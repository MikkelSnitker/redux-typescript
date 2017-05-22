import {Reducer, Action as ReduxAction} from 'redux'
 
export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export interface Action<T> extends ReduxAction {
    type:string;
    payload: T,
    error?:boolean 
}

export interface ActionHandlers<TState> {
    [key: string]: (state: TState, action: Action<any>) => TState
}

export function createActionHandlers<TState>(handlers: ActionHandlers<TState>, initialState: Partial<TState>, fallback?: (state: TState, action: any) => TState): Reducer<TState> {
    return (state, action: Action<any>) => {
        if (handlers[action.type]) {
            const newState = handlers[action.type](state || initialState, action);
            state = Object.assign({}, state, newState)
        } 
        if (typeof fallback === "function") {
            const newState = fallback(state || initialState, action);
            state = Object.assign({}, state, newState);
        }

        return state || initialState;
    };
}

interface KeyValue<T> {
    [key: string]: T;
}

interface Dispatcher<T> {
    <T>(action: Action<T>): void
}



export interface Async<R> {
    (dispatch, getState): Promise<R>
}

export interface Func<R> {
    (...args: any[]): R | Async<R>

}


export function createAction<TFunc, TAction>(type: string, func: TFunc & (Func<TAction>) ) {
    var invoke = (...args: any[]) => {
        var payload = func(...args);

        if (typeof payload === "function" || payload instanceof Promise) {
            return async (dispatch: (action:Action<TAction>)=>void, getState: ()=>{}) => {
                try {
                    var value;
                    if (typeof payload === "function") {
                        value = Promise.resolve(payload(dispatch as (action: Action<TAction>)=>void, getState as ()=>{}));
                    } else {
                       
                    }
                    dispatch({ type, payload:value, error: false});
                    value = await value;
                    dispatch({ type, payload:value, error: false });
                    return value;

                } catch (error) {
                    dispatch({ type, payload: error, error: true});
                    throw error;
                }
            }
        } else {
            return { type, payload: payload, error: false, meta:null }
        }

    };

    return Object.assign(invoke as any as (TFunc), {
        type
    });
}

export function createActionHandler<TState, TPayload>(action: {type:string} & ( (...args: any[])=> TPayload), handler: (state: TState, action: Action<TPayload>)=>TState) {
    return {
        [action.type]: handler
    }

}
