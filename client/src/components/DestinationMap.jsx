/**
 * @file DestinationMap.jsx
 * @description Stabilized Leaflet map that handles Framer Motion layout shifts.
 */
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customOrangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// THE FIX: The Brain of the Map
const MapController = ({ activeLocation, defaultCenter }) => {
  const map = useMap();

  useEffect(() => {
    // 1. Force Leaflet to wake up and check its container size after Framer Motion finishes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    // 2. Handle specific clicks from the Sidebar
    if (activeLocation && activeLocation.length === 2) {
      const lat = parseFloat(activeLocation[0]);
      const lng = parseFloat(activeLocation[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
      }
    }
    // 3. Handle the initial load of the city
    else if (defaultCenter && defaultCenter.length === 2) {
      const lat = parseFloat(defaultCenter[0]);
      const lng = parseFloat(defaultCenter[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 12, { animate: true, duration: 1.5 });
      }
    }
  }, [activeLocation, defaultCenter, map]);

  return null;
};

export default function DestinationMap({
  coords,
  className,
  landmarks = [],
  activeLocation,
}) {
  // Use null instead of [0,0] to ensure the map DOES NOT MOUNT until we have real data
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (coords && coords.length === 2 && coords[0] !== 0) {
      setMapCenter([parseFloat(coords[0]), parseFloat(coords[1])]);
    } else if (landmarks && landmarks.length > 0) {
      setMapCenter([
        parseFloat(landmarks[0].lat),
        parseFloat(landmarks[0].lng),
      ]);
    }
  }, [coords, landmarks]);

  // STRICT GUARD: If we don't have a center yet, show the loader.
  // This absolutely prevents the "zoomed out world map" glitch.
  if (!mapCenter) {
    return (
      <div
        className={`flex items-center justify-center bg-[#050505] ${className}`}
      >
        <div className="animate-pulse text-orange-500 font-bold uppercase tracking-widest text-xs">
          Synchronizing Cartography...
        </div>
      </div>
    );
  }

  return (
    <div className={`relative z-0 ${className}`}>
      {/* MapContainer now only mounts when mapCenter is a valid coordinate array */}
      <MapContainer
        center={mapCenter}
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        /> */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* The controller that handles the flying animation */}
        <MapController
          activeLocation={activeLocation}
          defaultCenter={mapCenter}
        />

        {/* Plot the orange pins */}
        {landmarks.map((place, index) => {
          if (!place.lat || !place.lng) return null;

          return (
            <Marker
              key={index}
              position={[parseFloat(place.lat), parseFloat(place.lng)]}
              icon={customOrangeIcon}
            >
              <Popup className="custom-popup text-black">
                <div className="p-1">
                  <h3 className="font-bold text-sm uppercase mb-1">
                    {place.name}
                  </h3>
                  <p className="text-xs text-gray-600 m-0 leading-tight">
                    {place.desc}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
