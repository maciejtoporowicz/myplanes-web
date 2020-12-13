import React, {useEffect} from "react";
import {RootState, useAppDispatch} from "../../../../redux/store";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import NotificationSetting from "./NotificationSetting";
import {useMessaging} from "../../../../infrastructure/context/messaging/MessagingContext";
import {subscriptionsSelector} from "../../../../redux/subscriptions/selectors";
import {getFlightsForJob, isLoading, jobsSelector} from "../../../../redux/flights/selectors";
import {fetchFlightsData} from "../../../../redux/flights/thunks";
import {useTranslation} from 'react-i18next';

type Props = {
  subscriptionId: string;
}

const Detail = (props: Props) => {
  const {subscriptionId} = props;

  const dispatch = useAppDispatch();
  const history = useHistory();
  const messaging = useMessaging();
  const {t} = useTranslation();

  const flights = useSelector(getFlightsForJob(subscriptionId))
  const updatedAt = useSelector((state: RootState) => jobsSelector.selectById(state, subscriptionId)?.updatedAt);
  const subscription = useSelector((state: RootState) => subscriptionsSelector.selectById(state, subscriptionId))
  const isSubscriptionBeingLoaded = useSelector(isLoading(subscriptionId));

  useEffect(() => {
    dispatch(fetchFlightsData(subscriptionId));
  }, [dispatch, subscriptionId]);

  useEffect(() => {
    const unsubscribeFromMessaging =
      messaging.onMessage(({jobId}: { jobId: string }) => dispatch(fetchFlightsData(jobId)));

    return () => {
      unsubscribeFromMessaging();
    }
  }, [dispatch, messaging]);

  const noDataLabel = t('subscription.noData');

  if (isSubscriptionBeingLoaded) {
    return <p>{t('common.loading')}</p>;
  }

  if (!subscription || !flights) {
    return <p>{noDataLabel}</p>;
  }

  return (
    <>
      <button onClick={() => history.goBack()}>{t('common.goBack')}</button>
      <h1>{subscription.name}</h1>
      <NotificationSetting jobId={subscriptionId}/>
      <details>
        <summary>
          {t('subscription.scannerConfig')}
        </summary>
        <table>
          <thead>
          <tr>
            <th>{t('subscription.coordinates')}</th>
            <th>{t('subscription.rangeNorth')}</th>
            <th>{t('subscription.rangeEast')}</th>
            <th>{t('subscription.rangeSouth')}</th>
            <th>{t('subscription.rangeWest')}</th>
            <th>{t('subscription.altitudeThreshold')}</th>
          </tr>
          <tr>
            <td>{subscription.coordinates}</td>
            <td>{subscription.boundaryOffsetNorth}</td>
            <td>{subscription.boundaryOffsetEast}</td>
            <td>{subscription.boundaryOffsetSouth}</td>
            <td>{subscription.boundaryOffsetWest}</td>
            <td>{subscription.altitudeThreshold}</td>
          </tr>
          </thead>
        </table>
      </details>
      <h3>{updatedAt && t('subscription.flightsAsOf', {
        numOfFlights: flights.length,
        lastUpdate: new Intl.DateTimeFormat('default', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }).format(new Date(updatedAt))
      })}</h3>
      <table>
        <thead>
        <tr>
          <th>{t('subscription.column.icao24')}</th>
          <th>{t('subscription.column.callSign')}</th>
          <th>{t('subscription.column.longitude')}</th>
          <th>{t('subscription.column.latitude')}</th>
          <th>{t('subscription.column.altitude')}</th>
          <th>{t('subscription.column.onGround')}</th>
          <th>{t('subscription.column.make')}</th>
          <th>{t('subscription.column.model')}</th>
          <th>{t('subscription.column.owner')}</th>
        </tr>
        </thead>
        <tbody>
        {flights.map((flight) => (
          <tr key={flight.icao24}>
            <td>{flight.icao24}</td>
            <td>{flight.callSign}</td>
            <td>{flight.longitude?.value || noDataLabel}</td>
            <td>{flight.latitude?.value || noDataLabel}</td>
            <td>{flight.barometricAltitude?.meters || noDataLabel}</td>
            <td>{flight.onGround}</td>
            <td>{flight.aircraftMake || noDataLabel}</td>
            <td>{flight.aircraftModel || noDataLabel}</td>
            <td>{flight.owner || noDataLabel}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  )
}

export default Detail;