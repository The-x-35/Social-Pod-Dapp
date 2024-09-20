"use client";
import { useEffect, useState } from "react";
import SignUp from "./components/SignUp";
import Feed from "./components/Feed";
import { useWallet } from "@solana/wallet-adapter-react";
import Header from "./components/Header";
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo, FC } from 'react';
import { WalletBalanceProvider } from './context/useWalletBalance'
import dynamic from 'next/dynamic'

const style = {
  wrapper: `bg-[#18191a] min-h-screen duration-[0.5s]`,
  homeWrapper: `flex`,
  center: `flex-1`,
  main: `flex-1 flex justify-center`,
  signupContainer: `flex items-center justify-center w-screen h-[70vh]`,
}
const WalletConnectionProvider = dynamic(
  () => import('./context/WalletConnectionProvider'),
  {
    ssr: false,
  },
)
export default function Home() {
  const [registered, setRegistered] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [users, setUsers] = useState([])
  const wallet = useWallet()
  const endpoint = useMemo(() => 'https://api.devnet.solana.com', []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <WalletConnectionProvider>
    <WalletBalanceProvider>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className={style.wrapper}>
              <Header name={name} url={url} />
            {registered ? ( 
              <div className={style.homeWrapper}>
                {/* <Sidebar name={name} url={url} /> */}
                <div className={style.main}>
                  <Feed connected={wallet.connected} name={name} url={url} />
                </div>
                {/* <RightSidebar
                  getUsers={requestUsersData}
                  users={users}
                  setUsers={setUsers}
                /> */}
              </div>
            ) : (
              <div className={style.signupContainer}>
                <SignUp
                  setRegistered={setRegistered}
                  name={name}
                  setName={setName}
                  url={url}
                  setUrl={setUrl}
                />
              </div>
            )}
          </div>
        </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
  </WalletBalanceProvider>
  </WalletConnectionProvider>
  );
}
