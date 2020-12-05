const requireConfigValue = (value: string | undefined, description: string) => {
  if(value === undefined) {
    throw new Error(`No value provided for: ${description}`);
  }
  return value;
}

export const appConfig = {
  apiUrl: requireConfigValue(process.env.REACT_APP_API_URL, 'apiUrl'),
  firebase: {
    apiKey: requireConfigValue(process.env.REACT_APP_FIREBASE_API_KEY, 'firebase.apiKey'),
    projectId: requireConfigValue(process.env.REACT_APP_FIREBASE_PROJECT_ID, 'firebase.projectId'),
    messagingSenderId: requireConfigValue(process.env.REACT_APP_FIREBASE_MSG_SENDER_ID, 'firebase.messagingSenderId'),
    appId: requireConfigValue(process.env.REACT_APP_FIREBASE_APP_ID, 'firebase.appId'),
  }
}