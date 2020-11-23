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

const Flight = (props: Props) => {
  const {subscriptionId} = props;

  const dispatch = useAppDispatch();
  const history = useHistory();
  const messaging  = useMessaging();
  const { t } = useTranslation();

  const flights = useSelector(getFlightsForJob(subscriptionId))
  const updatedAt = useSelector((state: RootState) => jobsSelector.selectById(state, subscriptionId)?.updatedAt);
  const subscription = useSelector((state: RootState) => subscriptionsSelector.selectById(state, subscriptionId))
  const isSubscriptionBeingLoaded = useSelector(isLoading(subscriptionId));
  
  useEffect(() => {
    dispatch(fetchFlightsData(subscriptionId));
  }, [dispatch, subscriptionId]);

  useEffect(() => {
    const unsubscribeFromMessaging =
      messaging.onMessage(({ jobId } : {jobId: string}) => dispatch(fetchFlightsData(jobId)));

    return () => {
      unsubscribeFromMessaging();
    }
  }, [dispatch, messaging]);

  const noDataLabel = t('flight.noData');

  if (isSubscriptionBeingLoaded) {
    return <p>{t('common.loading')}</p>;
  }

  if (!subscription || !flights) {
    return <p>{noDataLabel}</p>;
  }

  return (
    <>
      <button onClick={() => history.goBack()}>{t('common.goBack')}</button>
      <summary>
        <h1>{subscription.name}</h1>
        <NotificationSetting jobId={subscriptionId}/>
        <details>
          <table>
            <thead>
            <tr>
              <th>{t('flightDetails.coordinates')}</th>
              <th>{t('flightDetails.rangeNorth')}</th>
              <th>{t('flightDetails.rangeEast')}</th>
              <th>{t('flightDetails.rangeSouth')}</th>
              <th>{t('flightDetails.rangeWest')}</th>
              <th>{t('flightDetails.altitudeThreshold')}</th>
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
      </summary>
      {updatedAt &&
      <>
        <h3>{t('flightDetails.lastUpdated', { lastUpdate: updatedAt.toString()})}</h3>
        <table>
          <thead>
          <tr>
            <th>{t('flightDetails.column.icao24')}</th>
            <th>{t('flightDetails.column.callSign')}</th>
            <th>{t('flightDetails.column.altitude')}</th>
            <th>{t('flightDetails.column.onGround')}</th>
            <th>{t('flightDetails.column.make')}</th>
            <th>{t('flightDetails.column.model')}</th>
            <th>{t('flightDetails.column.owner')}</th>
          </tr>
          </thead>
          <tbody>
          {flights.map((flight) => (
            <tr key={flight.icao24}>
              <td>{flight.icao24}</td>
              <td>{flight.callSign}</td>
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
      }
      {!updatedAt && <p>{noDataLabel}</p>}
    </>
  )
}

export default Flight;