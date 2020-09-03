function flyingBoyHandler() {
  console.log("works");
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