import * as React from 'react';
import {JobId} from "../../../../redux/flights/JobId";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../../redux/store";
import {areSettingsBeingChanged, selectSettingsById} from "../../../../redux/subscriptions/selectors";
import {updatePushNotificationEnabled} from "../../../../redux/subscriptions/thunks";
import {useTranslation} from 'react-i18next';

type Props = {
  jobId: JobId;
};

const NotificationSetting = (props: Props) => {
  const { jobId } = props;

  const areBeingChanged = useSelector(areSettingsBeingChanged(jobId));
  const settings = useSelector(selectSettingsById(jobId));

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  if(!settings) {
    return null;
  }

  const { notificationsEnabled } = settings;

  return (
    <button
      disabled={areBeingChanged}
      onClick={() => dispatch(updatePushNotificationEnabled({ jobId: jobId, areEnabled: !notificationsEnabled}))}>
      {notificationsEnabled ? t('notificationSettings.disable') : t('notificationSettings.enable')}
    </button>
  );
};

export default NotificationSetting;