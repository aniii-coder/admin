import Link from "next/link";
import { useRouter } from "next/router";
// import sidebarConfig from "./sidebarConfig";
import styles from "./Sidebar.module.css";
import sidebarConfig from "./utils";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        Blog CMS
      </div>

      <nav className={styles.nav}>
        {sidebarConfig.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.href}
              className={`${styles.item} ${
                router.pathname === item.href
                  ? styles.active
                  : ""
              }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}