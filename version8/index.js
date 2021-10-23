import ArcText from 'arc-text'

window.onload = () => {
  const title = document.querySelector('header h1')
  const arcTitle = new ArcText(title)
  arcTitle.arc(360)
}
