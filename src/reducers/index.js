import { combineReducers } from 'redux'
import { SET_CHAT_MESSAGES } from '../actions';

const initialState = {
    chatMessages: {}
}

function app (state = initialState, action) {
    console.log("reducer", action, state);
    
    switch (action.type) {
        case SET_CHAT_MESSAGES:
            console.log(action)
            return Object.assign({}, state, {
                chatMessages: {
                    [action.id]: action.messagesList
                }
            })
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    app
});

export default rootReducer;