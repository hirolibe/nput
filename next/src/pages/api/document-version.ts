import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  termsVersion: string
  privacyVersion: string
}

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'version.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  res.status(200).json(data)
}

export default handler
