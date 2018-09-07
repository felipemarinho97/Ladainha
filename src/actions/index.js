export const SET_CHAT_MESSAGES = 'SET_CHAT_MESSAGES';
export function setChatMessages(id, messagesList) {
    return { type: SET_CHAT_MESSAGES, id, messagesList };
}