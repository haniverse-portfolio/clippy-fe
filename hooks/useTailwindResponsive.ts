import { useEffect, useState } from "react";
import { useWindowDimensions } from "./useWindowDimensions";

export const useTailwindResponsive = () => {
  const [is2xl, setIs2xl] = useState(false);
  const [isXl, setIsXl] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const [isSm, setIsSm] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width) {
      setIs2xl(false);
      setIsXl(false);
      setIsLg(false);
      setIsMd(false);
      setIsSm(false);

      if (width > 1536) {
        setIs2xl(true);
      } else if (width > 1280) {
        setIsXl(true);
      } else if (width > 1024) {
        setIsLg(true);
      } else if (width > 768) {
        setIsMd(true);
      } else {
        setIsSm(true);
      }
    }
  }, [width]);

  return { isSm, isMd, isLg, isXl, is2xl };
};
