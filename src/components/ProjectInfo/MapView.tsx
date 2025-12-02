'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapView = ({
  coordinates,
  projectLocations = [],
  customIcon,
}: {
  coordinates?: [number, number];
  projectLocations?: { coordinates: [number, number]; name: string }[];
  customIcon?: L.Icon;
}) => {
  const center =
    coordinates || (projectLocations.length > 0 ? projectLocations[0].coordinates : [0, 0]);

  return (
    <MapContainer
      center={center}
      zoom={coordinates ? 5 : 0}
      className="w-full h-full z-0"
      style={{ position: 'relative' }}
    >
      <TileLayer
        url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG:3857@png/{z}/{x}/{-y}.png"
        attribution='&copy; <a href="https://www.ign.gob.ar/">Instituto Geográfico Nacional</a>'
      />

      {coordinates && (
        <Marker position={coordinates} icon={customIcon}>
          <Popup>Selected Location</Popup>
        </Marker>
      )}
      {projectLocations?.map((project, index) => (
        <Marker key={index} position={project.coordinates} icon={customIcon}>
          <Popup>{project.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
