import { api } from "@api/config";

export const createAirport =async (airportBody) => {
  try {
    const { data } = await api.post("/airport", airportBody);
    return data.response;
  } catch (error) {
    throw new Error("error");
  }
};
