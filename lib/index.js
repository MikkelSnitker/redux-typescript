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
function createActionHandlers(handlers, initialState, fallback) {
    return (state, action) => {
        if (handlers[action.type]) {
            const newState = handlers[action.type](state || initialState, action);
            state = Object.assign({}, state, newState);
        }
        if (typeof fallback === "function") {
            const newState = fallback(state || initialState, action);
            state = Object.assign({}, state, newState);
        }
        return state || initialState;
    };
}
exports.createActionHandlers = createActionHandlers;
function createAction(type, func) {
    var invoke = (...args) => {
        var payload = func(...args);
        if (typeof payload === "function" || payload instanceof Promise) {
            return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
                try {
                    var value;
                    if (typeof payload === "function") {
                        value = Promise.resolve(payload(dispatch, getState));
                    }
                    else {
                    }
                    dispatch({ type, payload: value, error: false });
                    value = yield value;
                    dispatch({ type, payload: value, error: false });
                    return value;
                }
                catch (error) {
                    dispatch({ type, payload: error, error: true });
                    throw error;
                }
            });
        }
        else {
            return { type, payload: payload, error: false, meta: null };
        }
    };
    return Object.assign(invoke, {
        type
    });
}
exports.createAction = createAction;
function createActionHandler(action, handler) {
    return {
        [action.type]: handler
    };
}
exports.createActionHandler = createActionHandler;
//# sourceMappingURL=index.js.map