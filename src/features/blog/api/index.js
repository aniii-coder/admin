import { baseApi } from "@/services/api/baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecificBlog: builder.query({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
    }),

    getAllBlogs: builder.query({
      query: (params = {}) => {
        const cleanParams = {};
        
        if (params.search?.trim()) cleanParams.search = params.search;
        if (params.limit) cleanParams.limit = params.limit;
        if (params.offset !== undefined) cleanParams.offset = params.offset;
        if (params.sort) cleanParams.sort = params.sort;
        if (params.category && params.category !== "All") cleanParams.category = params.category;

        return {
          url: "/blogs/getAll",
          method: "GET",
          params: cleanParams,
        };
      },
      keepUnusedDataFor: 300, 
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSpecificBlogQuery,
  useGetAllBlogsQuery,
} = blogApi;