import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchSpacecrafts } from "../store/spaceTravelSlice";
import Loading from "../components/Loading";
import styles from "./SpacecraftsPage.module.css";


function SpacecraftsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { spacecrafts, status, error } = useSelector(
    (state) => state.spaceTravel
  );
  
  // Check for success messages from navigation state
  useEffect(() => {
    if (location.state?.success) {
      alert(location.state.success);
      // Clear the state to prevent showing again on refresh
      window.history.replaceState({}, '');
    }
  }, [location]);

  // Fetch spacecrafts if not already loaded
  useEffect(() => {
    if (spacecrafts.length === 0 && status === 'idle') {
      dispatch(fetchSpacecrafts());
    }
  }, [dispatch, spacecrafts.length, status]);

  if (status === "loading" && spacecrafts.length === 0) {
    return <Loading message="Loading spacecraft fleet..." />;
  }

  if (status === "failed") {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.spacecraftsPage}>
      <div className={styles.header}>
        <h1>Spacecraft Fleet</h1>
        <Link to="/spacecrafts/build" className={styles.buildButton}>
          + Build New Spacecraft
        </Link>
      </div>

      {spacecrafts.length === 0 ? (
        <div className={styles.noResults}>
          <img 
            src="/empty-hangar.svg" 
            alt="Empty hangar" 
            className={styles.emptyImage}
          />
          <h3>Your fleet is empty</h3>
          <Link to="/spacecrafts/build" className={styles.buildButton}>
            Build your first spacecraft
          </Link>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default SpacecraftsPage;