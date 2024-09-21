"use client";
import toast, { Toaster } from 'react-hot-toast'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { SOLANA_HOST } from '../utils/const'
import { getProgramInstance } from '../utils/get-program'
import CreatePost from './CreatePost'
import Post from './Post'
import * as anchor from '@project-serum/anchor'

const { BN, web3 } = anchor
const utf8 = anchor.utils.bytes.utf8
const { SystemProgram } = web3

const defaultAccounts = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
}

interface FeedProps {
  connected: boolean
  name: string
  url: string
}

interface PostAccount {
  account: {
    postTime: anchor.BN
    commentCount: anchor.BN
    index: anchor.BN
    text: string
  }
}

const Feed: React.FC<FeedProps> = ({ connected, name, url }) => {
  const style = {
    wrapper: `flex-1 max-w-2xl mx-4`,
  }

  const wallet = useWallet()
  console.log(wallet)
  const connection = new anchor.web3.Connection(SOLANA_HOST)
  const program = getProgramInstance(connection, {
    publicKey: wallet.publicKey!,
    signTransaction: wallet.signTransaction!,
    signAllTransactions: wallet.signAllTransactions!,
  })
  const [posts, setPosts] = useState<PostAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(async () => {
      await getAllPosts()
    }, 2000)
    getAllPosts()
    return () => clearInterval(interval)
  }, [connected])

  useEffect(() => {
    toast('Posts Refreshed!', {
      icon: '🔁',
      style: {
        borderRadius: '10px',
        background: '#252526',
        color: '#fffcf9',
      },
    })
  }, [posts.length])

  const getAllPosts = async () => {
    try {
      const postsData = (await program.account.postAccount.all()).map((post: any) => ({
        account: {
          postTime: post.account.postTime,
          commentCount: post.account.commentCount,
          index: post.account.index,
          text: post.account.text,
        },
      })) as PostAccount[]

      postsData.sort(
        (a, b) => b.account.postTime.toNumber() - a.account.postTime.toNumber(),
      )

      setPosts(postsData)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const getCommentsOnPost = async (index: anchor.BN, oldPost: PostAccount) => {
    try {
      let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [utf8.encode('post'), index.toArrayLike(Buffer, 'be', 8)],
        program.programId,
      )

      const post = await program.account.postAccount.fetch(postSigner)

      let commentSigners: anchor.web3.PublicKey[] = []

      for (let i = 0; i < (post as PostAccount).account.commentCount.toNumber(); i++) {
        let [commentSigner] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            utf8.encode('comment'),
            new BN(index).toArrayLike(Buffer, 'be', 8),
            new BN(i).toArrayLike(Buffer, 'be', 8),
          ],
          program.programId
        )

        commentSigners.push(commentSigner)
      }

      const comments = await program.account.commentAccount.fetchMultiple(
        commentSigners,
      )

      comments.sort((a:any, b:any) => (a?.postTime.toNumber() ?? 0) - (b?.postTime.toNumber() ?? 0))

      return comments
    } catch (error) {
      console.error(error)
    }
  }

  const savePost = async (text: string) => {
    let [stateSigner] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode('state')],
      program.programId,
    )

    let stateInfo: any

    try {
      stateInfo = await program.account.stateAccount.fetch(stateSigner) as { postCount: anchor.BN }
    } catch (error) {
      await program.methods.createState().accounts({
        state: stateSigner,
        authority: wallet.publicKey!,
        ...defaultAccounts,
      }).rpc();
    
      return;
    }
    

    let [postSigner] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode('post'), (stateInfo as { postCount: anchor.BN }).postCount.toArrayLike(Buffer, 'be', 8)],
      program.programId
    )

    try {
      await program.account.postAccount.fetch(postSigner)
    } catch {
      await program.methods.createPost(text, name, url).accounts({
        state: stateSigner,
        post: postSigner,
        authority: wallet.publicKey!,
        ...defaultAccounts,
      }).rpc();
    
      const postsData = (await program.account.postAccount.all()).map((post: any) => ({
        account: {
          postTime: post.account.postTime,
          commentCount: post.account.commentCount,
          index: post.account.index,
          text: post.account.text,
        },
      })) as PostAccount[];
    
      setPosts(postsData);
    }
    
  }

  const saveComment = async (text: string, index: anchor.BN, count: anchor.BN) => {
    let [postSigner] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode('post'), index.toArrayLike(Buffer, 'be', 8)],
      program.programId,
    )

    try {
      let [commentSigner] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          utf8.encode('comment'),
          index.toArrayLike(Buffer, 'be', 8),
          count.toArrayLike(Buffer, 'be', 8),
        ],
        program.programId,
      )

      await program.methods
  .createComment(text, name, url) 
  .accounts({
    post: postSigner,
    comment: commentSigner,
    authority: wallet.publicKey!,
    ...defaultAccounts,
  }) 
  .rpc(); 

      await program.account.commentAccount.fetch(commentSigner)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={style.wrapper}>
      <Toaster position='bottom-left' reverseOrder={false} />
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <CreatePost
              savePost={savePost}
              getAllPosts={getAllPosts}
              name={name}
              url={url}
            />

            {posts.map(post => (
              <Post
                post={post.account}
                viewDetail={getCommentsOnPost}
                createComment={saveComment}
                key={post.account.index}
                name={name}
                url={url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed