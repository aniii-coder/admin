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

    updateBlog: builder.mutation({
      query: ({ blog_id, blogFormDataPayload }) => ({
        url: `/blogs/update/${blog_id}`, // Matches your backend controller router mapping structure
        method: "PUT",                    // Or "PATCH", depending on how your Express router is configured
        body: blogFormDataPayload,        // The text data fields, files, or FormData instance
      }),
      invalidatesTags: (result, error, { blog_id }) => [
        { type: "Blogs", id: blog_id }, 
        "Blogs"
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateBlogMutation, 
  useUpdateBlogMutation, // Hook exported for your client components
} = blogApi;