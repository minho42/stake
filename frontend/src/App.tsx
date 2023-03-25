import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { PortfolioList } from "./components/PortfolioList";
import { DividendList } from "./components/DividendList";
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
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <PortfolioList />
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
            </Routes>
          </SiteProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
