import * as path from 'path'
import {
  createCanvas,
  loadImage,
  GlobalFonts,
  SKRSContext2D,
} from '@napi-rs/canvas'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // URLからユーザー名とスラグを取得
    const { name, todayHours, todayMinutes, thisMonthHours, totalHours } =
      req.query

    // パラメータをデコードして使用
    const todayHoursNumber = parseInt(
      decodeURIComponent(todayHours as string),
      10,
    )
    const todayMinutesNumber = parseInt(
      decodeURIComponent(todayMinutes as string),
      10,
    )
    const thisMonthHoursNumber = parseInt(
      decodeURIComponent(thisMonthHours as string),
      10,
    )
    const totalHoursNumber = parseInt(
      decodeURIComponent(totalHours as string),
      10,
    )

    // フォントのパスを設定
    const fontPathSansBold = path.join(
      process.cwd(),
      'public',
      'fonts',
      'NotoSansJP-Bold.ttf',
    )

    const fontPathSansRegular = path.join(
      process.cwd(),
      'public',
      'fonts',
      'NotoSansJP-Regular.ttf',
    )

    const fontPathSerifBold = path.join(
      process.cwd(),
      'public',
      'fonts',
      'NotoSerifJP-Bold.ttf',
    )

    const fontPathSerifRegular = path.join(
      process.cwd(),
      'public',
      'fonts',
      'NotoSerifJP-Regular.ttf',
    )

    // フォントの登録
    GlobalFonts.registerFromPath(fontPathSansBold, 'NotoSansJP-Bold')
    GlobalFonts.registerFromPath(fontPathSansRegular, 'NotoSansJP-Regular')
    GlobalFonts.registerFromPath(fontPathSerifBold, 'NotoSerifJP-Bold')
    GlobalFonts.registerFromPath(fontPathSerifRegular, 'NotoSerifJP-Regular')

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
    roundRect(ctx, 20, 20, width - 40, height - 40, 15).stroke()

    // ロゴ
    const logoPath = path.join(process.cwd(), 'public', 'logo.png')
    const logo = await loadImage(logoPath)
    ctx.drawImage(logo, 50, 50, 120, 50)

    // タイトルの描画
    ctx.font = '50px NotoSansJP-Bold'
    ctx.fillStyle = '#333333'
    const titleText = `${name}さんの学習記録`
    const titleWidth = ctx.measureText(titleText).width
    ctx.fillText(titleText, (width - titleWidth) / 2, 160)

    // 表のデータ（実際のデータに合わせて調整）
    const tableData = [
      ['今日', '今月', '合計'],
      [
        `${todayHoursNumber}時間${todayMinutesNumber}分`,
        `${thisMonthHoursNumber}時間`,
        `${totalHoursNumber}時間`,
      ],
    ]

    // 表の描画（角丸版）
    const tableWidth = 800
    drawRoundedTable(
      ctx,
      tableData,
      (width - tableWidth) / 2,
      200,
      tableWidth,
      100,
      60,
      15, // 角の丸みの半径
    )

    // 名言
    ctx.font = '30px NotoSerifJP-Bold'
    ctx.textAlign = 'left'
    const quoteText =
      '小さいことを重ねることが、とんでもないところに行くただひとつの道'
    renderAdaptiveTextBox(ctx, quoteText, width / 2, 440, width - 200, 40, 0)

    // 名言の作者名
    ctx.font = 'italic 24px NotoSerifJP-Regular'
    ctx.fillStyle = '#666666'
    ctx.textAlign = 'center'
    const quoteAuthor = 'イチロー'
    renderAdaptiveTextBox(ctx, quoteAuthor, 1090, 530, width - 200, 40, 0)

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

function renderAdaptiveTextBox(
  ctx: SKRSContext2D,
  text: string,
  centerX: number,
  centerY: number,
  maxWidth: number,
  lineHeight: number,
  padding: number,
) {
  // テキストを文字単位で分割（日本語向け）
  const chars = text.split('')
  const lines = []
  let currentLine = ''
  let maxLineWidth = 0

  // 行に分割してテキストの最大幅を計算
  for (let i = 0; i < chars.length; i++) {
    const testLine = currentLine + chars[i]
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && i > 0) {
      lines.push(currentLine)
      maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width)
      currentLine = chars[i]
    } else {
      currentLine = testLine
    }
  }

  // 最後の行を追加
  if (currentLine.length > 0) {
    lines.push(currentLine)
    maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width)
  }

  // ボックスの幅と高さを計算（テキスト最大幅 + パディング）
  const boxWidth = maxLineWidth + padding * 2
  const boxHeight = lines.length * lineHeight + padding * 2

  // ボックスの左上座標を計算（中央から折り返し）
  const boxX = centerX - boxWidth / 2
  const boxY = centerY - boxHeight / 2

  // テキストを描画（ボックス内で左揃え）
  ctx.fillStyle = '#333333'
  const textX = boxX + padding
  let textY = boxY + padding + lineHeight / 2

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], textX, textY)
    textY += lineHeight
  }

  return { boxX, boxY, boxWidth, boxHeight }
}

// 角丸四角形を描画する関数
function roundRect(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  if (width < 2 * radius) radius = width / 2
  if (height < 2 * radius) radius = height / 2

  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()

  return ctx
}

// 角丸の表を描画する関数
function drawRoundedTable(
  ctx: SKRSContext2D,
  data: string[][],
  x: number,
  y: number,
  width: number,
  rowHeight: number,
  headerHeight: number,
  radius: number,
) {
  // パラメータの設定
  const firstRowHeight = headerHeight
  const colWidth = width / data[0].length
  const totalHeight = firstRowHeight + rowHeight

  // 表全体の背景（角丸あり）
  ctx.fillStyle = 'white'
  roundRect(ctx, x, y, width, totalHeight, radius).fill()

  // ヘッダー行の背景色
  ctx.fillStyle = '#50A0B4'
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + firstRowHeight, radius)
  ctx.arcTo(x + width, y + firstRowHeight, x, y + firstRowHeight, 0)
  ctx.arcTo(x, y + firstRowHeight, x, y, 0)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
  ctx.fill()

  // 表のセルと境界線を描画
  ctx.strokeStyle = '#333333'
  ctx.lineWidth = 1

  // ヘッダーテキスト
  ctx.fillStyle = 'white'
  ctx.font = '26px NotoSansJP-Bold'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  // ヘッダー行を描画
  for (let i = 0; i < data[0].length; i++) {
    const cellX = x + i * colWidth

    // セルの境界線（最初と最後のセルの外側の境界は描画しない）
    if (i > 0) {
      ctx.beginPath()
      ctx.moveTo(cellX, y)
      ctx.lineTo(cellX, y + firstRowHeight)
      ctx.stroke()
    }

    // セルの中央座標を計算
    const cellCenterX = cellX + colWidth / 2
    const cellCenterY = y + firstRowHeight / 2

    // 文字を中央に描画
    ctx.fillText(data[0][i], cellCenterX, cellCenterY)
  }

  // ヘッダーと本体の区切り線
  ctx.beginPath()
  ctx.moveTo(x, y + firstRowHeight)
  ctx.lineTo(x + width, y + firstRowHeight)
  ctx.stroke()

  // データ行のテキスト色
  ctx.fillStyle = '#333333'
  ctx.font = '40px NotoSansJP-Bold' // データ行のフォントサイズを調整

  // データ行を描画
  let currentY = y + firstRowHeight

  for (let j = 1; j < data.length; j++) {
    ctx.fillStyle = 'white'

    // 最後の行の場合は下部を丸くする
    if (j === data.length - 1) {
      ctx.beginPath()
      ctx.moveTo(x, currentY)
      ctx.arcTo(x + width, currentY, x + width, currentY + rowHeight, 0)
      ctx.arcTo(
        x + width,
        currentY + rowHeight,
        x,
        currentY + rowHeight,
        radius,
      )
      ctx.arcTo(x, currentY + rowHeight, x, currentY, radius)
      ctx.arcTo(x, currentY, x + width, currentY, 0)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.fillRect(x, currentY, width, rowHeight)
    }

    // セルの描画
    ctx.fillStyle = '#333333'

    for (let i = 0; i < data[j].length; i++) {
      const cellX = x + i * colWidth

      // セルの縦の境界線（最初と最後のセルの外側の境界は描画しない）
      if (i > 0) {
        ctx.beginPath()
        ctx.moveTo(cellX, currentY)
        ctx.lineTo(cellX, currentY + rowHeight)
        ctx.stroke()
      }

      // セルの中央座標を計算
      const cellCenterX = cellX + colWidth / 2
      const cellCenterY = currentY + rowHeight / 2 - 5 // 文字の位置を微調整

      // 文字を中央に描画（textAlign と textBaseline を使用）
      ctx.fillText(data[j][i], cellCenterX, cellCenterY)
    }

    // 行の下部に横線を描画（最後の行を除く）
    if (j < data.length - 1) {
      ctx.beginPath()
      ctx.moveTo(x, currentY + rowHeight)
      ctx.lineTo(x + width, currentY + rowHeight)
      ctx.stroke()
    }

    // 次の行のY位置を更新
    currentY += rowHeight
  }

  // 表全体の外枠を描画（角丸あり）
  ctx.strokeStyle = '#333333'
  roundRect(ctx, x, y, width, totalHeight, radius).stroke()
}
