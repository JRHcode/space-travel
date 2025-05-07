import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  fetchSpacecraftById, 
  destroySpacecraftById, 
  clearCurrentSpacecraft,
  fetchSpacecrafts
} from "../store/spaceTravelSlice";
import { selectPlanetNameById } from "../store/spaceTravelSlice"; 
import Loading from "../components/Loading";
import styles from "./SpacecraftPage.module.css";

function SpacecraftPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentSpacecraft, status, error } = useSelector(
    (state) => state.spaceTravel
  );
  const [initialLoad, setInitialLoad] = useState(true);

  const planetName = useSelector((state) => 
    selectPlanetNameById(state, currentSpacecraft?.currentLocation)
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchSpacecraftById(id)).unwrap();
      } catch (err) {
        console.error("Failed to fetch spacecraft:", err);
      } finally {
        setInitialLoad(false);
      }
    };

    loadData();
    
    return () => {
      dispatch(clearCurrentSpacecraft());
    };
  }, [dispatch, id]);

  const handleDecommission = async () => {
    if (window.confirm("Are you sure you want to decommission this spacecraft?")) {
      try {
        await dispatch(destroySpacecraftById(id)).unwrap();
        
        dispatch(fetchSpacecrafts());
        navigate("/spacecrafts");
      } catch (error) {
        console.error("Decommission failed:", error);
      }
    }
  };


  if (initialLoad) {
    return <Loading message="Loading spacecraft details..." />;
  }

  
  if (status === "failed") {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Spacecraft</h2>
        <p>{error}</p>
        <Link to="/spacecrafts" className={styles.backLink}>
          ← Back to Spacecraft List
        </Link>
      </div>
    );
  }

  
  if (!currentSpacecraft) {
    return (
      <div className={styles.notFound}>
        <h2>Spacecraft Not Found</h2>
        <p>The spacecraft you're looking for doesn't exist or may have been removed.</p>
        <Link to="/spacecrafts" className={styles.backLink}>
          ← Back to Spacecraft List
        </Link>
      </div>
    );
  }

  
  return (
    <div className={styles.spacecraftPage}>
      <div className={styles.header}>
        <h1>{currentSpacecraft.name}</h1>
        <div className={styles.actions}>
          <Link to="/spacecrafts" className={styles.backButton}>
            ← Back to Fleet
          </Link>
          <button 
            onClick={handleDecommission} 
            className={styles.decommissionButton}
          >
            Decommission
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {currentSpacecraft.pictureUrl ? (
            <img 
              src={currentSpacecraft.pictureUrl} 
              alt={currentSpacecraft.name} 
              className={styles.spacecraftImage}
            />
          ) : (
            <div className={styles.placeholderImage}>
              No Image Available
            </div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <h3>Capacity</h3>
            <p>{currentSpacecraft.capacity.toLocaleString()} people</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Current Location</h3>
            <p>{planetName || 'Unknown location'}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Description</h3>
            <p className={styles.description}>{currentSpacecraft.description}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Spacecraft ID</h3>
            <p className={styles.id}>{currentSpacecraft.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpacecraftPage;