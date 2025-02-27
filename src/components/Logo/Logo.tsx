import React, { FC, JSX } from "react";
import Image from "next/image";
import logoImage from "@/assets/images/logo.png";

interface LogoProps {
  size?: number;
}

/**
 * Logo component renders the application's logo.
 *
 * @param {LogoProps} props - Component props.
 * @returns {JSX.Element} The rendered logo image.
 */
const Logo: FC<LogoProps> = ({ size = 50 }: LogoProps): JSX.Element => {
  return <Image src={logoImage} alt="App Logo" width={size} height={size} />;
};

export default Logo;
