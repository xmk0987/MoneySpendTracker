import { IconProps, getIconStyle } from "./iconConfig";

const ArrowDown: React.FC<IconProps> = ({ size = "20px", color = null }) => {
  const style = getIconStyle(color);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      style={style}
    >
      <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
    </svg>
  );
};
export default ArrowDown;
