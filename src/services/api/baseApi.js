import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${process.env.BACKEND_URL}`,
    credentials: "include"
  }),
  tagTypes: ['Post'], 
  endpoints: () => ({}), 
});