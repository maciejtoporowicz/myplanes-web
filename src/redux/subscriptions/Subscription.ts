export type Subscription = {
  jobId: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaryOffsetNorth: string;
  boundaryOffsetEast: string;
  boundaryOffsetSouth: string;
  boundaryOffsetWest: string;
  altitudeThreshold: string;
}