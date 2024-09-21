import React from 'react'
import Image from 'next/image'


const Contact = ({ user }: { user: any }) => {
  const style = {
    contact: `flex items-center my-2`,
    contactImage: `rounded-full object-cover`,
    contactName: `ml-4 text-[1rem]`,
  }
  return (
    <div className={style.contact}>
      <Image
        src={user.profileImage}
        height={40}
        width={40}
        className={style.contactImage}
        alt='profile image'
      />
      <div className={style.contactName}>{user.name}</div>
    </div>
  )
}

export default Contact