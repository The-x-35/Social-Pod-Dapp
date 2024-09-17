import dynamic from 'next/dynamic';
import '../styles/globals.css';
import { WalletBalanceProvider } from './context/useWalletBalance';
import { ModalProvider } from 'react-modal-hook';
import { AppProps } from 'next/app';

const WalletConnectionProvider = dynamic(
  () => import('../context/WalletConnectionProvider'),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
