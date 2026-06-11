import API from "./axios";

export const getDestinations = (search = "", type = "") => {
  return API.get("/destinations/", {
    params: {
      search,
      destination_type: type,
    },
  });
};

export const getDestinationDetail = (slug) => {
  return API.get(`/destinations/${slug}`);
};