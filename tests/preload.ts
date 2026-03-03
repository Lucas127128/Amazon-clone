import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register({
  settings: {
    fetch: { disableStrictSSL: true, disableSameOriginPolicy: true },
  },
});
