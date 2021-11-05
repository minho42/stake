import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { About } from "./components/About";
import { StakeList } from "./components/StakeList";

import { UserProvider } from "./UserContext";
import { SiteStatusProvider } from "./SiteStatusContext";

function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <SiteStatusProvider>
            <Navbar />
            <Switch>
              <Route exact path="/">
                <div className="flex justify-center p-2 bg-gray-100 ">
                  <StakeList />
                </div>
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
            </Switch>
          </SiteStatusProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
