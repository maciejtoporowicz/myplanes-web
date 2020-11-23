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
      enable: 'Turn notifications on',
      disable: 'Turn notifications off',
    },
    flight: {
      coordinates: 'Coordinates',
      altitudeThreshold: 'Altitude threshold',
      rangeNorth: 'Range north',
      rangeEast: 'Range east',
      rangeSouth: 'Range south',
      rangeWest: 'Range west',
      lastUpdate: 'Last update: {{lastUpdate}}',
      column: {
        icao24: 'ICAO24',
        callSign: 'Znak wywoławczy',
        altitude: 'Wysokość [m]',
        onGround: 'Na ziemi?',
        make: 'Marka',
        model: 'Model',
        owner: 'Właściciel',
      },
      noData: 'No data'
    },
    flights: {
      noObservedAreas: 'No observed areas',
      observedAreas: 'Observed areas',
      areaName: 'Area name',
      lastUpdate: 'Last update',
      unknown: 'Unknown'
    }
  },
};

export default en;
