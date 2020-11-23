import * as React from 'react';
import {useEffect} from 'react';
import {RouteComponentProps, Switch, useRouteMatch, withRouter} from 'react-router-dom';
import Flight from "./flights/detail/Flight";
import Flights from "./flights/list/Flights";
import {LoadingState} from "../../redux/LoadingState";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import PrivateRoute from '../../layout/private/PrivateRoute';
import LoggedInLayout from "../../layout/private/LoggedInLayout";
import {MessagingProvider} from "../../infrastructure/context/messaging/MessagingContext";
import {fetchSubscriptions} from "../../redux/subscriptions/thunks";
import {getClientId} from "../../redux/client/selectors";
import {useTranslation} from 'react-i18next';

const SubscriptionsRoutes = () => {
  const dispatch = useDispatch();
  const routeMatch = useRouteMatch();
  const { t } = useTranslation();

  const loading = useSelector((state: RootState) => state.subscriptionsData.loading);
  const clientId = useSelector(getClientId);

  useEffect(() => {
    if(!clientId) {
      return;
    }
    dispatch(fetchSubscriptions({ clientId }));
  }, [dispatch, clientId]);

  if(loading === LoadingState.IDLE) {
    return null;
  }

  if(loading === LoadingState.LOADING) {
    return <p>{t('common.loading')}</p>
  }

  return (
    <LoggedInLayout>
      <MessagingProvider>
        <Switch>
          <PrivateRoute path={`${routeMatch.url}/:id`} render={(routerParams: RouteComponentProps<{ id: string }>) => (
            <Flight subscriptionId={routerParams.match.params.id} />
          )}>
          </PrivateRoute>
          <PrivateRoute path={`${routeMatch.url}`}>
            <Flights />
          </PrivateRoute>
        </Switch>
      </MessagingProvider>
    </LoggedInLayout>
  );
};

export default withRouter(SubscriptionsRoutes);