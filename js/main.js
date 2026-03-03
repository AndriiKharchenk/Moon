fetch('includes/header.html')
  .then((res) => res.text())
  .then((data) => {
    document.querySelector('header').innerHTML = data;

    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.menu');
    const body = document.body;

    if (burger && menu) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('menu-open');
        menu.classList.toggle('menu-open');
        body.classList.toggle('no-scroll');
      });

      document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' && menu.classList.contains('menu-open')) {
          burger.classList.remove('menu-open');
          menu.classList.remove('menu-open');
          body.classList.remove('no-scroll');
        }
      });

      document.addEventListener('click', (evt) => {
        if (menu.classList.contains('menu-open') && !evt.target.closest('.menu') && !evt.target.closest('.burger')) {
          burger.classList.remove('menu-open');
          menu.classList.remove('menu-open');
          body.classList.remove('no-scroll');
        }
      });
    }
  });

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

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  const modal = document.querySelector('.modal');

  forms.forEach((form) => {
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (form.classList.contains('js-open-modal') && modal) {
        modal.classList.add('active');

        const closeBtn = modal.querySelector('.modal__close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
          });
        }

        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.remove('active');
        });
      }

      form.reset();
    });
  });
});

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

    accordionItems.forEach((i) => {
      i.classList.remove('active-accordion');
      i.querySelector('.accordion__content').style.height = 0;
    });

    item.classList.add('active-accordion');
    content.style.height = content.scrollHeight + 'px';
  });
});

const cartContainer = document.querySelector('.cart__inner');
const totalSubtotal = document.querySelector('.total__subtotal');
const totalCart = document.querySelector('.total__cart-total');

if (cartContainer && totalSubtotal && totalCart) {
  function updateCartTotals() {
    let subtotal = 0;
    const cartItems = cartContainer.querySelectorAll('.cart__item');

    cartItems.forEach((item) => {
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

  cartContainer.addEventListener('click', (e) => {
    const target = e.target;
    const item = target.closest('.cart__item');
    if (!item) return;

    const input = item.querySelector('.cart__quantity-input');

    if (target.classList.contains('qty__btn--plus')) {
      input.value = parseInt(input.value) + 1;
      updateCartTotals();
    }

    if (target.classList.contains('qty__btn--minus')) {
      input.value = Math.max(1, parseInt(input.value) - 1);
      updateCartTotals();
    }

    if (target.tagName === 'BUTTON' && target.parentElement.classList.contains('cart__delete')) {
      item.remove();
      updateCartTotals();
    }
  });

  cartContainer.addEventListener('input', (e) => {
    const target = e.target;
    if (target.classList.contains('cart__quantity-input')) {
      if (parseInt(target.value) < 1 || isNaN(target.value)) {
        target.value = 1;
      }
      updateCartTotals();
    }
  });

  updateCartTotals();
}

const btnFilter = document.querySelector('.shop__filter-btn');
const modalFilter = document.querySelector('.shop__filter-modal');
const body = document.body;
const closeBtnModal = document.querySelector('.shop__filter-close');

btnFilter.addEventListener('click', () => {
  modalFilter.classList.add('active');
  body.classList.add('no-scroll');
});

closeBtnModal.addEventListener('click', () => {
  modalFilter.classList.remove('active');
  body.classList.remove('no-scroll');
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && modalFilter.classList.contains('active')) {
    modalFilter.classList.remove('active');
    body.classList.remove('no-scroll');
  }
});

modalFilter.addEventListener('click', (e) => {
  if (e.target === modalFilter) {
    modalFilter.classList.remove('active');
    body.classList.remove('no-scroll');
  }
});