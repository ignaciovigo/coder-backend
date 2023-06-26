import CONSTANTS from "../src/constants/constants.js";

export async function searchProducts({ search, newURL = null }) {
  const URL = newURL || CONSTANTS.PRODUCTS_URL;
  const LatestUrl = (!newURL) ? URL + `?query=${search}` : URL
  try {
    const data = await fetch(LatestUrl, {
      method: "GET",
      credentials: "include",
    });
    const result = await data.json();
    if (result.status !== "success") throw result;
    return result;
  } catch (error) {
    throw {...error}
  }
}
