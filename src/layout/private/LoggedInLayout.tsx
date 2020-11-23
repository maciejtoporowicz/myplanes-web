import * as React from 'react';
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../redux/store";
import { useHistory } from 'react-router-dom';
import {logOut} from "../../redux/client/thunks";
import {getClientId} from "../../redux/client/selectors";

type Props = {
  children: React.ReactNode;
}

const LoggedInLayout = (props: Props) => {
  const { children } = props;

  const dispatch = useAppDispatch();
  const history = useHistory();

  const clientId = useSelector(getClientId);

  if(!clientId) {
    throw new Error("Not logged in")
  }

  const onLogOutClick = () => {
    dispatch(logOut()).then(() => history.push("/"));
  }

  return (
    <>
      <p>Logged in as {clientId}.</p>
      <button onClick={onLogOutClick}>Log out</button>
      {children}
    </>
  );
};

export default LoggedInLayout;