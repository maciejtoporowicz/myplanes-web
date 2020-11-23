type FlightData = {
  icao24: string;
  callSign?: string;
  barometricAltitude?: {
    meters: number;
  }
  onGround?: boolean;
  aircraftMake?: string;
  aircraftModel?: string;
  owner?: string;
}

export default FlightData;