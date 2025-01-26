import React from "react";
import styles from "./InfoBox.module.css";

interface InfoBoxProps {
  header: string;
  value: number | string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ header, value }) => {
  return (
    <div className={styles["infoBox"]}>
      <p className="text-2l">{header}</p>
      <p className="text-xl">{value}</p>
    </div>
  );
};

export default InfoBox;
