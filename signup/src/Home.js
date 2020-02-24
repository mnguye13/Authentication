import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSlice } from "./slice/setSlice";
import { Button } from "@material-ui/core";
import setAuthToken from "./authentication/setAuthToken";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector(state => state.setUser);
  const [user, setUser] = useState();

  useEffect(() => {
    getUserData();
  }, []);
  async function getUserData() {
    console.log(userData.id);
    try {
      const data = await axios.get(
        `http://localhost:3004/users/${userData.id}`
      );
      setUser(data.data.data);
    } catch (e) {
      console.log(e);
    }
  }

  function signOut() {
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

  return (
    <div>
      <h1>ITT Donuts Homepage</h1>
      {user && userData.isAuthenticated ? (
        <div>
          <h2>Welcome {user.name}</h2>
          <Button variant="contained" color="primary" onClick={() => signOut()}>
            Sign Out
          </Button>
          <h3>Reward Points: {user.rewardPoints}</h3>
        </div>
      ) : (
        <div>
          <h2> Please sign in to view reward points</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/login")}
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
}
