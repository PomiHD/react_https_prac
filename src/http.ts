import Error from "./components/Error.tsx";

export async function fetchAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places");
  const resData = await response.json();
  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to fetch places.");
  }
  return resData.places;
}

export async function updateUserPlaces(places) {
  const response = await fetch(`http://localhost:3000/user-places`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    // the body must follow the same structure as the server expects
    body: JSON.stringify({ places: places }),
  });
  const resData = await response.json();
  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to update user data.");
  }
  return resData.message;
}
