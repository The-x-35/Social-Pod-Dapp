"use client";
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { BiLike } from 'react-icons/bi'
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import CommentSection from './CommentSection'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

interface PostProps {
  post: any
  viewDetail: any
  createComment: (text: string, index: number, count: { toNumber: () => number }) => Promise<void>
  name: string
  url: string
}

const Post: React.FC<PostProps> = ({ post, viewDetail, createComment, name, url }) => {
  const style = {
    wrapper: `w-[100%] mt-[1rem] rounded-[0.6rem] bg-[#252526] text-white p-[0.4rem] pb-0`,
    postPublisher: `flex position-relative items-center`,
    avatar: `rounded-full`,
    publisherDetails: `flex flex-col ml-[0.5rem]`,
    name: `text-sm`,
    timestamp: `text-sm text-[#777]`,
    text: `py-[1rem] px-[1.2rem]`,
    reactionsContainer: `border-t border-[#3a3b3e] text-[18px] flex justify-evenly text-[#b0b3b8] cursor-pointer py-1`,
    reactionItem: `flex flex-1 items-center justify-center rounded-[0.4rem] hover:bg-[#404041] py-2`,
    reactionsText: `ml-[1rem]`,
    refreshIcon: `text-blue-500`,
  }

  const [isCommentSectionOpened, setIsCommentSectionOpened] = useState<boolean>(false)
  const [comments, setComments] = useState<any[]>([])

  useEffect(() => {
    const fetchPostDetails = async () => {
      const result = await viewDetail(post.index, post)
      setComments(await result)
    }

    fetchPostDetails()
  }, [post, viewDetail])

  useEffect(() => {
    if (comments && comments.length > 0) {
      setIsCommentSectionOpened(true)
    }
  }, [comments])

  const clockToDateString = (timestamp: { toNumber: () => number }) =>
    timeAgo.format(new Date(timestamp.toNumber() * 1000), 'twitter-now')

  const createCommentForPost = async (text: string) => {
    await createComment(text, post.index, post.commentCount)
  }
  const customLoader = ({ src }: { src: string }) => {
    return src; 
  };

  return (
    <div className={style.wrapper}>
      <div className={style.postPublisher}>
        <Image
          loader={customLoader}
          src={post.posterUrl}
          className={style.avatar}
          height={44}
          width={44}
          alt='publisher profile image'
        />
        <div className={style.publisherDetails}>
          <div className={style.name}>{post.posterName}</div>
          <div className={style.timestamp}>
            {clockToDateString(post.postTime)}
          </div>
        </div>
      </div>

      <div>
        <div className={style.text}>{post.text}</div>
      </div>

      <div className={style.reactionsContainer}>
        <div className={style.reactionItem}>
          <BiLike />
          <div className={style.reactionsText}>Like</div>
        </div>
        <div
          className={style.reactionItem}
          onClick={() => setIsCommentSectionOpened(!isCommentSectionOpened)}
        >
          <FaRegCommentAlt />
          <div className={style.reactionsText}>Comment</div>
        </div>
        <div className={style.reactionItem}>
          <FiRefreshCw className={style.refreshIcon} />
          <div className={style.reactionsText}>Refresh Comments</div>
        </div>
      </div>
      {/* {isCommentSectionOpened && (
        <CommentSection
          comments={comments}
          createCommentForPost={createCommentForPost}
          name={name}
          url={url}
        />
      )} */}
    </div>
  )
}

export default Post
