import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { About } from "./components/About";
import { PortfolioList } from "./components/PortfolioList";
import { StakeHistory } from "./components/StakeHistory";
import { DividendList } from "./components/DividendList";
import { Ratings } from "./components/Ratings";
import { Settings } from "./components/Settings";
import { PrivateRoute } from "./components/PrivateRoute";
import { UserProvider } from "./UserContext";
import { SiteProvider } from "./SiteContext";

function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <SiteProvider>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <PortfolioList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <StakeHistory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dividend"
                element={
                  <PrivateRoute>
                    <DividendList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ratings"
                element={
                  <PrivateRoute>
                    <Ratings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
            </Routes>
          </SiteProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
