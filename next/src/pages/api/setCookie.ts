import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const { token } = req.body

  if (!token) {
    return res.status(400).json({ message: 'トークンがありません' })
  }

  const cookie = serialize('firebase_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'strict',
  })

  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ message: 'クッキーを保存しました' })
}
