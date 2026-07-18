import { baseApi } from "@/services/api/baseApi";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLinkedUser: builder.query({
      query: () => ({
        url: "/client/getAll",
        method: "GET",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllLinkedUserQuery,
  useLazyGetAllLinkedUserQuery,
} = clientApi;