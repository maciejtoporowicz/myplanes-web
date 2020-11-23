import * as React from 'react';
import {useState} from 'react';
import {useAppDispatch} from "../../redux/store";
import { useHistory } from 'react-router-dom';
import {loadSettings} from "../../redux/subscriptions/thunks";
import {logIn} from "../../redux/client/thunks";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [clientId, setClientId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const doLogIn = async () => {
    setIsLoading(true)
    await dispatch(logIn({ clientId }));
    await dispatch(loadSettings());
    setIsLoading(false);
  }

  const onOkClick = () => {
    doLogIn().then(() => history.push("/subscriptions"));
  }

  if(isLoading) {
    return <p>{t('common.loading')}</p>;
  }

  return (
    <>
      <input placeholder={t('login.inputPlaceholder')} type="text" value={clientId} onChange={(e) => setClientId(e.target.value)}/>
      <button onClick={() => onOkClick()}>{t('login.login')}</button>
    </>
  );
};

export default Login;