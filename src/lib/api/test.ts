import client from "./client";

export const getTest = () => {
  return client.get(`/api/test`);
}
