import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { About } from "./components/About";
import { StakeList } from "./components/StakeList";
import { DividendList } from "./components/DividendList";
import { RatingsList } from "./components/RatingsList";
import { Settings } from "./components/Settings";

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
                <StakeList />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/dividend">
                <DividendList />
              </Route>
              <Route exact path="/ratings">
                <RatingsList />
              </Route>
              <Route exact path="/settings">
                <Settings />
              </Route>
            </Switch>
          </SiteProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
