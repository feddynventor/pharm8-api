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
        return getMessaging(this.instance)
        .send({
            notification: {
                title: "Pharmate",
                body
            },
            token
        })
        .then( msg_id => {
            console.log(msg_id) //ai fini di primo debug delle notifiche asincrone, #TODO: rimuovere
        })
        .catch( err => {
            console.log(err)  //ai fini di primo debug delle notifiche asincrone, #TODO: rimuovere
        } )

    }
}