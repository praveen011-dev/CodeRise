import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", //smooth animation
    });
  }, [pathname]); // This effect runs whenever the 'pathname' (URL path) changes

  return null;
}

export default ScrollToTop;
