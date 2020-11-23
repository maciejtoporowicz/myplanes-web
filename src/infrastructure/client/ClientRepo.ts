const clientIdKey = 'clientid';

export const clientRepo = ({
  getId: (): string | undefined => {
    return localStorage.getItem(clientIdKey) || undefined;
  },
  setId: (clientId: string) => {
    localStorage.setItem(clientIdKey, clientId);
  },
  clear: () => {
    localStorage.removeItem(clientIdKey);
  }
});