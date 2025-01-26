import React from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles["loadingContainer"]}>
      <p>Loading ... </p>
    </div>
  );
};

export default Loader;
