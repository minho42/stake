import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { About } from "./components/About";
import { StakeList } from "./components/StakeList";
import { DividendList } from "./components/DividendList";
import { RatingsList } from "./components/RatingsList";
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
            <Switch>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <PrivateRoute component={StakeList} path="/" exact />
              <PrivateRoute component={DividendList} path="/dividend" exact />
              <PrivateRoute component={RatingsList} path="/ratings" exact />
              <PrivateRoute component={Settings} path="/settings" exact />
            </Switch>
          </SiteProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
