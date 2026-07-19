import { baseApi } from "@/services/api/baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   

    createBlog: builder.mutation({
      query: (blogFormDataPayload) => ({
        url: "/blogs/create", 
        method: "POST",
        body: blogFormDataPayload, 
      }),
      invalidatesTags: ["Blogs"], 
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateBlogMutation, 
} = blogApi;