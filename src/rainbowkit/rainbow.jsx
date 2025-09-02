import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { shardeumTestnet } from '../contract/shardeumTestnet'
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'AccessFi',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'accessfi',
  chains: [ shardeumTestnet ],
});

const queryClient = new QueryClient();

export default function RainbowProvider ({children}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize='compact'>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};