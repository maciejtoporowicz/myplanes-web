export type Dictionary = {
  translation: {
    common: {
      goBack: string;
      loading: string;
    };
    login: {
      inputPlaceholder: string;
      login: string;
    };
    notification: {
      title: string;
    };
    notificationSettings: {
      enable: string;
      disable: string;
    };
    flight: {
      coordinates: string;
      rangeNorth: string;
      rangeEast: string;
      rangeSouth: string;
      rangeWest: string;
      altitudeThreshold: string;
      lastUpdate: string,
      column: {
        icao24: string,
        callSign: string,
        altitude: string,
        onGround: string,
        make: string,
        model: string,
        owner: string,
      }
      noData: string;
    };
    flights: {
      noObservedAreas: string,
      observedAreas: string,
      areaName: string,
      lastUpdate: string,
      unknown: string
    };
  };
};
