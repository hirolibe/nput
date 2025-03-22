import * as fs from 'fs'
import * as path from 'path'

const getRandomQuote = () => {
  // JSONファイルのパスを設定
  const quotesPath = path.join(process.cwd(), 'public', 'quotes.json')

  // JSONファイルを読み込む
  const quotesData = fs.readFileSync(quotesPath, 'utf8')
  const quotes = JSON.parse(quotesData)

  // ランダムに1つの名言を選択
  const randomIndex = Math.floor(Math.random() * quotes.length)
  const selectedQuote = quotes[randomIndex]

  return {
    quoteText: selectedQuote.text,
    quoteAuthor: selectedQuote.author,
  }
}

export default getRandomQuote
