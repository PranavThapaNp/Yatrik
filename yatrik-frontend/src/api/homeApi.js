import API from "./axios";

export const searchDestinations = (search = "", type = "") => {
  return API.get("/destinations/", {
    params: {
      search,
      destination_type: type,
    },
  });
};

export const getPopularDestinations = () => {
  return API.get("/destinations/popular");
};