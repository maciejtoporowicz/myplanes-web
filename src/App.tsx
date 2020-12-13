import React from 'react';
import './App.css';
import {Provider} from "react-redux";
import store from "./redux/store";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Login from "./features/login/Login";
import SubscriptionsRoutes from "./features/subscriptions/SubscriptionsRoutes";
import PrivateRoute from './layout/private/PrivateRoute';
import {GoogleMapsLoadingContextProvider} from "./infrastructure/context/googlemaps/GoogleMapsContext";

function App() {
  return (
    <Provider store={store}>
      <GoogleMapsLoadingContextProvider>
        <Router>
          <Switch>
            <Route exact path={"/"}>
              <Redirect to={"/subscriptions"} />
            </Route>
            <Route path={"/login"}>
              <Login />
            </Route>
            <PrivateRoute path={"/subscriptions"}>
              <SubscriptionsRoutes />
            </PrivateRoute>
          </Switch>
        </Router>
      </GoogleMapsLoadingContextProvider>
    </Provider>
  );
}

export default App;
