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

}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemAPI = (event) => {
  /** source: https://stackoverflow.com/questions/6856871/getting-the-parent-div-of-element */
  const item = event.target.parentNode;
  console.log(item);
  fetch('https://api.mercadolibre.com/items/$')
    .then((request) => request)
    .then((response) => {
      response.json();
      console.log(response);
    });
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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
