import React from "react";
import styles from "./InfoBox.module.css";

interface InfoBoxProps {
  header: string;
  value: number | string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ header, value }) => {
  return (
    <div className={styles["infoBox"]}>
      <p>{header}</p>
      <p>{value}</p>
    </div>
  );
};

export default InfoBox;
