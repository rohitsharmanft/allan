import "./index.css";
import "./App.css";
import RoutesComponent from "./RoutesComponents";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { validateToken } from "./utils/authentication/validateToken";
import { ToastContainer } from "react-toastify";
import { AppProvider } from "./contexts/AppContexts";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ScreenLock from "./Components/ScreenLock/ScreenLock";
function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Call the reusable function
    validateToken(dispatch, setLoading);
  }, [dispatch]);

  if (loading) return <></>;

  return (
    <>
      <ScreenLock>
        <BrowserRouter>
          <ScrollToTop />
          <AppProvider>
            <ToastContainer />
            <RoutesComponent />
          </AppProvider>
        </BrowserRouter>
      </ScreenLock>
    </>
  );
}

export default App;
