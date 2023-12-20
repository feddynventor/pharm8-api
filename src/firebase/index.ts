import { App, initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

export class FirebaseApp {
    instance: App;
    constructor() {
        this.instance = initializeApp({
            credential: credential.cert(process.env.APP_ROOT+"/credentials/firebase-adminsdk.json")
        })
    }
    async send(body: string, token: string): Promise<void> {
        return getMessaging(this.instance).send({
            notification: {
                title: "Pharmate",
                body
            },
            token
        }).then()
    }
}

// export const sendNotification = async (body: string, token: string): Promise<void> =>{
// // export const sendNotification = async (notification: {body: string, title: string}, token: string): Promise<void> =>{
//     return getMessaging(
//         initializeApp({
//             credential: credential.cert(process.env.APP_ROOT+"/credentials/firebase-adminsdk.json")
//         })
//     ).send({
//         notification: {
//             title: "Pharmate",
//             body
//         },
//         token
//     }).then()
// }