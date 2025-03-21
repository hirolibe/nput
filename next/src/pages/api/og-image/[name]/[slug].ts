import * as path from 'path'
import {
  createCanvas,
  loadImage,
  GlobalFonts,
  SKRSContext2D,
} from '@napi-rs/canvas'
import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchUserData } from '@/utils/fetchUserData'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // URLからユーザー名とスラグを取得
    const { name } = req.query

    // フォントのパスを設定
    const fontPathBold = path.join(
      process.cwd(),
      'public',
      'fonts',
      'NotoSansJP-Bold.ttf',
    )

    const fontPathRegular = path.join(
      process.cwd(),
      'public',
      'fonts',
      'NotoSansJP-Regular.ttf',
    )

    // フォントの登録
    const boldRegistered = GlobalFonts.registerFromPath(
      fontPathBold,
      'NotoSansJP-Bold',
    )
    console.log(fontPathBold)
    console.log('フォント登録結果（Bold）:', boldRegistered)

    const regularRegistered = GlobalFonts.registerFromPath(
      fontPathRegular,
      'NotoSansJP-Regular',
    )
    console.log(fontPathRegular)
    console.log('フォント登録結果（Regular）:', regularRegistered)

    console.log(GlobalFonts.families)

    // ユーザーデータを取得（実際の実装に合わせて調整）
    const userData = await fetchUserData(name as string)

    // キャンバスを作成
    const width = 1200
    const height = 630
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // 背景を設定
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)

    // 枠線を描画
    ctx.strokeStyle = '#50A0B4'
    ctx.lineWidth = 10
    ctx.strokeRect(10, 10, width - 20, height - 20)

    // ロゴ
    const logoPath = path.join(process.cwd(), 'public', 'logo.png')
    const logo = await loadImage(logoPath)
    ctx.drawImage(logo, 50, 50, 120, 50)

    // タイトルの描画
    ctx.font = '40px NotoSansJP-Bold'
    ctx.fillStyle = '#333333'
    const titleText = `${name}さんの学習記録あああ`
    const titleWidth = ctx.measureText(titleText).width
    ctx.fillText(titleText, (width - titleWidth) / 2, 100)

    // 表のデータ（実際のデータに合わせて調整）
    const tableData = [
      ['今日', '今月', '合計'],
      ['4時間', '100時間', '1000時間'],
    ]

    // 表の描画
    drawTable(ctx, tableData, 75, 220, width - 150, 40)

    // 名言
    ctx.font = '24px NotoSansJP-Regular'
    const quoteText = userData?.profile.bio || '名言'
    wrapText(ctx, quoteText, width / 2, 400, width - 200, 30)

    // 出力するファイル形式をPNGに設定
    const buffer = await canvas.encode('png')

    // レスポンスヘッダーの設定
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', `public, max-age=${60 * 60 * 24}`) // 1日間キャッシュ

    // 画像データをレスポンスとして送信
    res.status(200).send(buffer)
  } catch (error) {
    console.error('OG画像生成エラー:', error)
    res.status(500).json({ error: 'OG画像の生成に失敗しました' })
  }
}

// テキストを折り返す関数
function wrapText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  if (!text) return

  const words = text.split('')
  let line = ''
  let testLine = ''
  let lineCount = 0

  // テキストを中央揃えにするため、x座標を計算するための基準点を保存
  const centerX = x

  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n]
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && n > 0) {
      // 各行の幅を計算して中央揃えにする
      const lineWidth = ctx.measureText(line).width
      const lineX = centerX - lineWidth / 2
      ctx.fillText(line, lineX, y + lineCount * lineHeight)
      line = words[n]
      lineCount++
    } else {
      line = testLine
    }
  }

  // 最後の行を描画
  const lineWidth = ctx.measureText(line).width
  const lineX = centerX - lineWidth / 2
  ctx.fillText(line, lineX, y + lineCount * lineHeight)
}

// 表を描画する関数
function drawTable(
  ctx: SKRSContext2D,
  data: string[][],
  x: number,
  y: number,
  width: number,
  rowHeight: number,
) {
  const colWidth = width / data[0].length

  // ヘッダー行の背景色
  ctx.fillStyle = '#50A0B4'
  ctx.fillRect(x, y, width, rowHeight)

  // 表のセルと境界線を描画
  ctx.strokeStyle = '#333333'
  ctx.lineWidth = 1

  // ヘッダーテキスト（白色）
  ctx.fillStyle = 'white'
  ctx.font = '20px NotoSansJP-Bold'

  // ヘッダー行を描画
  for (let i = 0; i < data[0].length; i++) {
    const cellX = x + i * colWidth
    ctx.strokeRect(cellX, y, colWidth, rowHeight)
    ctx.fillText(
      data[0][i],
      cellX + colWidth / 2 - ctx.measureText(data[0][i]).width / 2,
      y + rowHeight / 2 + 7,
    )
  }

  // データ行のテキスト色
  ctx.fillStyle = '#333333'
  ctx.font = '18px NotoSansJP-Regular'

  // データ行を描画
  for (let j = 1; j < data.length; j++) {
    const rowY = y + j * rowHeight

    // 奇数行と偶数行で異なる背景色を設定
    if (j % 2 === 1) {
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(x, rowY, width, rowHeight)
    } else {
      ctx.fillStyle = 'white'
      ctx.fillRect(x, rowY, width, rowHeight)
    }

    ctx.fillStyle = '#333333'

    for (let i = 0; i < data[j].length; i++) {
      const cellX = x + i * colWidth
      ctx.strokeRect(cellX, rowY, colWidth, rowHeight)
      ctx.fillText(
        data[j][i],
        cellX + colWidth / 2 - ctx.measureText(data[j][i]).width / 2,
        rowY + rowHeight / 2 + 7,
      )
    }
  }
}
