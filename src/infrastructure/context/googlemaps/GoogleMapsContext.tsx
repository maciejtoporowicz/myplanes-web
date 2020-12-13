import React, {ReactNode, useEffect, useState} from 'react';
import {appConfig} from "../../config/appConfig";
import {Loader} from "@googlemaps/loader"

const GoogleMapsLoadingStateContext = React.createContext<boolean | undefined>(
  undefined
);

const GoogleMapsLoadingContextProvider = ({ children }: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader: Loader = new Loader({ apiKey: appConfig.googleMapsApiKey });
    loader
      .load()
      .then(() => {
        setLoaded(true);
      });
  }, []);

  return (
    <GoogleMapsLoadingStateContext.Provider value={loaded}>
      {children}
    </GoogleMapsLoadingStateContext.Provider>
  );
};

const useGoogleMapsLoading = () => {
  const context = React.useContext(GoogleMapsLoadingStateContext);
  if (context === undefined) {
    throw new Error('useGoogleMapsLoading must be used within a GoogleMapsLoadingContextProvider');
  }
  return context;
};

export { GoogleMapsLoadingContextProvider, useGoogleMapsLoading };
