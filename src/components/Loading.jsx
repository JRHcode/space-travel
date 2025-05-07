import styles from "./Loading.module.css";

function Loading({ message = "Warp speed engaged..." }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default Loading;