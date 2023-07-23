import React from "react";
import { Route, Redirect, Switch } from "react-router-dom"
import "./App.css";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import Undefined from "./pages/Undefined";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="*">
          <Undefined />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
