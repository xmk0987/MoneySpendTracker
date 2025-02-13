import { IconProps, getIconStyle } from "./iconConfig";

const ArrowUp: React.FC<IconProps> = ({ size = "20px", color = null }) => {
  const style = getIconStyle(color);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      style={style}
    >
      <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
    </svg>
  );
};
export default ArrowUp;
