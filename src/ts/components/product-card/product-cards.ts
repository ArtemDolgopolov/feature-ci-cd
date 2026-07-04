import { Products } from '../../base/types';
import { isHTMLElement, getExistentElement, setAddButton } from '../../base/helpers';
import Cart from '../cart';
import Router from '../../router';

class ProductCards {
  public cart: Cart;
  private photoObserver: IntersectionObserver | null = null;

  constructor(cart: Cart) {
    this.cart = cart;
  }

  private observePhotos(container: HTMLElement): void {
    if (!this.photoObserver) {
      this.photoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const photo = entry.target as HTMLElement;
            const bg = photo.dataset.bg;

            if (bg) {
              photo.style.backgroundImage = `url('${bg}')`;
              photo.dataset.loaded = 'true';
            }

            this.photoObserver?.unobserve(entry.target);
          });
        },
        { rootMargin: '200px 0px' }
      );
    }

    container.querySelectorAll('.product__photo:not([data-loaded])').forEach((photo) => {
      this.photoObserver?.observe(photo);
    });
  }

  draw(data: Products[]): void {
    const productCard: Products[] = data;
    const fragment: DocumentFragment = document.createDocumentFragment();
    const productCardTemp: HTMLTemplateElement = getExistentElement<HTMLTemplateElement>('#productCardTemp');

    productCard.forEach((item) => {
      const productCardClone: Node = productCardTemp.content.cloneNode(true);
      if (!isHTMLElement(productCardClone)) throw new Error(`Element is not HTMLElement!`);

      getExistentElement('.product__photo', productCardClone).dataset.bg = `assets/img/${item.thumbnail}`;

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
    const container = getExistentElement('.products__container');
    container.appendChild(fragment);
    this.observePhotos(container);
  }
}

export default ProductCards;
