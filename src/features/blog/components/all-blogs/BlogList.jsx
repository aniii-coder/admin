import React, { useState } from "react";
import styles from "./BlogList.module.css";
import { useGetAllBlogsQuery, useDeleteBlogMutation } from "../../api";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux"; // ✨ Redux hook import kiya
// import { successToast, errorToast } from "@/store/slices/uiSlice"; // ✨ Apne project ke correct path se replace karein

import { 
  FileText, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  MoreVertical,
  Calendar
} from "lucide-react";
import { errorToast, successToast } from "@/services/slices/toastSlice";

export default function BlogList() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState(null); 
  const [sortOrder, setSortOrder] = useState("newest");
  const router = useRouter();
  const dispatch = useDispatch(); // ✨ Redux dispatch hook initialized
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const uniqueCategories = ["All", "Tech", "Lifestyle", "Business", "Design"];

  const { data, error, isLoading, isFetching, refetch } = useGetAllBlogsQuery({
    search: activeSearch,
    limit,
    offset,
    sort: sortOrder,
    category: selectedCategory,
  });

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const blogsData = data?.blogs || [];
  const blogAnalytics = data?.analytics || {}; 
  const totalItems = data?.pagination?.total || 0;

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput);
      setOffset(0);
    }
  };

  // ✨ Cleaned dynamic delete management via Redux Toast actions
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setActiveMenuId(null); 

    try {
      const response = await deleteBlog(id).unwrap();
      
      dispatch(successToast({ 
        message: response?.message || "Blog deleted successfully!" 
      }));
      
      refetch(); 
    } catch (err) {
      console.error("Mutation Submission Failure:", err);
      
      dispatch(errorToast({ 
        message: err?.data?.message || err?.message || "Failed to delete the blog." 
      }));
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Admin Blog Controller</h1>
          <p className={styles.pageSubtitle}>
            Manage, filter, and monitor all corporate articles.
          </p>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => router.push("/admin/blogs/create")}
        >
          + Create New Blog
        </button>
      </header>

      <section className={styles.analyticsSection}>
        <div className={styles.analyticsCard}>
          <div className={`${styles.analyticsIcon} ${styles.iconDefault}`}>
            <FileText size={20} />
          </div>
          <div className={styles.analyticsDetails}>
            <span className={styles.analyticsLabel}>Total Blogs</span>
            <h2 className={styles.analyticsValue}>
              {(blogAnalytics.totalBlogs || 0).toLocaleString()}
            </h2>
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={`${styles.analyticsIcon} ${styles.iconDefault}`}>
            <Eye size={20} />
          </div>
          <div className={styles.analyticsDetails}>
            <span className={styles.analyticsLabel}>Total Views</span>
            <h2 className={styles.analyticsValue}>
              {(blogAnalytics.totalViews || 0).toLocaleString()}
            </h2>
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={`${styles.analyticsIcon} ${styles.iconDefault}`}>
            <ThumbsUp size={20} />
          </div>
          <div className={styles.analyticsDetails}>
            <span className={styles.analyticsLabel}>Total Likes</span>
            <h2 className={styles.analyticsValue}>
              {(blogAnalytics.totalLikes || 0).toLocaleString()}
            </h2>
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={`${styles.analyticsIcon} ${styles.iconDefault}`}>
            <MessageSquare size={20} />
          </div>
          <div className={styles.analyticsDetails}>
            <span className={styles.analyticsLabel}>Comments</span>
            <h2 className={styles.analyticsValue}>
              {(blogAnalytics.totalComments || 0).toLocaleString()}
            </h2>
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={`${styles.analyticsIcon} ${styles.iconSuccess}`}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.analyticsDetails}>
            <span className={styles.analyticsLabel}>Published</span>
            <h2 className={styles.analyticsValue}>
              {(blogAnalytics.publishedBlogs || 0).toLocaleString()}
            </h2>
          </div>
        </div>
      </section>

      <section className={styles.filterSection}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Type query and press Enter to search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {activeSearch && (
            <button
              className={styles.clearSearch}
              onClick={() => {
                setSearchInput("");
                setActiveSearch("");
                setOffset(0);
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.actionsGroup}>
          <div className={styles.selectWrapper}>
            <label className={styles.fieldLabel}>Category</label>
            <select
              value={selectedCategory}
              className={styles.selectControl}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setOffset(0); 
              }}
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectWrapper}>
            <label className={styles.fieldLabel}>Sort By</label>
            <select
              value={sortOrder}
              className={styles.selectControl}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
              <option value="az">Alphabetical (A-Z)</option>
              <option value="za">Alphabetical (Z-A)</option>
            </select>
          </div>
        </div>
      </section>

      <main className={styles.cardsStack}>
        {isLoading ? (
          <div className={styles.loading}>
            Loading structural payload from database...
          </div>
        ) : error ? (
          <div className={styles.error}>
            Error fetching blogs. Please try again.
          </div>
        ) : blogsData.length > 0 ? (
          <div className={isFetching || isDeleting ? styles.fetchingOverlay : ""}>
            {blogsData.map((blog) => (
              <div key={blog._id} className={styles.adminCard}>
                <div className={styles.menuContainer}>
                  <button
                    className={styles.dotsBtn}
                    onClick={() => toggleMenu(blog._id)}
                    disabled={isDeleting}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {activeMenuId === blog._id && (
                    <div className={styles.dropdownMenu}>
                      <button
                        onClick={() => {
                          const url = `${process.env.FRONTEND_URL}/dashboard/blog/${blog._id}?previewMode=true`;
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin/blogs/${blog._id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteText}
                        onClick={() => handleDelete(blog._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                <div className={styles.cardHeader}>
                  <img
                    src={blog.thumbnail || "/api/placeholder/150/100"}
                    alt={blog.title}
                    className={styles.cardThumbnail}
                  />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeaderRow}>
                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                    <span className={styles.categoryBadge}>
                      {blog.category}
                    </span>
                  </div>
                  <p className={styles.blogDescription}>{blog.description}</p>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.metaItem}>
                      <Calendar size={14} className={styles.metaIcon} /> 
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className={styles.metaItem}>
                      <Eye size={14} className={styles.metaIcon} /> 
                      {(blog.views || 0).toLocaleString()} views
                    </span>
                    <span className={styles.metaItem}>
                      <ThumbsUp size={14} className={styles.metaIcon} /> 
                      {(blog.likesCount || 0).toLocaleString()} likes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            No articles match your criteria.
          </div>
        )}
      </main>

      <footer className={styles.paginationToolbar}>
        <div className={styles.perPageSelector}>
          <span className={styles.toolbarText}>View</span>
          <select
            value={limit}
            className={styles.pageSizeSelect}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setOffset(0);
            }}
          >
            <option value={10}>10 items</option>
            <option value={20}>20 items</option>
            <option value={30}>30 items</option>
          </select>
          <span className={styles.toolbarText}>per page</span>
        </div>

        <div className={styles.navigationControls}>
          <button
            disabled={currentPage === 1 || isLoading || isFetching || isDeleting}
            onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageIndicator}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            disabled={currentPage === totalPages || isLoading || isFetching || isDeleting}
            onClick={() => setOffset((prev) => prev + limit)}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}