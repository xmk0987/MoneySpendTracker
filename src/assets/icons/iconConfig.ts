import { CSSProperties } from "react";

export const getIconStyle = (color?: string | null): CSSProperties => ({
  fill: color || "white",
});

export interface IconProps {
  size?: string | number;
  color?: string | null;
}
