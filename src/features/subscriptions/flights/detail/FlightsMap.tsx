import * as React from 'react';
import {useEffect, useRef} from 'react';
import {useGoogleMapsLoading} from "../../../../infrastructure/context/googlemaps/GoogleMapsContext";

type LatLng = {
  lat: number;
  lng: number;
}

type Plane = {
  position: LatLng;
  callSign?: string;
  make?: string;
  model?: string;
  owner?: string;
}

type Props = {
  center: LatLng;
  swBounds: LatLng;
  neBounds: LatLng;
  planes: Array<Plane>;
};

const FlightsMap = (props: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const isLoaded = useGoogleMapsLoading();

  useEffect(() => {
    if(!isLoaded || !mapContainerRef.current) {
      return;
    }

    const map = new google.maps.Map(mapContainerRef.current, {
      center: props.center,
      zoom: 12
    });

    map.fitBounds(new google.maps.LatLngBounds(props.swBounds, props.neBounds));

    props.planes.forEach(plane => {
      new google.maps.Marker({
        position: plane.position,
        map,
        title: `${plane.callSign} ${plane.make} ${plane.model} ${plane.owner}`,
      });
    })
  }, [mapContainerRef, mapContainerRef.current, isLoaded]);

  return (
    <div ref={mapContainerRef} id="map" style={{ width: '100%', height: '400px' }} />
  );
};

export default FlightsMap;