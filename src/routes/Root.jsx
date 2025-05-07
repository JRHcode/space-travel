import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import styles from "./Root.module.css";

function Root() {
  return (
    <div className={styles.rootContainer}>
      <Header />
      <Outlet />
    </div>
  );
}

export default Root;