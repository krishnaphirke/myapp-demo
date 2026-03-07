// =====================
// DARK MODE TOGGLE
// =====================
const themeBtn = document.querySelector('#themeBtn')

themeBtn.addEventListener('click', function() {
  document.body.classList.toggle('dark')
  // Change button emoji based on current mode
  themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙'
})


// =====================
// HAMBURGER MENU
// =====================
const hamburgerBtn = document.querySelector('#hamburgerBtn')
const mobileMenu   = document.querySelector('#mobileMenu')

hamburgerBtn.addEventListener('click', function() {
  mobileMenu.classList.toggle('open')
})

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    mobileMenu.classList.remove('open')
  })
})


// =====================
// ACCOUNT DROPDOWN
// =====================
const accountBtn      = document.querySelector('#accountBtn')
const accountDropdown = document.querySelector('#accountDropdown')

accountBtn.addEventListener('click', function(e) {
  e.stopPropagation()   // prevents the document click below from firing immediately
  accountDropdown.classList.toggle('open')
})

// Close dropdown when clicking anywhere else on the page
document.addEventListener('click', function() {
  accountDropdown.classList.remove('open')
})


// =====================
// MODAL / POPUP
// =====================
const openModalBtn  = document.querySelector('#openModalBtn')
const modalOverlay  = document.querySelector('#modalOverlay')
const closeModalBtn = document.querySelector('#closeModalBtn')
const closeModalBtn2= document.querySelector('#closeModalBtn2')

// Open
openModalBtn.addEventListener('click', function() {
  modalOverlay.classList.add('open')
})

// Close via X button
closeModalBtn.addEventListener('click', function() {
  modalOverlay.classList.remove('open')
})

// Close via "Got it" button
closeModalBtn2.addEventListener('click', function() {
  modalOverlay.classList.remove('open')
})

// Close by clicking the dark overlay background
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open')
})


// =====================
// CONTACT FORM
// =====================
const submitBtn   = document.querySelector('#submitBtn')
const formFeedback= document.querySelector('#formFeedback')
const nameInput   = document.querySelector('#nameInput')

submitBtn.addEventListener('click', function() {
  // Validation — stop if name is empty
  if (nameInput.value.trim() === '') {
    formFeedback.style.color = '#e94560'
    formFeedback.textContent = '⚠️ Please enter your name.'
    return
  }
  // Success feedback
  formFeedback.style.color = '#2ecc71'
  formFeedback.textContent = '✅ Thanks ' + nameInput.value + ', we\'ll be in touch!'
})
