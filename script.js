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

let productsLocalList = [];

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveShopping = () => {
  const myShopping = localStorage();
  console.log(myShopping);
};

const saveItemInCart = (product) => {
  const list = document.querySelector('.cart__items');
  const li = createCartItemElement(product);
  list.appendChild(li);
  saveShopping();
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

const getProducts = async (product) => {
  const BASE_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const productListAPI = await fetch(BASE_URL);
  const productsListJson = await productListAPI.json();
  productsLocalList = productsListJson.results;
  console.log(productsLocalList);
};

window.onload = async () => {
  await getProducts('computador');
  fillProductsList();
  addCart();
};
