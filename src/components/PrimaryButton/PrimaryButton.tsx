import React from "react";

interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className={`button text-sm`}>
      {text}
    </button>
  );
};

export default PrimaryButton;
