/* eslint-disable no-undef */
import './style.css'
import './tooltip.css'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import axios from 'axios'
import { firebaseConfig } from './firebaseConfig'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const auth = getAuth(app)

const showElement = (elem) => {
  document.querySelector(elem).classList.remove('hide')
}

const hideElement = (elem) => {
  document.querySelector(elem).classList.add('hide')
}

const showMessage = (status, message, showActions) => {
  const elem = document.querySelector('#message')
  elem.classList.add(status === 'sucsses' ? 'sucsses' : 'error')
  elem.classList.remove(status === 'sucsses' ? 'error' : 'sucsses')
  elem.textContent = message || ''
  showElement('#message')
  showActions ? showElement('#messageActions') : hideElement('#messageActions')
}

const copyToClipboard = () => {
  const range = document.createRange()
  range.selectNode(document.querySelector('#message'))
  window.getSelection().removeAllRanges()
  window.getSelection().addRange(range)
  document.execCommand('copy')
  window.getSelection().removeAllRanges()
  const elem = document.querySelector('#copyShortUrl')
  elem.classList.remove('hide-tooltip')
  elem.classList.add('show-tooltip')
  setTimeout(() => {
    const elem = document.querySelector('#copyShortUrl')
    elem.classList.remove('show-tooltip')
    elem.classList.add('hide-tooltip')
  }, 2000)
}

const creatShortLink = async () => {
  try {
    const response = await axios.post(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${firebaseConfig.apiKey}`,
      {
        dynamicLinkInfo: {
          domainUriPrefix: 'https://pend.app/link',
          link: document.querySelector('#deepLinkUrl').value
        }
      })
    hideElement('#shortUrlForm')
    showMessage('sucsses', response?.data?.shortLink, true)
  } catch (errors) {
    hideElement('#shortUrlForm')
    showMessage('error', JSON.stringify(errors))
  }
}

document.querySelector('#submitShortUrlFormButton').addEventListener('click', event => {
  creatShortLink()
})

document.querySelector('#showShortUrlForm').addEventListener('click', event => {
  event.preventDefault()
  hideElement('#message')
  hideElement('#messageActions')
  showElement('#shortUrlForm')
})

document.querySelector('#copyShortUrl').addEventListener('click', event => {
  event.preventDefault()
  copyToClipboard()
})

document.querySelector('button').addEventListener('click', function () {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.log(token)
  })
});

(() => {
  const uiConfig = {

    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        showElement('#shortUrlForm')
        return false
      }
    },
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID
    ],
    tosUrl: '',
    privacyPolicyUrl: ''
  }

  // Initialize the FirebaseUI Widget using Firebase.
  const ui = new firebaseui.auth.AuthUI(auth)
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig)
})()
