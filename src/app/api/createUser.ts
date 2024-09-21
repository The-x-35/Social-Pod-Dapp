import { client } from '../lib/sanity'

const createUserOnSanity = async (req: any , res: any) => {
  try {
    const userDoc = {
      _type: 'users',
      _id: req.body.userWalletAddress,
      name: req.body.name,
      walletAddress: req.body.userWalletAddress,
      profileImage: req.body.profileImage,
    }

    await client.createIfNotExists(userDoc)

    res.status(200).send({ message: 'success' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send({ message: 'error', data: errorMessage })
  }
}

export default createUserOnSanity