"use client";
import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { getAuthToken } from "@/lib/cookies";

interface Farmer {
  id: string;
  farmName: string;
  farmLocation: string;
  farmLatitude: number | null;
  farmLongitude: number | null;
  registrationStatus: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface CountryMapProps {
  mapColor?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "700px",
  borderRadius: "12px",
};

// Default center (Kenya)
const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

const CountryMap: React.FC<CountryMapProps> = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Fetch farmers with coordinates
  useEffect(() => {
    async function fetchFarmers() {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/farmers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch farmers");
        }

        const data = await response.json();
        // Filter farmers that have valid coordinates
        const farmersWithCoords = data.filter(
          (f: Farmer) =>
            f.farmLatitude !== null &&
            f.farmLongitude !== null &&
            !isNaN(Number(f.farmLatitude)) &&
            !isNaN(Number(f.farmLongitude))
        );
        setFarmers(farmersWithCoords);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load farmers");
      } finally {
        setLoading(false);
      }
    }

    fetchFarmers();
  }, []);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit bounds to show all markers
  useEffect(() => {
    if (map && farmers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      farmers.forEach((farmer) => {
        if (farmer.farmLatitude && farmer.farmLongitude) {
          bounds.extend({
            lat: Number(farmer.farmLatitude),
            lng: Number(farmer.farmLongitude),
          });
        }
      });
      map.fitBounds(bounds);
      
      // Don't zoom in too much for single marker
      const listener = google.maps.event.addListener(map, "idle", () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 10) {
          map.setZoom(10);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, farmers]);

  const getMarkerColor = () => {
    return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <p className="text-red-500">Error loading Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Farmer Locations
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">Loading farmer data...</p>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={farmers.length > 0 ? undefined : defaultCenter}
          zoom={farmers.length > 0 ? undefined : 6}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {farmers.map((farmer) => (
            <Marker
              key={farmer.id}
              position={{
                lat: Number(farmer.farmLatitude),
                lng: Number(farmer.farmLongitude),
              }}
              icon={getMarkerColor()}
              onClick={() => setSelectedFarmer(farmer)}
            />
          ))}

          {selectedFarmer && (
            <InfoWindow
              position={{
                lat: Number(selectedFarmer.farmLatitude),
                lng: Number(selectedFarmer.farmLongitude),
              }}
              onCloseClick={() => setSelectedFarmer(null)}
            >
              <div className="p-2 min-w-[200px]">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {selectedFarmer.farmName}
                </h4>
                <p className="text-sm text-gray-600">
                  <strong>Owner:</strong>{" "}
                  {selectedFarmer.user?.firstName} {selectedFarmer.user?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {selectedFarmer.farmLocation}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`capitalize ${
                      selectedFarmer.registrationStatus === "certified"
                        ? "text-green-600"
                        : selectedFarmer.registrationStatus === "declined"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedFarmer.registrationStatus}
                  </span>
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}

      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Showing {farmers.length} farmer{farmers.length !== 1 ? "s" : ""} with location data
      </p>
    </div>
  );
};

export default CountryMap;
