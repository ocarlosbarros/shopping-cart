const shoppigCart = [];

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const sectionItems = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  sectionItems.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

/** Source: Utilizei com referência o repositório da Anna Hamann para somar os valores */
const getTotalPrice = () => {
  const totalPrice = document.querySelector('.total-price');
  const items = document.querySelectorAll('.cart__item');
  let sum = 0;
  items.forEach((item) => {
    const price = (item.innerText).split('$')[1];
    sum += parseFloat(price);
  });
  totalPrice.innerText = `${sum}`;
};

const saveShopping = () => {
  /** Source: https://pt.stackoverflow.com/questions/329223/armazenar-um-array-de-objetos-em-um-local-storage-com-js */
  localStorage.setItem('shoppingCart', JSON.stringify(shoppigCart));
  getTotalPrice();
};

const emptyCart = () => {
  const btnClearCart = document.querySelector('.empty-cart');
  btnClearCart.addEventListener('click', () => {
    document.querySelectorAll('.cart__item').forEach((li) => li.remove());
  });
};

function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
  saveShopping();
  getTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const saveItemInCart = (product) => {
  const list = document.querySelector('.cart__items');
  const li = createCartItemElement(product);
  list.appendChild(li);
  shoppigCart.push(product);
  saveShopping();
};

const loadShopping = async () => {
  const cartItems = JSON.parse(localStorage.getItem('shoppingCart'));
  if (cartItems !== null) {
    cartItems.forEach((product) => {
      saveItemInCart(product);
      getTotalPrice();
    });
  }
};

const getItemAPI = async (event) => {
  /** source: https://stackoverflow.com/questions/6856871/getting-the-parent-div-of-element */
  const item = event.target.parentNode;
  const itemID = getSkuFromProductItem(item);
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const product = await response.json();
  createCartItemElement({ sku: product.id, name: product.title, salePrice: product.price });
  saveItemInCart(product);
  saveShopping();
  getTotalPrice();
};

const addCart = () => {
  const btnAddItem = document.querySelectorAll('.item__add');
  btnAddItem.forEach((btnAdd) => {
    btnAdd.addEventListener('click', getItemAPI);
  });
  getTotalPrice();
};

const loadingResponse = () => {
  const loading = document.getElementById('loading');
  loading.innerText = 'loading.';
  return loading;
};

const getProducts = async (product) => {
  const BASE_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const loading = loadingResponse();
  try {
    const productListAPI = await fetch(BASE_URL);
    const productsListJson = await productListAPI.json();
    productsListJson.results.forEach(({ id: sku, title: name, thumbnail: image }) =>
      createProductItemElement({ sku, name, image }));
    addCart();
    loading.remove();
  } catch (error) {
    console.log(error);
  }
};

window.onload = async () => {
  await getProducts('computador');
  loadShopping();
  emptyCart();
};
