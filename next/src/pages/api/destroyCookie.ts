// pages/api/destroyCookie.ts
import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    serialize('firebase_auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1,
      path: '/',
      sameSite: 'strict',
    }),
  )
  res.status(200).json({ message: 'クッキーを削除しました' })
}
