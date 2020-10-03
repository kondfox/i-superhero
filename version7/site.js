function flyingBoyHandler() {
  appearanceHandler();
  // scrollHandler();
}

function scrollHandler() {
  // const startY = document.getElementById('idea').getBoundingClientRect().y;
  const startY = 100;
  const boy = document.getElementById('hero-img');
  const originalBoyHeight = boy.getBoundingClientRect().height;
  window.addEventListener('scroll', (e) => {
    let y = window.scrollY;
    let screenHeight = window.innerHeight;
    let distance = y;
    if (y >= startY) {
      boy.animate({
        height: '100px',
        transform
      }, 200);
      setTimeout(() => boy.style.height = '100px', 200)
    } else {
      boy.animate({height: `${originalBoyHeight}px`}, 200);
      setTimeout(() => boy.style.height = `${originalBoyHeight}px`, 200)
    }
  });
}

function appearanceHandler() {
  if (
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype
  ) {
    let observer = new IntersectionObserver(entries => {
      if (entries[0].boundingClientRect.y < 0) {
        document.getElementById("flying-boy").classList.remove("hidden");
      } else {
        document.getElementById("flying-boy").classList.add("hidden");
      }
    });
  
    observer.observe(document.querySelector("#flying-boy-appearance-trigger"));
  }
}

document.onload = flyingBoyHandler();