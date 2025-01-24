import React from "react";
import styles from "./PrimaryButton.module.css";

interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className={`${styles["button"]}  text-sm`}>
      {text}
    </button>
  );
};

export default PrimaryButton;
