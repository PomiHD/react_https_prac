import Places from "./Places.tsx";
import { useEffect, useState } from "react";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/places")
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setAvailablePlaces(resData.places);
      });
  }, []);

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
