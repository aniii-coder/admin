import React, { useState } from "react";
import { useRouter } from "next/router";
import CustomDataTable from "@/common-components/custom-data-table/CustomDataTable";
import { getTableConfig } from "@/common-components/custom-data-table/utils";
import { useGetAllLinkedUserQuery } from "./api";
import styles from "./Users.module.css";

const User = () => {
  const router = useRouter();

  // --- Layout & Filter States ---
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // --- API Fetching ---
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllLinkedUserQuery({
    search: searchQuery,
    limit,
    page,
    category,
    sort: sortBy,
  });

  const tableConfig = getTableConfig(router.pathname, router);

  // --- Event Handlers ---
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      setSearchQuery(searchInput);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className={styles.container}>
      
      {/* Control Header Strip */}
      <div className={styles.filterToolbar}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search blogs and press Enter..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.dropdownGroup}>
          <select value={category} onChange={handleCategoryChange} className={styles.selectFilter}>
            <option value="">All Categories</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="updates">Product Updates</option>
          </select>

          <select value={sortBy} onChange={handleSortChange} className={styles.selectFilter}>
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
            <option value="alphabetical">A - Z (Alphabetical)</option>
          </select>

          <select value={limit} onChange={handleLimitChange} className={styles.selectFilter}>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={30}>30 per page</option>
            <option value={40}>40 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContentArea}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading management logs...</p>
          </div>
        ) : isError ? (
          <div className={styles.errorState}>
            {error?.data?.message || "Failed to load management table content."}
          </div>
        ) : (
          <>
            <div className={isFetching ? styles.tableOpaque : ""}>
              <CustomDataTable
                config={tableConfig}
                data={data?.data || []}
                emptyMessage="No items found matching the selected parameters."
              />
            </div>

            {data?.totalPages > 1 && (
              <div className={styles.paginationFooter}>
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>Page <strong>{page}</strong> of {data?.totalPages}</span>
                <button 
                  disabled={page === data?.totalPages} 
                  onClick={() => setPage(prev => prev + 1)}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default User;