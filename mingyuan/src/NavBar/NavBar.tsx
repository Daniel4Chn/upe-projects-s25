import { useState } from "react";
import styles from "./NavBar.module.css";

interface NavBarProps {
  scrollToAbout: () => void;
}

function NavBar({ scrollToAbout }: NavBarProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  return (
    <nav className={styles.navbar}>
      {/* <img className={styles["navbar-logo"]} src={logo} alt="Logo" /> */}
      <h1 className={styles["navbar-brand"]}>Ming Yuan</h1>
      <button
        about="Nav menu tray"
        className={styles.hamburger}
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        {/* icon from heroicons.com */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={
          isNavExpanded
            ? `${styles["nav-menu"]} ${styles["expanded"]}`
            : styles["nav-menu"]
        }
      >
        <ul>
          <li onClick={scrollToAbout}>Webpage</li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
