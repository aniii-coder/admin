import React, { useState } from "react";
import styles from "./BlogList.module.css";
import { useGetAllBlogsQuery } from "../../api";

export default function BlogList() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const uniqueCategories = ["All", "Tech", "Lifestyle", "Business", "Design"];

  const { data, error, isLoading, isFetching } = useGetAllBlogsQuery({
    search: activeSearch,
    limit,
    offset,
    sort: sortOrder,
    category: selectedCategory,
  });

  const blogsData = data?.data || [];
  const totalItems = data?.pagination?.total || 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput);
      setOffset(0);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Admin Blog Controller</h1>
          <p className={styles.pageSubtitle}>Manage, filter, and monitor all corporate articles.</p>
        </div>
      </header>

      {/* Control Utility bar */}
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
                setOffset(0); // Reset page context on category pivot
              }}
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
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

      {/* Main Core Cards Presentation Stack */}
      <main className={styles.cardsStack}>
        {isLoading ? (
          <div className={styles.loading}>Loading structural payload from database...</div>
        ) : error ? (
          <div className={styles.error}>Error fetching blogs. Please try again.</div>
        ) : blogsData.length > 0 ? (
          <div className={isFetching ? styles.fetchingOverlay : ""}>
            {blogsData.map((blog) => (
              <div key={blog._id} className={styles.adminCard}>
                <img
                  src={blog.thumbnail || "/api/placeholder/150/100"}
                  alt={blog.title}
                  className={styles.cardThumbnail}
                />
                <div className={styles.cardBody}>
                  <div className={styles.cardHeaderRow}>
                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                    <span className={styles.categoryBadge}>{blog.category}</span>
                  </div>
                  <p className={styles.blogDescription}>{blog.description}</p>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.metaItem}>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className={styles.metaItem}>👁️ {(blog.views || 0).toLocaleString()} views</span>
                    <span className={styles.metaItem}>👍 {(blog.likes || 0).toLocaleString()} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>No articles match your criteria.</div>
        )}
      </main>

      {/* Pagination Controller Layout Toolbar */}
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
            disabled={currentPage === 1 || isLoading || isFetching}
            onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageIndicator}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            disabled={currentPage === totalPages || isLoading || isFetching}
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
