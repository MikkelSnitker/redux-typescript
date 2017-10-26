"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
function createStore(reducer, preloadedState, enhancer) {
    return redux_1.createStore(reducer, preloadedState, enhancer);
}
exports.createStore = createStore;
exports.combineReducers = redux_1.combineReducers;
function dispatchedAction(f) {
    var _resolve, _reject;
    var p = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });
    return Object.assign(p, {
        dispatch: (...args) => __awaiter(this, void 0, void 0, function* () {
            try {
                _resolve(yield f.apply(this, args));
            }
            catch (error) {
                _reject(error);
            }
        })
    });
}
exports.dispatchedAction = dispatchedAction;
function createAction(type, func) {
    return Object.defineProperty(func, "name", { value: type });
    //    return (Object.defineProperty(func, "name", { value: type }) );
}
exports.createAction = createAction;
;
function createReducer(initialState) {
    var handlers = {};
    var reducer = (state, action) => {
        const handler = handlers[action.type];
        if (typeof handler === "function") {
            state = Object.assign({}, handler(state, action));
        }
        return state || initialState;
    };
    var createHandler = (action, handler) => {
        handlers[action.name] = handler;
    };
    var createAction = ((type, func) => {
        return Object.defineProperty(func, "name", { value: type });
    });
    return Object.assign(reducer, { createHandler, createAction });
}
exports.createReducer = createReducer;
//# sourceMappingURL=index.js.map