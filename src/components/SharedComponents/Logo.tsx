/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC } from "react";
import Image, { StaticImageData } from "next/image";

interface LogoProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  decoding?: "async" | "auto" | "sync" | undefined;
  priority?: boolean;
  style?: any;
}

/**  Global component to render Logo */
const Logo: FC<LogoProps> = ({
  src,
  alt,
  className,
  width,
  height,
  decoding,
  priority,
}) => (
  <>
  <Image
    src={src}
    alt={alt}
    className={className}
    width={width}
    height={height}
    decoding={decoding}
    priority={priority}
  />
  </>
);

export default Logo;