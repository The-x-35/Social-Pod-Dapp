import Image from 'next/image'
import { sidebarData } from './static'

interface SidebarProps {
  name: string;
  url: string;
}

const Sidebar = ({ name, url }: SidebarProps) => {
  const style = {
    wrapper: `py-[25px] px-[10px] w-[18rem] `,
    sidebarRow: `flex w-full mb-[20px] hover:bg-[#2a2b2c] transition-all duration-300 ease-in-out rounded-lg p-[5px] gap-[10px] cursor-pointer`,
    profileImage: `rounded-full object-cover`,
    sidebarItem: `text-white font-semibold flex items-center  flex-col justify-center text-sm `,
    sidebarIcon: `object-contain`,
  }
  const customLoader = ({ src }: { src: string }) => {
    return src; 
  };
  return (
    <div className={style.wrapper}>
      <div className={style.sidebarRow}>
        <Image
          loader={customLoader}
          className={style.profileImage}
          src={url}
          height={30}
          width={30}
          alt='profile image'
        />
        <div className={style.sidebarItem}>{name}</div>
      </div>
      {sidebarData.map((sidebarDataItem, index) => (
        <div className={style.sidebarRow} key={index}>
          <Image
            className={style.sidebarIcon}
            src={sidebarDataItem.icon}
            height={30}
            width={30}
            alt='sidebar icon'
          />
          <div className={style.sidebarItem}>{sidebarDataItem.title}</div>
        </div>
      ))}
    </div>
  )
}

export default Sidebar