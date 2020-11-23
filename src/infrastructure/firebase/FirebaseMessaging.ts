import firebaseApp from "firebase/app";
import "firebase/messaging";
import {appConfig} from "../config/appConfig";

const getToken = async (): Promise<string | null> => {
  try {
    return await firebaseApp.messaging().getToken();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createMessaging(): Promise<FirebaseMessaging> {
  const isFirebaseInitialized = firebaseApp.apps.length > 0;

  if(!isFirebaseInitialized) {
    firebaseApp.initializeApp(appConfig.firebase);
  }

  const token = await getToken();

  if(token === null) {
    throw new Error("No token for push notifications");
  }

  return new FirebaseMessaging(token);
}

type Unsubscribe = () => void;

class FirebaseMessaging {
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  onMessage<T>(handler: (data: T) => void): Unsubscribe {
    return firebaseApp.messaging().onMessage(({data}: { data: T }) => {
      handler(data);
    });
  }

  onBackgroundMessage<T extends { [key: string]: string }>(handler: (data?: { [key: string]: string }) => void): Unsubscribe {
    return firebaseApp.messaging().onBackgroundMessage(({data}: { data?: { [key: string]: string } }) => {
      handler(data);
    });
  }
}

export default FirebaseMessaging;