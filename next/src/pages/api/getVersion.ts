import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

const getVersion = (dirName: string): number | null => {
  const dirPath = path.join(process.cwd(), 'public', dirName)
  try {
    const files = fs.readdirSync(dirPath)
    return files.length
  } catch (error) {
    return null
  }
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const privacyVersion = getVersion('privacy')
  const termsVersion = getVersion('terms')

  if (privacyVersion === null || termsVersion === null) {
    return res
      .status(500)
      .json({ error: 'ディレクトリの読み込みに失敗しました' })
  }

  res.status(200).json({ privacyVersion, termsVersion })
}

export default handler
