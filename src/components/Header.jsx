import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          Space Travel
        </Link>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/spacecrafts" className={styles.navLink}>
            Spacecrafts
          </Link>
          <Link to="/planets" className={styles.navLink}>
            Planets
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;