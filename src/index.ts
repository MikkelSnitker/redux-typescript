import {
    Reducer as ReduxReducer, 
    Action as ReduxAction, 
    createStore as ReduxCreateStore, 
    StoreCreator as ReduxStoreCreator,
    combineReducers as ReduxCombineReducers
} from 'redux'
 
export type StoreCreator = ReduxStoreCreator;
export const createStore = ReduxCreateStore;
export const combineReducers = ReduxCombineReducers;
export type Partial<T> = {
    [P in keyof T]?: T[P];
};


export type Dispatch<TPayload> = (dispatch: <TAction>(action: Action<TAction>)=>Promise<any>, getState:()=>TPayload)=>void | Promise<void>;


export type Action<TPayload> = {
    type?:string;
    payload: TPayload;
};

export type AsyncAction<TPayload> = Promise<Action<TPayload>>;


export type DispatchedAction<TState, TPayload> = Promise<void> & {
    dispatch: Dispatch<TPayload>
}

export function dispatchedAction<TState, TPayload>(f: Dispatch<TPayload> ):DispatchedAction<TState, TPayload>{
    var _resolve:Function, _reject: Function;
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
export type ReducerExtension<TState> = {
    createHandler: <TPayload>(
            action: (...args: any[])=> ActionPayload<TPayload>,
            handler: ActionHandler<TState,TPayload>
        )=>void;
    createAction: <Func extends (...args:any[])=> TRet, TRet extends Action<TPayload> | AsyncAction<TPayload>  /*| Dispatch<TState> | Promise<Dispatch<TState>>*/ | DispatchedAction<TState, TPayload>, TPayload>(type:string, func: Func) => Func;
};
export type Reducer<TState> = ReduxReducer<TState> & ReducerExtension<TState>;

export function createReducer<TState>(initialState:Partial<TState>): Reducer<TState> {
    var handlers: {[type:string]: ActionHandler<TState,any>} = {};

    var reducer: ReduxReducer<TState> = (state:TState, action:ReduxAction)=>{
        const handler = handlers[action.type];
        if(typeof handler === "function"){
            state = Object.assign({}, handler(state, action));
        }
        return state || initialState as TState;
    };
    
    var createHandler = (action: {name:string}, handler:  ActionHandler<TState,any> )=>{
        handlers[action.name] = handler as any;
    };

    var createAction = ((type:string, func: (...args: any[])=>any)=>{
        return Object.defineProperty(func, "name", {value: type});
    } ) as any;

    return Object.assign(reducer, {createHandler,   createAction});
}
