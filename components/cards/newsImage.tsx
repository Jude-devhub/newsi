"use client";

import Image from "next/image";
import { useState } from "react";

interface NewsImageProps {
  src?: string;
  alt?: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function NewsImage({
  src,
  alt = "News Image",
  fill = false,
  sizes = "100vw",
  className = "object-cover",
  width,
  height,
}: NewsImageProps) {
  const [imgSrc, setImgSrc] = useState(src || "/alternativeNewsImage.png");

  const handleError = () => {
    setImgSrc("/alternativeNewsImage.png");
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      sizes={sizes}
      onError={handleError}
    />
  );
}
