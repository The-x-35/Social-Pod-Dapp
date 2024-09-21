import { Key, useEffect } from 'react'
import Image from 'next/image'
import Contact from './Contact'

interface RightSidebarProps {
  getUsers: any;
  users: any;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ getUsers, users }) => {
  const style = {
    wrapper: `w-[24rem] text-lg text-white mt-4`,
    title: `text-white font-semibold`,
    divider: `w-[95%] border-b border-[0.5px] border-[#3e4042] my-2`,
    contact: `flex items-center my-2`,
    contactImage: `rounded-full object-cover`,
    contactName: `ml-4 text-[1rem]`,
    contactsContainer: ``
  }

  useEffect(() => {
    ;(async () => {
      await getUsers()
    })()
  }, [])

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Made by Arpit</div>
        <div className={style.divider} />
        <div className={style.title}>Contacts</div>
        <div className={style.contactsContainer}>
          {users.map((user:any) => {
            return <Contact key={user.walletAddress} user={user} />
          })}
      </div>
    </div>
  )
}

export default RightSidebar