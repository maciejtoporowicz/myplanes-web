import {createMessaging} from "../infrastructure/firebase/FirebaseMessaging";
import {getSettingsRepo} from "../infrastructure/settings/SettingsRepo";
import {i18nConfig} from "../i18n/config";
import i18n from "../i18n";

declare var self: ServiceWorkerGlobalScope;

const configure = async () => {
  const t = await i18n.init(i18nConfig);

  const [settingsRepo, messaging] = await Promise.all([
    getSettingsRepo(),
    createMessaging()
  ]);

  messaging.onBackgroundMessage(async (payload) => {
    if (!payload) {
      return;
    }

    const jobId = payload['jobId'];
    const newFlightsCount = Number.parseInt(payload['newFlightsCount']);

    const foundSettings = await settingsRepo.get(jobId);

    const settings = foundSettings || {
      jobId: jobId,
      pushNotificationsEnabled: false
    };

    if (!settings.pushNotificationsEnabled) {
      return;
    }

    self.registration.showNotification(t('notification.title', { newFlightsCount }));
  });
}

configure().then(() => console.debug('Service worker initialized.'));

export default null;