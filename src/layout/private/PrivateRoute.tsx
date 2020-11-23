import * as React from 'react';
import {useSelector} from "react-redux";
import {Redirect, Route, RouteProps} from 'react-router-dom';
import {getClientId} from "../../redux/client/selectors";

type Props = RouteProps;

const PrivateRoute = (props: Props) => {
  const {children, ...rest} = props;

  const clientId = useSelector(getClientId);

  if (!clientId) {
    return <Redirect to={"/login"}/>
  }

  return (
    <Route
      {...rest}>
      {children}
    </Route>
  );
};

export default PrivateRoute;