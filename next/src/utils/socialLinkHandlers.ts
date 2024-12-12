export const shareToX = () =>
  openLink(`https://x.com/intent/tweet?url=${window.location.href}`)

export const shareToFacebook = () =>
  openLink(
    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
  )

export const shareToHatena = () =>
  openLink(`https://b.hatena.ne.jp/entry/${window.location.href}`)

export const goToAuthorX = (xLink: string) => () => openLink(xLink)

export const goToAuthorGithub = (githubLink: string) => () =>
  openLink(githubLink)

export const openLink = (url: string | undefined) => {
  if (!url) return

  window.open(encodeURI(url), '_blank')
}
