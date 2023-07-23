import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import Undefined from "./pages/Undefined";
import Layout from "./components/Layout/Layout";
import Home from "./components/Users/Home";
import NewApplication from "./components/Users/NewApplication";
import Invest from "./components/Users/Invest";
import MyPortfolio from "./components/Users/MyPortfolio";
import AdminDashboard from "./components/Admin/AdminDashboard";
import MintFleetAssets from "./components/Admin/MintFleetAssets";

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/users">
          <Home />
        </Route>
        <Route exact path="/users/newApplication">
          <NewApplication />
        </Route>
        <Route exact path="/users/invest">
          <Invest />
        </Route>
        <Route exact path="/users/myPortfolio">
          <MyPortfolio />
        </Route>
        <Route exact path="/adminDashboard">
          <AdminDashboard />
        </Route>
        <Route exact path="/adminDashboard/mintFleetAssets">
          <MintFleetAssets />
        </Route>
        <Route path="*">
          <Undefined />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
