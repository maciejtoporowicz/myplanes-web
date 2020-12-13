import {Dictionary} from './Dictionary';

const en: Dictionary = {
  translation: {
    common: {
      goBack: 'Back',
      loading: 'Loading',
    },
    notification: {
      title: 'New flights: {{newFlightsCount}}'
    },
    login: {
      inputPlaceholder: 'Your id',
      login: 'Log in'
    },
    notificationSettings: {
      enable: 'Turn push notifications on',
      disable: 'Turn push notifications off',
    },
    subscription: {
      scannerConfig: "Scanner config",
      coordinates: 'Coordinates',
      altitudeThreshold: 'Altitude threshold',
      rangeNorth: 'Range north',
      rangeEast: 'Range east',
      rangeSouth: 'Range south',
      rangeWest: 'Range west',
      flightsAsOf: '{{numOfFlights}} flights found as of {{- lastUpdate}}',
      column: {
        icao24: 'ICAO24',
        callSign: 'Call sign',
        longitude: 'Longitude',
        latitude: 'Latitude',
        altitude: 'Altitude [m]',
        onGround: 'On ground?',
        make: 'Make',
        model: 'Model',
        owner: 'Owner',
      },
      noData: 'No data'
    },
    subscriptions: {
      noObservedAreas: 'No observed areas',
      observedAreas: 'Observed areas',
      areaName: 'Area name',
      lastUpdate: 'Last update',
      unknown: 'Unknown'
    }
  },
};

export default en;
