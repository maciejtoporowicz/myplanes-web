import React, { ReactNode, useEffect, useState } from 'react';
import FirebaseMessaging, {createMessaging} from "../../firebase/FirebaseMessaging";
import {appConfig} from "../../config/appConfig";

type Unsubscribe = () => void;

type MessagingActions = {
  onMessage: <T,>(handler: (data: T) => void) => Unsubscribe;
}

const MessagingStateContext = React.createContext<MessagingActions | undefined>(
  undefined
);

const setupMessaging = async (clientId: string) => {
  const messaging = await createMessaging();

  await fetch(`${appConfig.apiUrl}/firebase/client/${clientId}/token`, {
    method: 'PUT', headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({"token": messaging.token})
  });

  return messaging;
}

const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseMessaging, setFirebaseMessaging] = useState<FirebaseMessaging | undefined>(undefined);
  const clientId: string | undefined = undefined;

  useEffect(() => {
    if(clientId) {
      setupMessaging(clientId).then(messaging => setFirebaseMessaging(messaging));
    }
  }, [clientId]);

  const contextValue: MessagingActions = firebaseMessaging ? {
    onMessage: <T,>(handler: (data: T) => void) => firebaseMessaging.onMessage(handler)
  } : {
    onMessage: () => () => { return; }
  };

  return (
    <MessagingStateContext.Provider value={contextValue}>
      {children}
    </MessagingStateContext.Provider>
  );
};

const useMessaging = () => {
  const context = React.useContext(MessagingStateContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

export { MessagingProvider, useMessaging };
