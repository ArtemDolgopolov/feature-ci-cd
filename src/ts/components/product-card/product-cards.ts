import { Products } from '../../base/types';
import { isHTMLElement, getExistentElement, setAddButton } from '../../base/helpers';
import Cart from '../cart';
import Router from '../../router';

class ProductCards {
  public cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart;
  }

  draw(data: Products[]): void {
    const productCard: Products[] = data;
    const fragment: DocumentFragment = document.createDocumentFragment();
    const productCardTemp: HTMLTemplateElement = getExistentElement<HTMLTemplateElement>('#productCardTemp');

    productCard.forEach((item, index) => {
      const productCardClone: Node = productCardTemp.content.cloneNode(true);
      if (!isHTMLElement(productCardClone)) throw new Error(`Element is not HTMLElement!`);

      const photo = getExistentElement('.product__photo', productCardClone);
      const img = document.createElement('img');
      img.className = 'product__photo-img';
      img.src = `assets/img/${item.thumbnail}`;
      img.alt = item.title;
      img.width = 400;
      img.height = 225;
      img.decoding = 'async';
      photo.prepend(img);

      if (index === 0) {
        img.setAttribute('fetchpriority', 'high');
      } else if (index >= 3) {
        img.loading = 'lazy';
      }

      getExistentElement('.product__type', productCardClone).textContent = item.type;
      getExistentElement('.product__title', productCardClone).textContent = item.title;
      getExistentElement('.product__description', productCardClone).textContent = item.description;
      getExistentElement('.product__price', productCardClone).textContent = item.price.toString();
      getExistentElement('.product__stock-num', productCardClone).textContent = item.stock.toString();
      getExistentElement('.product__rating-num', productCardClone).textContent = item.rating.toString();

      if (item.sale) {
        getExistentElement('.product__discount-num', productCardClone).textContent = item.sale.toString();
        getExistentElement('.product__price', productCardClone).style.color = '#22795D';
      } else {
        getExistentElement('.product__discount', productCardClone).style.display = 'none';
      }
      getExistentElement('.product__title', productCardClone).addEventListener('click', function () {
        Router.goTo(`/${item.id}`);
      });

      const button = getExistentElement<HTMLElement>('button', productCardClone);
      setAddButton(button, this.cart, item);

      getExistentElement('.product', productCardClone).addEventListener('click', (e) => {
        e.target !== button ? Router.goTo(`/${item.id}`) : null;
      });

      fragment.append(productCardClone);
    });
    getExistentElement('.products__container').appendChild(fragment);
  }
}

export default ProductCards;
