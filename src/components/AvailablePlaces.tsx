import Places from "./Places.tsx";
import { useEffect, useState } from "react";
import Error from "./Error.tsx";

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
        const response = await fetch("http://localhost:3000/placesss");
        const resData = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch places.");
        }
        setAvailablePlaces(resData.places);
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
