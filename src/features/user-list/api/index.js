import { baseApi } from "@/services/api/baseApi";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLinkedUser: builder.query({
      query: () => ({
        url: "/client/getAll",
        method: "GET",
      }),
    }),
    getSpecificUserData: builder.query({
  query: (id) => ({
    url: `/client/${id}`,
    method: "GET",
  }),
}),
  }),
  

  overrideExisting: false,
});

export const {
  useGetAllLinkedUserQuery,
  useLazyGetAllLinkedUserQuery,
    useGetSpecificUserDataQuery,

} = clientApi;