import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchSpacecraftById, destroySpacecraftById, clearCurrentSpacecraft } from "../store/spaceTravelSlice";
import Loading from "../components/Loading";
import { selectPlanetNameById } from "../store/spaceTravelSlice"; 
import { useRouteError } from 'react-router-dom';
import styles from "./SpacecraftPage.module.css"; 

function SpacecraftPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentSpacecraft, status, error } = useSelector(
    (state) => state.spaceTravel
  );

  const planetName = useSelector((state) => 
    selectPlanetNameById(state, currentSpacecraft?.currentLocation)
  );

  useEffect(() => {
    dispatch(fetchSpacecraftById(id));
    
    return () => {
      dispatch(clearCurrentSpacecraft());
    };
  }, [dispatch, id]);

  const handleDecommission = async () => {
    if (window.confirm("Are you sure you want to decommission this spacecraft?")) {
      await dispatch(destroySpacecraftById(id));
      navigate("/spacecrafts");
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!currentSpacecraft) {
    return <div className={styles.notFound}>Spacecraft not found. Please choose another.</div>;
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
            <p>{planetName || 'Loading...'}</p>
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