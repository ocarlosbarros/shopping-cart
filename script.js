let shoppigCart = [];
let productsLocalList = [];

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveShopping = () => {
  /** Source: https://pt.stackoverflow.com/questions/329223/armazenar-um-array-de-objetos-em-um-local-storage-com-js */
  localStorage.setItem('shoppingCart', JSON.stringify(shoppigCart));
};

const addButton = () => {
  const btnClearCart = document.querySelector('.empty-cart');
  btnClearCart.addEventListener('click', () => {
    localStorage.clear();
    document.querySelectorAll('.cart__item').forEach((li) => li.remove());
  });
};

function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
  const itemID = item.innerText.slice(5, 18);
  shoppigCart = shoppigCart.filter((product) => product.id !== itemID);
  saveShopping();
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
  JSON.parse(localStorage.getItem('shoppingCart')).forEach((product) => {
    saveItemInCart(product);
  });
};

const getTotalPrice = () => {
  const currentTotal = JSON.parse(localStorage.getItem('shoppingCart'));
  const cart = document.querySelector('.cart');
  const p = document.createElement('p');
  const totalPrice = currentTotal === null ? 0 : 1;
  p.innerText = `Preço total: ${totalPrice}`;
  p.classList.add('total-price');
  cart.appendChild(p);
};

const getItemAPI = async (event) => {
  /** source: https://stackoverflow.com/questions/6856871/getting-the-parent-div-of-element */
  const item = event.target.parentNode;
  const itemID = getSkuFromProductItem(item);
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const product = await response.json();
  saveItemInCart(product);
};

const addCart = () => {
  const btnAddItem = document.querySelectorAll('.item__add');
  btnAddItem.forEach((btnAdd) => {
    btnAdd.addEventListener('click', getItemAPI);
  });
};

const fillProductsList = async () => {
  const sectionItems = document.querySelector('.items');
  productsLocalList.forEach((product) => {
    const section = createProductItemElement(product);
    sectionItems.appendChild(section);
  });
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
    loading.remove();
    productsLocalList = productsListJson.results;
  } catch (error) {
    console.log(error);
  }
};

window.onload = async () => {
  await getProducts('computador');
  fillProductsList();
  addCart();
  loadShopping();
  addButton();
  getTotalPrice();
};
