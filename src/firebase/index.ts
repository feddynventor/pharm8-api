import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

export const sendNotification = async (body: string, token: string): Promise<void> =>{
// export const sendNotification = async (notification: {body: string, title: string}, token: string): Promise<void> =>{
    return getMessaging(
        initializeApp({
            credential: credential.cert(__dirname+"/firebase-adminsdk.json")
        })
    ).send({
        notification: {
            title: "Pharmate",
            body
        },
        token
    }).then()
}