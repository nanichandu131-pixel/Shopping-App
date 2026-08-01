import { AmazonProvider } from './AmazonProvider.js';
import { FlipkartProvider } from './FlipkartProvider.js';
import { MyntraProvider } from './MyntraProvider.js';
import { AjioProvider } from './AjioProvider.js';
import { MeeshoProvider } from './MeeshoProvider.js';
import { CromaProvider } from './CromaProvider.js';
import { RelianceDigitalProvider } from './RelianceDigitalProvider.js';
import { VijaySalesProvider } from './VijaySalesProvider.js';
import { TataCliqProvider } from './TataCliqProvider.js';

const providers = [
  new AmazonProvider(),
  new FlipkartProvider(),
  new MyntraProvider(),
  new AjioProvider(),
  new MeeshoProvider(),
  new CromaProvider(),
  new RelianceDigitalProvider(),
  new VijaySalesProvider(),
  new TataCliqProvider()
];

export const providerRegistry = {
  all: () => providers,
  configured: () => providers.filter((provider) => provider.isConfigured()),
  get: (key) => providers.find((provider) => provider.key === key),
  status: () =>
    providers.map((provider) => ({
      key: provider.key,
      name: provider.name,
      configured: provider.isConfigured()
    }))
};
