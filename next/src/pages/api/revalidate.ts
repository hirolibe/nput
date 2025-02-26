import { NextApiRequest, NextApiResponse } from 'next'

interface RevalidateResponse {
  revalidated: boolean
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse | string>,
) => {
  await res.revalidate(req.body.path)
  res.status(200).json({ revalidated: true })
}

export default handler
