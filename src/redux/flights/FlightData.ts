type FlightData = {
  icao24: string;
  callSign?: string;
  barometricAltitude?: {
    meters: number;
  };
  longitude?: {
    value: number;
  };
  latitude?: {
    value: number;
  };
  onGround?: boolean;
  aircraftMake?: string;
  aircraftModel?: string;
  owner?: string;
}

export default FlightData;