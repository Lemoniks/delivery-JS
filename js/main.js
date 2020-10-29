'use strict';


// variables

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInform = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants  = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');


// authorized

let login = localStorage.getItem('user');


function validName(str) {
  const RegName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/;
  return RegName.test(str)
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  if (modalAuth.classList.contains('is-open')) {
    disabledScroll();
  } else {
    enableScroll();
  }
}

function authorized() {
  console.log('Авторизован!');
  function logOut() {
    login = '';
    localStorage.removeItem('user');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();

  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
  
}

function notAuthorized() {
  console.log('Не авторизован!');

  function logIn(event) {
    event.preventDefault();
    if (validName(loginInput.value)) {
      login = loginInput.value;
      localStorage.setItem('user', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInform.removeEventListener('submit', logIn);
      logInform.reset();
      checkAuth();
    } else {
      alert('Введите логин :)');
      loginInput.style.borderColor = 'red';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInform.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function(event) {
    if (event.target.classList.contains('is-open')) {
      toggleModalAuth()
    }
  })
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized()
  }
}



// generation cards restaurants

function createCardRestaurant() {
  const card = `
  <a class="card card-restaurant">
    <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Тануки</h3>
        <span class="card-tag tag">60 мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 1 200 ₽</div>
        <div class="category">Суши, роллы</div>
      </div>
    </div>
  </a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}



function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-hawaiian.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Гавайская</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, ананасы</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">440 ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);

}

function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if (restaurant && login){
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    createCardGood();
    createCardGood();
    createCardGood();
  } else {
    toggleModalAuth();
  }
}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function(){
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant(); 


// swiper - slider

new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'flip',
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
});