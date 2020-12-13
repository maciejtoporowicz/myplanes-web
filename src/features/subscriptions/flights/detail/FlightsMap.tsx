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
  planes: Array<Plane>;
};

const createMaxBoundsFrom = (center: { lat: number, lng: number }, planes: Array<Plane>): google.maps.LatLngBounds => {
  let minLat = center.lat;
  let maxLat = center.lat;
  let minLng = center.lng;
  let maxLng = center.lng;

  planes.forEach(plane => {
    const lat = plane.position.lat;
    const lng = plane.position.lng;

    if (lat) {
      minLat = Math.min(lat, minLat);
      maxLat = Math.max(lat, maxLat);
    }

    if (lng) {
      minLng = Math.min(lng, minLng);
      maxLng = Math.max(lng, maxLng);
    }
  })

  return new google.maps.LatLngBounds(
    new google.maps.LatLng(
      minLat,
      minLng
    ),
    new google.maps.LatLng(
      maxLat,
      maxLng
    ),
  )
}

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

    const mapBounds = createMaxBoundsFrom(props.center, props.planes);

    map.fitBounds(mapBounds);

    props.planes.forEach(plane => {
      new google.maps.Marker({
        position: plane.position,
        map,
        title: `${plane.callSign || ''} ${plane.make || ''} ${plane.model || ''} ${plane.owner || ''}`.trim(),
      });
    })
  }, [mapContainerRef, mapContainerRef.current, isLoaded]);

  return (
    <div ref={mapContainerRef} id="map" style={{ width: '100%', height: '400px' }} />
  );
};

export default FlightsMap;