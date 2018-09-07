import firebase from 'firebase';
import axios from 'axios';

export const requestPermission = async () => {
    try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('token do usuário:', token);
        return token;
    } catch (error) {
        console.error(error);
    }
}

export const sendNotification = (token, authorName, message) => {
    return axios.post('https://fcm.googleapis.com/fcm/send', {
        "notification": {
            "title": `Nova mensagem de ${authorName}`,
            "body": message,
            "click_action": "https://aladainha.firebaseapp.com/messages",
            "icon": "https://aladainha.firebaseapp.com/favicon-96x96.png"
        },
        "to": token
    }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA6XQKnyA:APA91bFLlGVztfvOUtegEyUCaXSfs_GKonvCnWXwBypL7CN637gLz2tBFd7TIbWtiH0sbGOmCHryOUvCxstIxlco6xTQ9a1RU4GDTBinil_wKrfQHkKhtAwh1TgWKBKXcosVUu2KWQm7fGiwj__ZZiX9adbWT441QA'
            }
        })
}

export function sendTokenToServer(token) {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    const usersRef = db.collection('users');

    usersRef.doc(currentUser.uid).set({
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
        email: currentUser.email,
        userToken: token
    })

}
