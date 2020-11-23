import React, {useEffect} from "react";
import {RootState} from "../../../../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {Link, useRouteMatch} from "react-router-dom";
import {useMessaging} from "../../../../infrastructure/context/messaging/MessagingContext";
import {subscriptionsSelector} from "../../../../redux/subscriptions/selectors";
import {fetchFlightsData} from "../../../../redux/flights/thunks";
import { useTranslation } from 'react-i18next';

const Flights = () => {
  const routeMatch = useRouteMatch();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const subscriptions = useSelector(subscriptionsSelector.selectAll);
  const jobData = useSelector((state: RootState) => state.flightsData.jobs.entities);
  const jobLoading = useSelector((state: RootState) => state.flightsData.jobDataLoadingByJobId);
  const messaging = useMessaging();

  useEffect(() => {
    if(!subscriptions || subscriptions.length === 0) {
      return;
    }
    subscriptions.forEach((subscription) => dispatch(fetchFlightsData(subscription.jobId)));
  }, [dispatch, subscriptions]);

  useEffect(() => {
    if(!messaging) {
      return;
    }
    const unsubscribeFromMessaging =
      messaging.onMessage(({ jobId } : {jobId: string}) => dispatch(fetchFlightsData(jobId)));

    return () => {
      unsubscribeFromMessaging();
    }
  }, [dispatch, messaging]);

  if(subscriptions.length === 0) {
    return <p>{t('flights.noObservedAreas')}</p>
  }

  return (
    <>
      <h1>{t('flights.observedAreas')}</h1>
      <table>
        <thead>
        <tr>
          <th>{t('flights.name')}</th>
          <th>{t('flights.lastUpdate')}</th>
        </tr>
        </thead>
        <tbody>
        {
          subscriptions.map(subscription => (
            <tr key={subscription.jobId}>
              <td>
                <Link key={subscription.jobId} to={`${routeMatch.url}/${subscription.jobId}`}>
                  {subscription.name}
                </Link>
              </td>
              <td>
                {(jobLoading[subscription.jobId] || 0) > 0 ? t('common.loading') : (jobData[subscription.jobId]?.updatedAt || t('common.unknown')) }
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </>
  )
}

export default Flights;