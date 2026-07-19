import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import styles from "./BlogDetail.module.css";
import { useGetSpecificBlogQuery } from "../../api";
import { Eye, MessageCircle, ThumbsUp, View } from "lucide-react";

export default function BlogDetail({ relatedBlogs = [] }) {
  const router = useRouter();
  const { blog_id } = router.query;

  const isLoggedIn = true;

  const {
    data,
    isLoading,
    isError,
  } = useGetSpecificBlogQuery(blog_id, {
    skip: !blog_id,
  });

  const blog = data?.data;

  const [commentText, setCommentText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Process the HTML content once to extract the headings AND get the updated HTML containing the matching IDs
  const parsedContent = useMemo(() => {
    if (!blog?.content) return { toc: [], processedHtml: "" };
    
    // Safely check for window/DOM environments during server-side builds
    if (typeof window === "undefined") {
      return { toc: [], processedHtml: blog.content };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, "text/html");
    const headings = doc.querySelectorAll("h2");
    
    const toc = [...headings].map((heading, index) => {
      // Generate a clean slug string or fallback to index
      const baseId = heading.textContent
        ? heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : "";
      const elementId = baseId || `section-${index}`;
      
      // Mutate the actual in-memory document element node
      heading.id = elementId;
      
      return {
        id: elementId,
        title: heading.textContent || `Section ${index + 1}`,
      };
    });

    return {
      toc,
      // Export out the serialized HTML body which now contains our fresh ID tags!
      processedHtml: doc.body.innerHTML,
    };
  }, [blog?.content]);

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        Loading...
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className={styles.pageContainer}>
        Blog not found.
      </div>
    );
  }

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      router.push({
        pathname: "/dashboard",
        query: {
          search: searchQuery,
        },
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.utilityHeader}>
        <nav className={styles.breadcrumb}>
          <span
            className={styles.crumbLink}
            onClick={() => router.push("/admin/dashboard")}
          >
            Dashboard
          </span>

          <span className={styles.separator}>/</span>

          <span className={styles.crumbLink}             onClick={() => router.push("/admin/blogs")}
>
            Blogs
          </span>

          <span className={styles.separator}>/</span>

          <span className={styles.activePage}>
            {blog.title}
          </span>
        </nav>
      </div>

      <hr className={styles.divider} />

      <div className={styles.articleLayout}>
        <article className={styles.primaryContent}>
          {/* Banner Image */}
          <div className={styles.bannerWrapper}>
            <img
              src={blog.banner || "/api/placeholder/1200/500"}
              alt={blog.title}
              className={styles.bannerImage}
            />
          </div>

          {/* Title & Description */}
          <h1 className={styles.mainTitle}>
            {blog.title}
          </h1>

          <p className={styles.description}>
            {blog.description}
          </p>

          {/* Author Meta Card */}
          <div className={styles.authorCard}>
            <div className={styles.authorAvatar} style={{ backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", color: "#fff" }}>
              B
            </div>

            <div className={styles.authorMeta}>
              <p className={styles.authorName}>
                Publisher ({blog.category || "General"})
              </p>

              <p className={styles.publishDate}>
                Published on{" "}
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                ) : "Recent"}
              </p>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className={styles.engagementMetrics}>
            <span style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <Eye size={20}/> {blog.views || 0} Views
            </span>
            <span style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <ThumbsUp size={20}/> {blog.likes || 0} Likes
            </span>
            <span style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <MessageCircle size={20}/> {typeof blog.comments === "number" ? blog.comments : 0} Comments
            </span>
          </div>

          {/* Tag Cloud */}
          <div className={styles.tags}>
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className={styles.tag}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Rendered HTML Content Body — Now containing matching injected header IDs */}
          <div
            className={styles.richTextBody}
            dangerouslySetInnerHTML={{
              __html: parsedContent.processedHtml,
            }}
          />

          {/* Comments Entry Box */}
          <section className={styles.commentsSection}>
            <h3>
              Discussion ({typeof blog.comments === "number" ? blog.comments : 0})
            </h3>

            {isLoggedIn && (
              <form onSubmit={(e) => e.preventDefault()}>
                <textarea
                  rows={3}
                  className={styles.commentTextArea}
                  placeholder="Join the discussion..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <button
                  type="submit"
                  className={styles.submitCommentBtn}
                >
                  Post Comment
                </button>
              </form>
            )}
          </section>
        </article>

        {/* Sticky Table of Contents Side Panel */}
        <aside className={styles.sidePanel}>
          <div className={styles.stickyCard}>
            <h4 className={styles.tocTitle}>Table of Contents</h4>

            {parsedContent.toc.length > 0 ? (
              <ul className={styles.tocList}>
                {parsedContent.toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyToc}>
                No sections available.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Footer Grid displaying Related Reads */}
      <footer className={styles.relatedSection}>
        <h3 className={styles.sectionHeadingTitle}>
          Related Articles
        </h3>

        <div className={styles.relatedGrid}>
          {relatedBlogs && relatedBlogs.length > 0 ? (
            relatedBlogs
              .filter((bg) => bg._id !== blog._id)
              .slice(0, 3)
              .map((item) => (
                <div
                  key={item._id}
                  className={styles.relatedCard}
                  onClick={() => router.push(`/preview/${item._id}`)}
                >
                  <img
                    src={item.banner || "/api/placeholder/400/250"}
                    alt={item.title}
                    className={styles.relatedImage}
                  />

                  <div className={styles.relatedBody}>
                    <h4>{item.title}</h4>
                    <p>
                      {item.description?.length > 120
                        ? item.description.slice(0, 120) + "..."
                        : item.description}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className={styles.noRelated}>
              No related blogs found.
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}