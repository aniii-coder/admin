import React, { useEffect, useState } from "react";
import {
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Heart,
  MessageSquare,
  Bookmark,
  ShieldCheck,
} from "lucide-react";
import styles from "./UserDetail.module.css";
import { useRouter } from "next/router";
import { useGetSpecificUserDataQuery } from "../../api";
import CustomDataTable from "@/common-components/custom-data-table/CustomDataTable";
import { getBlogTableConfig } from "../../utils";

// Component receives the single user object as a prop
export default function UserDetail() {
    
    const router = useRouter();
    const { user_id: id } = router.query;
    const tableConfig = getBlogTableConfig(router);
    const [user, setUser] = useState(null);
    
    const { data, isLoading, isError, isSuccess } = useGetSpecificUserDataQuery(
        id,
        {
      skip: !id, // prevents request until id is available
    },
  );
  
  useEffect(() => {
    if (!data) return;
    if (data?.data && isSuccess) {
      setUser(data?.data);
    }
}, [data]);

console.log("data :>> ", data, router);

// Formatting date helpers
const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
};

if (!user) return <div className={styles.noData}>No user profiles found.</div>;
  return (
    <div className={styles.detailContainer}>
      
      {/* 1. TOP HEADER HERO BANNER */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <img 
            src={user.avatar || 'https://via.placeholder.com/150'} 
            alt={user.name} 
            className={styles.avatarImage}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
          />
          <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`} />
        </div>

        <div className={styles.identityGroup}>
          <h1 className={styles.userName}>{user.name}</h1>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <Mail size={15} /> {user.email}
            </span>
            <span className={styles.providerBadge}>
              {user.loginProvider || 'credentials'}
            </span>
            {user.emailVerified ? (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} /> Verified
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <FileText size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{user.blogIds?.length || 0}</span>
            <span className={styles.statLabel}>Blogs Published</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.red}`}>
            <Heart size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{user.likedBlogs?.length || 0}</span>
            <span className={styles.statLabel}>Liked Blogs</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <MessageSquare size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{user.commentedBlogs?.length || 0}</span>
            <span className={styles.statLabel}>Comments Left</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.amber}`}>
            <Bookmark size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{user.savedBlogs?.length || 0}</span>
            <span className={styles.statLabel}>Saved Items</span>
          </div>
        </div>
      </div>

      <div className={styles.metaCard}>
        <h3 className={styles.sectionTitle}>System Metadata</h3>
        <div className={styles.metaGrid}>
          <div className={styles.metaBox}>
            <Clock size={16} />
            <div>
              <p className={styles.boxLabel}>Last Session Active</p>
              <p className={styles.boxValue}>{formatDate(user.lastLogin)}</p>
            </div>
          </div>
          <div className={styles.metaBox}>
            <Calendar size={16} />
            <div>
              <p className={styles.boxLabel}>Account Created At</p>
              <p className={styles.boxValue}>{formatDate(user.createdAt)}</p>
            </div>
          </div>
          <div className={styles.metaBox}>
            <Calendar size={16} />
            <div>
              <p className={styles.boxLabel}>Profile Database Key</p>
              <p className={styles.boxValueCode}>{user._id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CHOSEN DATATABLE SLOT PLACEHOLDER */}
     <CustomDataTable 
     config={tableConfig}
     data={user?.blogIds}
     />

    </div>
  );
}
