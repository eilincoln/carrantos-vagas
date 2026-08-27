import styles from "./JobSkeleton.module.css";

export function JobSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          className={styles.shimmer}
          style={{ width: "30%", height: "20px" }}
        />
        <div
          className={styles.shimmer}
          style={{ width: "20%", height: "20px" }}
        />
      </div>
      <div
        className={styles.shimmer}
        style={{ width: "70%", height: "28px", marginTop: "0.5rem" }}
      />
      <div
        className={styles.shimmer}
        style={{ width: "40%", height: "22px" }}
      />
      <div
        className={styles.shimmer}
        style={{ width: "100%", height: "40px", marginTop: "1rem" }}
      />
    </div>
  );
}
