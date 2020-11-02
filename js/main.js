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
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

const cart = [];

// authorized

let login = localStorage.getItem('user');


const getData = async function(url) {

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error from addresses ${url}, status ${response.status}!`)
  }
  return await response.json()
};

getData('./db/partners.json');

const validName = function(str) {
  const RegName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/;
  return RegName.test(str)
};

const toggleModal = function() {
  modal.classList.toggle("is-open");
};

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  if (modalAuth.classList.contains('is-open')) {
    disabledScroll();
  } else {
    enableScroll();
  }
};

const authorized = function() {
  console.log('Авторизован!');
  function logOut() {
    login = '';
    localStorage.removeItem('user');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();

  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
  
};

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

function createCardRestaurant({ image, kitchen, name, price, time_of_delivery:timeOfDelivery, stars, products }) {
  const cardsRestaurant = document.createElement('a');
  cardsRestaurant.className = 'card card-restaurant';
  cardsRestaurant.products = products;
  cardsRestaurant.info = { kitchen, name, price, stars };


  const card = `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} грн</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `;
  cardsRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardsRestaurant);

};

function createCardGood({ description, id, image, name, price }) {
  
  
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold cart-price">${price} грн</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};

function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if (restaurant && login){
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    const { name, kitchen, price, stars } = restaurant.info;

    restaurantTitle.textContent = name;
    restaurantRating.textContent = stars;
    restaurantPrice.textContent = `От ${price} грн`;
    restaurantCategory.textContent = kitchen;

    getData(`./db/${restaurant.products}`).then(function(data){
      data.forEach(createCardGood);

    });
  } else {
    toggleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.cart-price').textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(function(item) {
      return item.id === id;
    })

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart)
  });

  const totalPrice = cart.reduce(function(result, item) {
    return result + (parseFloat(item.cost)* item.count);
  }, 0);
  modalPrice.textContent = totalPrice + ' грн';

}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        const confirmed = confirm("Вы действительно хотите удалить позицию из корзины?");
        if (confirmed) {
          cart.splice(cart.indexOf(food), 1)
        }
      }
    }
    if (target.classList.contains('counter-plus')) food.count++;
    renderCart();
  }
}

function init() {
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant);
  });
  
  cartButton.addEventListener("click", function(){
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', function() {
    const confirmedCart = confirm("Вы действительно хотите удалить позицию из корзины?");
    if (confirmedCart) {
      cart.length = 0;
      renderCart();

    }
  })

  modalBody.addEventListener('click', changeCount)

  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function(){
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })
  
  checkAuth();


  inputSearch.addEventListener('keypress', function(event) {
    if (event.charCode === 13) {
      const value = event.target.value;

      if (!value) {
        return;

      }

      getData('./db/partners.json').then(function(data){
        return data.map(function(partner) {
          return partner.products;
        });
      })
      .then(function(linksProduct) {
        cardsMenu.textContent = '';
        linksProduct.forEach(function(link) {
          getData(`./db/${link}`)
          .then(function(data) {

            const resultSearch = data.filter(function(item) {
              const name = item.name.toLowerCase()
              return name.includes(value.toLowerCase());
            })
            
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');
                
            restaurantTitle.textContent = 'Search result:';
            restaurantRating.textContent = '';
            restaurantPrice.textContent = '';
            restaurantCategory.textContent = '';
            resultSearch.forEach(createCardGood);

          })
        })

      })
    }
  })
  
  
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
}

init();