import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  text: string
}

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { documentName, version } = req.body

  const filePath = path.join(
    process.cwd(),
    'public',
    documentName,
    `${documentName}-v${version}.md`,
  )

  const data = { text: fs.readFileSync(filePath, 'utf8') }
  res.status(200).json(data)
}

export default handler
