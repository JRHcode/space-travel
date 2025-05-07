import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlanets, fetchSpacecrafts, sendSpacecraftToPlanet } from "../store/spaceTravelSlice";
import Loading from "../components/Loading";
import styles from "./PlanetsPage.module.css";
import { useLocation } from "react-router-dom";

function PlanetsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { planets, spacecrafts, status, error } = useSelector(
    (state) => state.spaceTravel
  );
  const [selectedSpacecraft, setSelectedSpacecraft] = useState(null);
  const [targetPlanet, setTargetPlanet] = useState(null);
  const [dispatchStatus, setDispatchStatus] = useState("idle");

  // Check for success messages from navigation state
  useEffect(() => {
    if (location.state?.success) {
      alert(location.state.success);
      // Clear the state to prevent showing again on refresh
      window.history.replaceState({}, '');
    }
  }, [location]);

  // Optimized data fetching - only fetch if data is empty
  useEffect(() => {
    if (planets.length === 0 || spacecrafts.length === 0) {
      dispatch(fetchPlanets());
      dispatch(fetchSpacecrafts());
    }
  }, [dispatch, planets.length, spacecrafts.length]);

  const handleDispatch = async () => {
    if (!selectedSpacecraft || !targetPlanet) return;
    
    setDispatchStatus("loading");
    try {
      await dispatch(
        sendSpacecraftToPlanet({
          spacecraftId: selectedSpacecraft.id,
          targetPlanetId: targetPlanet.id
        })
      ).unwrap();
      
      // Refresh data
      await Promise.all([
        dispatch(fetchSpacecrafts()),
        dispatch(fetchPlanets())
      ]);
      
      setSelectedSpacecraft(null);
      setTargetPlanet(null);
      setDispatchStatus("succeeded");
      
      // Show success message
      alert(`Successfully dispatched ${selectedSpacecraft.name} to ${targetPlanet.name}`);
    } catch (error) {
      console.error("Dispatch failed:", error);
      setDispatchStatus("failed");
      alert("Dispatch failed. Please try again.");
    }
  };

  if (status === "loading" && (planets.length === 0 || spacecrafts.length === 0)) {
    return <Loading message="Loading planetary data..." />;
  }

  if (status === "failed") {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.planetsPage}>
      <h1>Planetary Network</h1>
      
      <div className={styles.planetsGrid}>
        {planets.map((planet) => (
          <div key={planet.id} className={styles.planetCard}>
            <div className={styles.planetHeader}>
              <h2>{planet.name}</h2>
              <p>Population: {planet.currentPopulation.toLocaleString()}</p>
            </div>
            
            {planet.pictureUrl && (
              <img 
                src={planet.pictureUrl} 
                alt={planet.name} 
                className={styles.planetImage}
              />
            )}

            <div className={styles.stationedSpacecrafts}>
              <h3>Stationed Spacecrafts</h3>
              {spacecrafts.length === 0 ? (
                <div className={styles.noSpacecrafts}>No spacecrafts stationed</div>
              ) : (
                spacecrafts
                  .filter((sc) => sc.currentLocation === planet.id)
                  .map((spacecraft) => (
                    <div 
                      key={spacecraft.id} 
                      className={`${styles.spacecraftItem} ${
                        selectedSpacecraft?.id === spacecraft.id ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedSpacecraft(spacecraft)}
                    >
                      {spacecraft.name} (Cap: {spacecraft.capacity.toLocaleString()})
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSpacecraft && (
        <div className={styles.dispatchPanel}>
          <h2>Dispatch Spacecraft</h2>
          <div className={styles.selectedSpacecraft}>
            Selected: <strong>{selectedSpacecraft.name}</strong>
          </div>
          
          // In the targetSelection section, update the select element:
        <div className={styles.targetSelection}>
          <label>Select Destination Planet:</label>
          <select
            value={targetPlanet?.id ?? ""}
    onChange={(e) => {
      const selectedId = parseInt(e.target.value);
      const planet = planets.find(p => p.id === selectedId);
      setTargetPlanet(planet);
    }}
            className={styles.planetSelect}
          >
            <option value="">-- Select Planet --</option>
            {planets
              .filter(planet => planet.id !== selectedSpacecraft.currentLocation)
              .map((planet) => (
                <option 
                  key={planet.id} 
                  value={planet.id}
                >
                  {planet.name}
                </option>
              ))}
          </select>
        </div>

          <button
            onClick={handleDispatch}
            disabled={!targetPlanet || dispatchStatus === "loading"}
            className={styles.dispatchButton}
          >
            {dispatchStatus === "loading" ? "Dispatching..." : "Dispatch Spacecraft"}
          </button>

          {dispatchStatus === "failed" && (
            <div className={styles.dispatchError}>
              Failed to dispatch spacecraft. Please try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlanetsPage;