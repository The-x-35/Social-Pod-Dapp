import { client } from '../lib/sanity'

const getUserInfo = async (req: any, res: any) => {
  try {
    const query = `
      *[_type == "users"]{
          name,
          walletAddress,
          profileImage,
        }
    `

    const sanityResponse = await client.fetch(query)

    res.status(200).send({ message: 'success', data: sanityResponse })
  } catch (error) {
    res.status(500).send({ message: 'error', data: (error as Error).message })
  }
}

export default getUserInfo