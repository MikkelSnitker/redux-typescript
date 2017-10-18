import {Reducer as ReduxReducer, Action as ReduxAction} from 'redux'
 
export type Partial<T> = {
    [P in keyof T]?: T[P];
};

/*
export interface Action<T> extends ReduxAction {
    type:string;
    payload: T,
    error?:boolean 
}*/
/*
export interface ActionHandlers<TState> {
    [key: string]: (state: TState, action: Action<any>) => TState
}*/
export type Test=   {
    name: string;
  
}

/*
export type ActionType<TPayload> = {
    type?:string;
    payload: TPayload;
}
*/

export type Dispatch<TPayload> = (dispatch: <TAction>(action: Action<TAction>)=>Promise<any>, getState:()=>TPayload)=>void | Promise<void>;


export type Action<TPayload> = {
    type?:string;
    payload: TPayload;
};

export type AsyncAction<TPayload> = Promise<Action<TPayload>>;




export function createAction<Func extends (...args:any[])=> TRet | Dispatch<TRet>, TRet extends Action<TPayload> , TPayload>(type:string, func: Func) {
    return func;
}

export type DispatchedAction<TState, TPayload> = Promise<void> & {
    dispatch: Dispatch<TPayload>
}

export function dispatchedAction<TState, TPayload>(f: Dispatch<TPayload> ):DispatchedAction<TState, TPayload>{
    var _resolve, _reject;
    var p  = new Promise<void>((resolve,reject)=>{
        _resolve = resolve;
        _reject = reject;
    });

   return Object.assign(p, {dispatch: async (...args: any[])=>{
        try {
            _resolve(await f.apply(this,args));
        } catch (error){
           _reject(error);
        }
   }});
}

export type ActionHandler<TState, TPayload> =  (state:TState, action:TPayload | Promise<TPayload>)=>TState;

export type ActionPayload<TPayload> = ((...args:any[])=>ActionPayload<TPayload>) | Promise<TPayload> | TPayload

export type Reducer<TState> = ReduxReducer<TState> & {
    createHandler: <TPayload>(
            action: (...args: any[])=> ActionPayload<TPayload>,
            handler: ActionHandler<TState,TPayload>
        )=>void;
    createAction: <Func extends (...args:any[])=> TRet, TRet extends Action<TPayload> | AsyncAction<TPayload>  /*| Dispatch<TState> | Promise<Dispatch<TState>>*/ | DispatchedAction<TState>, TPayload>(type:string, func: Func) => Func;
};

export function createReducer<TState>(initialState:Partial<TState>): Reducer<TState> {
    var handlers: {[type:string]: ActionHandler<TState,any>} = {};

    var reducer: ReduxReducer<TState> = (state:TState, action:ReduxAction)=>{

        return state;
    };
    
    var createHandler = (action: Test, handler:  ActionHandler<TState,any> )=>{
        handlers[action.name] = handler as any;
    };

    var createAction = ((type:string, func: (...args: any[])=>any)=>{
        return func;
    } ) as any;

    return Object.assign(reducer, {createHandler,   createAction});
}

/*
export function createActionHandlers<TState>(handlers: ActionHandlers<TState>, initialState: Partial<TState>, fallback?: (state: TState, action: any) => TState): Reducer<TState> {
    return ((state: TState, action: Action<any>) => {
     
        if (handlers[action.type]) {
            const newState = handlers[action.type](state || initialState as TState, action);
            state = Object.assign({}, state, newState)
        } 
        if (typeof fallback === "function") {
            const newState = fallback(state || initialState as TState, action);
            state = Object.assign({}, state, newState);
        }

        return (state || initialState) as any;
    }) as Reducer<TState>;
}
*/

/*
interface KeyValue<T> {
    [key: string]: T;
}
*/
/*
interface Dispatcher<T> {
    <T>(action: Action<T>): void
}
*/

/*
export interface Async<R> {
    (dispatch, getState): Promise<R>
}

export interface Func<R> {
    (...args: any[]): R | Async<R>

}
*/

/*export function createAction<TFunc, TAction>(type: string, func: TFunc & (Func<TAction>) ) {
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
*/