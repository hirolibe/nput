export const shareToX = () =>
  openLink(`https://x.com/intent/tweet?url=${window.location.href}`)

export const shareToFacebook = () =>
  openLink(
    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
  )

export const shareToHatena = () =>
  openLink(`https://b.hatena.ne.jp/entry/${window.location.href}`)

export const goToUserX = (xLink: string) => () =>
  openLink(`https://x.com/${xLink}`)

export const goToUserGithub = (githubLink: string) => () =>
  openLink(`https://github.com/${githubLink}`)

export const openLink = (url: string | undefined) => {
  if (!url) return

  window.open(encodeURI(url), '_blank')
}
