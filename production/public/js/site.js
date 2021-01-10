const dbConfig = {
  apiKey:
    'AAAADRxIfpU:APA91bHIlfAJ9j-6bnF1gwAT2aUsK2OiugWUCwIWgOuxgZoiIA5l6_9sXQK0JYOeBP2pZkWyU1BxZaLO8DtII70yV-N0W0vY-zkW9zyncaz8I4EHsgS_-tWV8Eis_5E7PsB5u7BNc8BW',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
}

function initEventHanlders() {
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

  // if (location.hostname === 'localhost') {
  //   db.useEmulator('localhost', 8080)
  // }
  const emailSubmit = document.getElementById('email-submit')
  if (!emailSubmit.classList.contains('disabled')) {
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

  flyingBoyHandler()
}

function scrollHandler() {
  // const startY = document.getElementById('idea').getBoundingClientRect().y;
  const startY = 100
  const boy = document.getElementById('hero-img')
  const originalBoyHeight = boy.getBoundingClientRect().height
  window.addEventListener('scroll', e => {
    let y = window.scrollY
    let screenHeight = window.innerHeight
    let distance = y
    if (y >= startY) {
      boy.animate(
        {
          height: '100px',
          transform,
        },
        200
      )
      setTimeout(() => (boy.style.height = '100px'), 200)
    } else {
      boy.animate({ height: `${originalBoyHeight}px` }, 200)
      setTimeout(() => (boy.style.height = `${originalBoyHeight}px`), 200)
    }
  })
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
