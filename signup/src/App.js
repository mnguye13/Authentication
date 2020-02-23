import React from "react";
import logo from "./logo.svg";
import "./App.css";
import SignIn from "./SignIn";
import Home from "./Home";
import { userSlice } from "./slice/setSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./authentication/setAuthToken";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  if (localStorage.userToken) {
    const token = localStorage.userToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    console.log(decoded);
    dispatch(
      userSlice.actions.setUser({
        id: decoded.id,
        name: decoded.name,
        isAuthenticated: true
      })
    );

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("userToken");
      setAuthToken(false);
      dispatch(
        userSlice.actions.setUser({
          id: null,
          username: null,
          isAuthenticated: false
        })
      );
    }
  }
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </div>
      <Switch>
        <Route path="/login" component={SignIn} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
