import dynamic from 'next/dynamic'
// import '../styles/globals.css'
import { WalletBalanceProvider } from './context/useWalletBalance'
import { ModalProvider } from 'react-simple-hook-modal'

const WalletConnectionProvider = dynamic(
  () => import('./context/WalletConnectionProvider'),
  {
    ssr: false,
  },
)

function MyApp({ Component, pageProps }: any) {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
          <Component {...pageProps} />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}

export default MyApp