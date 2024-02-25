import Places from "./Places.tsx";
import { useEffect, useState } from "react";
import Error from "./Error.tsx";
import { sortPlacesByDistance } from "../loc.ts";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFecthing, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);
  // use useEffect to stop the infinite loop
  useEffect(() => {
    // use async and await to fetch the data, it will wait for the data to be fetched.
    // this can be done with .then() as well, but async and await is more readable.
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch places.");
        }
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            resData.places,
            position.coords.latitude,
            position.coords.latitude,
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
          console.log(position);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places. Please try again later.",
        });
      }
      setIsFetching(false);
    }
    fetchPlaces();
  }, []);
  if (error) {
    return (
      <Error
        title="An error occured!"
        message={error.message}
        onConfirm={undefined}
      />
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFecthing}
      loadingText="Loading places data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
