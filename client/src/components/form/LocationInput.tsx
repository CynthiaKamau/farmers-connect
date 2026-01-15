"use client";
import React, { useRef, useEffect, useState } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

interface LocationData {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface LocationInputProps {
  id: string;
  placeholder?: string;
  onChange: (location: LocationData) => void;
  className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  id,
  placeholder = "Search for a location",
  onChange,
  className = "",
}) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place.geometry && place.geometry.location) {
        const locationData: LocationData = {
          address: place.formatted_address || place.name || "",
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        onChange(locationData);
      } else {
        // User typed something but didn't select from dropdown
        onChange({
          address: inputRef.current?.value || "",
          latitude: null,
          longitude: null,
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // When user types without selecting, update address only
    onChange({
      address: e.target.value,
      latitude: null,
      longitude: null,
    });
  };

  if (loadError) {
    return (
      <div className="text-red-500 text-sm">Error loading Google Maps</div>
    );
  }

  if (!isLoaded) {
    return (
      <input
        type="text"
        id={id}
        placeholder="Loading..."
        disabled
        className={`h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 ${className}`}
      />
    );
  }

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      options={{
        types: ["geocode", "establishment"],
      }}
    >
      <input
        ref={inputRef}
        type="text"
        id={id}
        placeholder={placeholder}
        onChange={handleInputChange}
        className={`h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`}
      />
    </Autocomplete>
  );
};

export default LocationInput;
