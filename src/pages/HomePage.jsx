import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

function HomePage() {
  return (
    <div className={styles.homePage}>
      <div className={styles.heroSection}>
        <h1>Welcome to Space Travel</h1>
        <p>Traverse the solar system with ease.</p>
      </div>
      
      <div className={styles.features}>
        <h2>Features</h2>
        <div className={styles.featureCards}>
          <div className={styles.card}>
            <h3>Spacecraft Fleet</h3>
            <p>View and manage all spacecraft in our fleet</p>
            <Link to="/spacecrafts" className={styles.link}>
              View Spacecrafts →
            </Link>
          </div>
          
          <div className={styles.card}>
            <h3>Planet Library</h3>
            <p>Explore planets and manage spacecraft locations</p>
            <Link to="/planets" className={styles.link}>
              View Planets →
            </Link>
          </div>
          
          <div className={styles.card}>
            <h3>Build New Spacecraft</h3>
            <p>Construct new vessels to expand our fleet</p>
            <Link to="/spacecrafts/build" className={styles.link}>
              Build Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;