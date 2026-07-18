// import Sidebar from "./Sidebar";
import Sidebar from "../sidebar/Sidebar";
import styles from "./RootLayout.module.css";

export default function RootLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}