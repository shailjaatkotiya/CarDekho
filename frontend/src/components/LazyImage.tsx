import { useState } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800";

type LazyImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  /** Target render width — rewrites the CarDekho CDN transform to cut payload. */
  width?: number;
  /** Eager-load above-the-fold hero images for a faster LCP. */
  eager?: boolean;
  fallback?: string;
};

/** Resize CarDekho/aepl CDN images to the width actually rendered. The CDN
 * accepts a `?tr=w-<px>` transform; requesting w-400 for a card thumbnail
 * instead of the stored w-664 roughly halves the bytes downloaded. */
const optimize = (src: string, width?: number): string => {
  if (!width || !/aeplcdn\.com|cardekho\.com/.test(src)) return src;
  if (/[?&]tr=w-\d+/.test(src)) return src.replace(/(tr=w-)\d+/, `$1${width}`);
  return `${src}${src.includes("?") ? "&" : "?"}tr=w-${width}`;
};

export const LazyImage = ({
  src,
  alt,
  className = "",
  width,
  eager = false,
  fallback = FALLBACK
}: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const resolved = errored || !src ? fallback : optimize(src, width);

  return (
    <img
      src={resolved}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      className={`${className} bg-slate-100 transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};
