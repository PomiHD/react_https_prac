import Places from "./Places.tsx";
import { useEffect, useState } from "react";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFecthing, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  // use useEffect to stop the infinite loop
  useEffect(() => {
    // use async and await to fetch the data, it will wait for the data to be fetched.
    // this can be done with .then() as well, but async and await is more readable.
    async function fetchPlaces() {
      setIsFetching(true);
      const response = await fetch("http://localhost:3000/places");
      const resData = await response.json();
      setAvailablePlaces(resData.places);
      setIsFetching(false);
    }
    fetchPlaces();
  }, []);

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
