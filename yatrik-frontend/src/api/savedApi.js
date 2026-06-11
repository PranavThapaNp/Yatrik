import API from "./axios";

// get saved trips
export const getSavedTrips = () => {
  return API.get("/saved/");
};

// remove saved trip
export const removeSavedTrip = (destinationId) => {
  return API.delete(`/saved/${destinationId}`);
};