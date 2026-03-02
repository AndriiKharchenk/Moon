fetch('includes/header.html')
  .then((res) => res.text())
  .then((data) => (document.querySelector('header').innerHTML = data));

fetch('includes/footer.html')
  .then((res) => res.text())
  .then((data) => (document.querySelector('footer').innerHTML = data));

const images = ['images/hero1.jpg', 'images/hero2.jpg', 'images/hero3.jpg', 'images/hero4.jpg', 'images/hero5.jpg'];

const hero = document.querySelector('.hero');

let index = 0;

function slide() {
  index = index + 1;

  if (index === images.length) {
    index = 0;
  }

  hero.style.backgroundImage = `url(${images[index]})`;
}

if (hero) {
  hero.style.backgroundImage = `url(${images[0]})`;

  setInterval(slide, 2500);
}

const forms = document.querySelectorAll('.js-open-modal');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.modal__close');

if (modal && forms.length && closeBtn) {
  forms.forEach((form) => {
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      modal.classList.add('active');
      form.reset();
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (evt) => {
    if (evt.target === modal) {
      modal.classList.remove('active');
    }
  });
}

const btnUp = document.querySelector('.btn__up');

if (btnUp) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btnUp.classList.add('show');
    } else {
      btnUp.classList.remove('show');
    }
  });

  btnUp.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}


const cards = document.querySelectorAll('.shop__card');
const filterInputs = document.querySelectorAll('.shop__filter input');

filterInputs.forEach((input) => {
  input.addEventListener('change', filterProducts);
});

function filterProducts() {
  const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'all';

  const selectedCategories = [...document.querySelectorAll('input[name="category"]:checked')].map((input) => input.value);

  const selectedPrices = [...document.querySelectorAll('input[name="price"]:checked')].map((input) => input.value);

  const selectedTags = [...document.querySelectorAll('input[name="tags"]:checked')].map((input) => input.value);

  cards.forEach((card) => {
    const colorMatch = selectedColor === 'all' || card.dataset.color === selectedColor;

    let categoryMatch = false;
    if (selectedCategories.length === 0) {
      categoryMatch = true;
    } else {
      selectedCategories.forEach((cat) => {
        if (card.dataset.category === cat) categoryMatch = true;
      });
    }

    let priceMatch = false;
    const cardPrice = Number(card.dataset.price);
    if (selectedPrices.length === 0) {
      priceMatch = true;
    } else {
      selectedPrices.forEach((range) => {
        if (checkPriceRange(range, cardPrice)) priceMatch = true;
      });
    }

    let tagsMatch = false;
    const cardTags = card.dataset.tags || '';
    if (selectedTags.length === 0) {
      tagsMatch = true;
    } else {
      selectedTags.forEach((tag) => {
        if (cardTags.includes(tag)) tagsMatch = true;
      });
    }

    if (colorMatch && categoryMatch && priceMatch && tagsMatch) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function checkPriceRange(range, price) {
  if (range === '> 200') return price > 200;
  const [min, max] = range.split(' - ').map(Number);
  return price >= min && price <= max;
}




const mainImage = document.querySelector('.product__main-img');
const thumbnails = document.querySelectorAll('.thumb');

thumbnails.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    mainImage.src = thumb.src;

    thumbnails.forEach((t) => t.classList.remove('active-slide'));

    thumb.classList.add('active-slide');
  });
});



const accordionItems = document.querySelectorAll('.product__accordion-item');

accordionItems.forEach((item) => {
  const btn = item.querySelector('.accordion___btn');
  const content = item.querySelector('.accordion__content');

  btn.addEventListener('click', () => {

    if (item.classList.contains('active-accordion')) {
      content.style.height = 0;
      item.classList.remove('active-accordion');
      return;
    }

    // закрываем остальные
    accordionItems.forEach((i) => {
      i.classList.remove('active-accordion');
      i.querySelector('.accordion__content').style.height = 0;
    });

    // открываем текущий
    item.classList.add('active-accordion');
    content.style.height = content.scrollHeight + 'px';
  });
});






// Контейнер корзины и элементы с суммами
const cartContainer = document.querySelector('.cart__inner');
const totalSubtotal = document.querySelector('.total__subtotal');
const totalCart = document.querySelector('.total__cart-total');

// Функция пересчёта всех сумм
function updateCartTotals() {
  let subtotal = 0;
  const cartItems = cartContainer.querySelectorAll('.cart__item');

  cartItems.forEach(item => {
    const priceEl = item.querySelector('.cart__price');
    const quantityInput = item.querySelector('.cart__quantity-input');
    const subtotalEl = item.querySelector('.cart__subtotal-gold');

    const price = parseFloat(priceEl.textContent.replace('$', ''));
    const quantity = parseInt(quantityInput.value) || 1;
    const itemSubtotal = price * quantity;

    subtotalEl.textContent = `$${itemSubtotal.toFixed(2)}`;
    subtotal += itemSubtotal;
  });

  totalSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  totalCart.textContent = `$${subtotal.toFixed(2)}`;
}

// Делегируем события на контейнер
cartContainer.addEventListener('click', (e) => {
  const target = e.target;
  const item = target.closest('.cart__item');
  if (!item) return;

  const input = item.querySelector('.cart__quantity-input');

  // Кнопка +
  if (target.classList.contains('qty__btn--plus')) {
    input.value = parseInt(input.value) + 1;
    updateCartTotals();
  }

  // Кнопка -
  if (target.classList.contains('qty__btn--minus')) {
    input.value = Math.max(1, parseInt(input.value) - 1);
    updateCartTotals();
  }

  // Кнопка удаления
  if (target.tagName === 'BUTTON' && target.parentElement.classList.contains('cart__delete')) {
    item.remove();
    updateCartTotals();
  }
});

// Обработка ручного ввода числа
cartContainer.addEventListener('input', (e) => {
  const target = e.target;
  if (target.classList.contains('cart__quantity-input')) {
    if (parseInt(target.value) < 1 || isNaN(target.value)) {
      target.value = 1;
    }
    updateCartTotals();
  }
});

// Инициализация при загрузке страницы
updateCartTotals();