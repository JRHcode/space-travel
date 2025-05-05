import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSpacecrafts } from "../store/spaceTravelSlice";
import Loading from "../components/Loading";
import styles from "./SpacecraftsPage.module.css";

function SpacecraftsPage() {
  const dispatch = useDispatch();
  const { spacecrafts, status, error } = useSelector(
    (state) => {
      console.log("Current Redux state:", state.spaceTravel); // Debug log
      return state.spaceTravel;
    }
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSpacecrafts());
    }
  }, [dispatch, status]);

  console.log("Rendering with spacecrafts:", spacecrafts); // Debug log

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!spacecrafts || spacecrafts.length === 0) {
    return (
      <div className={styles.noSpacecrafts}>
        <h2>No Spacecrafts Found</h2>
        <Link to="/spacecrafts/build" className={styles.buildButton}>
          + Build Your First Spacecraft
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.spacecraftsPage}>
      <div className={styles.header}>
        <h1>Spacecraft Fleet</h1>
        <Link to="/spacecrafts/build" className={styles.buildButton}>
          + Build New Spacecraft
        </Link>
      </div>

      <div className={styles.spacecraftList}>
        {spacecrafts.map((spacecraft) => (
          <div key={spacecraft.id} className={styles.spacecraftCard}>
            <div className={styles.cardContent}>
              <h2>{spacecraft.name}</h2>
              <p>
                <strong>Capacity:</strong> {spacecraft.capacity.toLocaleString()}
              </p>
              <p className={styles.description}>
                {spacecraft.description.substring(0, 100)}...
              </p>
            </div>
            <div className={styles.cardActions}>
              <Link
                to={`/spacecrafts/${spacecraft.id}`}
                className={styles.detailsButton}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default SpacecraftsPage;