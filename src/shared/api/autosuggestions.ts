import axios from "axios";

const DEFAULT_MP_BASE = "https://app.tablecrm.com/api/v1/mp";

const getCoreApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_MP_BASE;
  return baseUrl.replace(/\/mp\/?$/, "");
};

export type AddressValidation = {
  country?: string | null;
  state?: string | null;
  city?: string | null;
  street?: string | null;
  housenumber?: string | null;
  timezone?: string | null;
  postcode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export const fetchAddressSuggestions = async (query: string, limit = 5) => {
  const response = await axios.get(`${getCoreApiBaseUrl()}/autosuggestions/geolocation`, {
    params: { query, limit },
  });
  return (response.data?.suggestions || []) as string[];
};

export const validateAddress = async (address: string) => {
  const response = await axios.get(
    `${getCoreApiBaseUrl()}/autosuggestions/geolocation/validate`,
    { params: { address } },
  );
  return response.data as AddressValidation;
};
