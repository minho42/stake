import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { About } from "./components/About";
import { PortfolioList } from "./components/PortfolioList";

import { UserProvider } from "./UserContext";
import { SiteProvider } from "./SiteContext";

function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <SiteProvider>
            <Navbar />
            <Switch>
              <Route exact path="/">
                <div className="flex justify-center p-2 bg-gray-100 ">
                  <PortfolioList />
                </div>
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
            </Switch>
          </SiteProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
