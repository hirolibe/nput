import { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  revalidated: boolean
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await res.revalidate(req.body.path)
  res.status(200).json({ revalidated: true })
}

export default handler
