import { DataProvider } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";

if (!BACKEND_BASE_URL) {
  throw new Error("BACKEND_BASE_URL is not defined");
}

console.log('🌐 Backend Base URL:', BACKEND_BASE_URL);

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const page = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;

    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });

    // Add filters
    filters?.forEach((filter) => {
      if ('field' in filter && 'value' in filter) {
        params.append(filter.field, String(filter.value));
      }
    });

    const url = `${BACKEND_BASE_URL}/${resource}?${params.toString()}`;
    console.log('📍 Fetching:', url);

    const response = await fetch(url);
    const json = await response.json();
    
    console.log('📦 Backend response:', json);
    console.log('📊 Data array:', json.data);
    console.log('📈 Data length:', json.data?.length);

    return {
      data: json.data || [],
      total: json.pagination?.total || json.data?.length || 0,
    };
  },

  getOne: async ({ resource, id }) => {
    const response = await fetch(`${BACKEND_BASE_URL}/${resource}/${id}`);
    const json = await response.json();
    return { data: json.data };
  },

  create: async ({ resource, variables }) => {
    const response = await fetch(`${BACKEND_BASE_URL}/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    });
    const json = await response.json();
    return { data: json.data };
  },

  update: async ({ resource, id, variables }) => {
    const response = await fetch(`${BACKEND_BASE_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    });
    const json = await response.json();
    return { data: json.data };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await fetch(`${BACKEND_BASE_URL}/${resource}/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    return { data: json.data };
  },

  getApiUrl: () => BACKEND_BASE_URL,
};
