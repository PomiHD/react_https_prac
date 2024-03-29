import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.tsx";
import Modal from "./components/Modal.tsx";
import DeleteConfirmation from "./components/DeleteConfirmation.tsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.tsx";
import { fetchUserPlaces, updateUserPlaces } from "./http.ts";
import Error from "./components/Error.tsx";

function App() {
  const selectedPlace = useRef();
  const [isFecthing, setIsFetching] = useState(false);
  const [userPlaces, setUserPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);
  const [errorFetchingUserPlaces, setErrorFetchingUserPlaces] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
      } catch (error) {
        setErrorFetchingUserPlaces({
          message:
            error.message ||
            "Failed to fetch user places. Please try again later.",
        });
      }
      setIsFetching(false);
    }
    fetchPlaces();
  }, []);
  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      // Revert the state if the request fails
      setUserPlaces(userPlaces);
      console.log(error.message);
      setErrorUpdatingPlaces({
        message:
          error.message || "Failed to update places. Please try again later.",
      });
    }
  }
  // if (errorUpdatingPlaces) {
  //   return (
  //     <Error
  //       title="An error occured!"
  //       message={errorUpdatingPlaces.message}
  //       onConfirm={undefined}
  //     />
  //   );
  // }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id,
        ),
      );
      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id),
        );
      } catch (error) {
        // Revert the state if the request fails
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({
          message:
            error.message || "Failed to delete places. Please try again later.",
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces],
  );

  function handelErrorUpdatingPlaces() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleStopRemovePlace}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occured!"
            message={errorUpdatingPlaces.message}
            onConfirm={handelErrorUpdatingPlaces}
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {errorFetchingUserPlaces && (
          <Error
            title="An error occured!"
            message={errorFetchingUserPlaces.message}
            onConfirm={undefined}
          />
        )}
        {!errorFetchingUserPlaces && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
            isLoading={isFecthing}
            loadingText="Loading your places..."
          />
        )}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
