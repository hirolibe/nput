const generateHeadingId = (text: string, index: number) => {
  const baseId = text.toLowerCase().replace(/\s+/g, '-') // 文字列をIDとして変換
  return index ? `${baseId}-${index}` : baseId // 同じ文字列の見出しを区別したIDの生成
}

export default generateHeadingId
