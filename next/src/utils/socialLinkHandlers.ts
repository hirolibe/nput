export const shareToX = (url: string) =>
  openLink(`https://x.com/intent/tweet?url=${url}`)

export const shareToFacebook = (url: string) =>
  openLink(`https://www.facebook.com/sharer/sharer.php?u=${url}`)

export const shareToHatena = (url: string) =>
  openLink(`https://b.hatena.ne.jp/entry/${url}`)

export const goToUserX = (xLink: string) => () =>
  openLink(`https://x.com/${xLink}`)

export const goToUserGithub = (githubLink: string) => () =>
  openLink(`https://github.com/${githubLink}`)

export const openLink = (url: string | undefined) => {
  if (!url) return

  window.open(encodeURI(url), '_blank')
}
