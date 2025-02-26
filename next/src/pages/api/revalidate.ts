import { NextApiRequest, NextApiResponse } from 'next'

interface RevalidateResponse {
  revalidated: boolean
}

const revalidate = async (
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse | string>,
) => {
  try {
    await res.revalidate(req.body.path)
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('再検証エラーが発生しました')
  }
}

export default revalidate
