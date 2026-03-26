// // src/components/ScrollToTop.jsx (Recommended file location/name)

// import { useEffect, useLayoutEffect } from "react";
// import { useLocation } from "react-router-dom";

// /**
//  * A component that forces the window to scroll to the top
//  * whenever the route changes.
//  */   
// const ScrollToTop = () => {

//   // 1. Get the current location object from React Router
//   const { pathname } = useLocation();

//   // 2. Use useLayoutEffect to perform the scroll *before* the browser paints.
//   // This ensures the page is at the top immediately upon navigation.
//   useLayoutEffect(() => {
//     // Check if the current path is '/profile' or '/client-profile' or any other routes you want to exclude from scrolling to the top
//     if (pathname !== '/profile' && pathname !== '/client-profile') {
//       window.scrollTo(0, 0); // Scroll to top for other routes
//     }
//   }, [pathname]); // Re-run this effect every time the 'pathname' (route) changes.

//   // This component doesn't render any visible elements
//   return null; 
// };

// export default ScrollToTop;