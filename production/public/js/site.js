function modalHandlers() {
  const modalOverlay = document.getElementById('modal-overlay')
  const modals = [...document.getElementsByClassName('modal')]
  const laraModal = document.getElementById('lara-modal')
  const nadiaModal = document.getElementById('nadia-modal')
  const closeButtons = [...document.getElementsByClassName('close')]

  document.getElementById('show-more-lara').addEventListener('click', () => {
    modalOverlay.classList.toggle('closed')
    laraModal.classList.toggle('closed')
  })

  document.getElementById('show-more-nadia').addEventListener('click', () => {
    modalOverlay.classList.toggle('closed')
    nadiaModal.classList.toggle('closed')
  })
  ;[modalOverlay, ...closeButtons].forEach(c =>
    c.addEventListener('click', () => {
      modalOverlay.classList.toggle('closed')
      modals.forEach(m => m.classList.add('closed'))
    })
  )
}

function subscriptionHandler() {
  const emailSubmit = document.getElementById('email-submit')
  emailSubmit.addEventListener('click', () => {
    const email = document.getElementById('email').value
    console.log('submiting ' + email)
    DB.post('subscribers', { email: email })
      .then(docRef => {
        console.log('Document written with ID: ', docRef.id)
      })
      .catch(error => {
        console.error('Error adding document: ', error)
      })
  })
}

function initEventHanlders() {
  flyingBoyHandler()
  modalHandlers()
  subscriptionHandler()
}

function flyingBoyHandler() {
  if (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  ) {
    let observer = new IntersectionObserver(entries => {
      if (entries[0].boundingClientRect.y < 0) {
        document.getElementById('flying-boy').classList.remove('hidden')
      } else {
        document.getElementById('flying-boy').classList.add('hidden')
      }
    })

    observer.observe(document.querySelector('#flying-boy-appearance-trigger'))
  }
}

document.onload = initEventHanlders()
