import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import PlantPage from './pages/plant-page';

declare const process: {
  env: {
    PUBLIC_PATH?: string;
  };
};

const BASE_PATH = (process.env.PUBLIC_PATH || '/').replace(/\/$/, '');

class Router {
  static catalogPage: CatalogPage;
  static cartPage: CartPage;
  static plantPage: PlantPage;
  static errorPage: ErrorPage;

  constructor(cart: Cart) {
    Router.catalogPage = new CatalogPage(cart);
    Router.cartPage = new CartPage(cart);
    Router.plantPage = new PlantPage(cart);
    Router.errorPage = new ErrorPage(cart);
  }

  static render(pathname: string) {
    const path = pathname.replace(BASE_PATH, '') || '/';

    switch (path) {
      case PagesList.catalogPage:
        Router.catalogPage.draw();
        break;
      case PagesList.cartPage:
        Router.cartPage.draw();
        break;
      case '/':
        Router.catalogPage.draw();
        break;
      default:
        if (isPlantsId(path)) {
          Router.plantPage.draw(path.slice(1));
        } else {
          Router.errorPage.draw();
        }
        break;
    }
    Router.changeLinks();
  }

  static goTo(pageId: string) {
    const fullPath = `${BASE_PATH}${pageId}`;
    window.history.pushState({ pageId }, pageId, fullPath);
    Router.render(fullPath);
    window.scrollTo(0, 0);
  }

  static changeLinks() {
    const links = document.querySelectorAll('[href^="/"]');
    links.forEach((link) => {
      if (!link.classList.contains('link-changed')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (link instanceof HTMLAnchorElement) {
            const linkPath = new URL(link.href).pathname.replace(BASE_PATH, '') || '/';
            const currentPath = new URL(window.location.href).pathname.replace(BASE_PATH, '') || '/';
            if (linkPath !== currentPath) {
              Router.goTo(linkPath === '/' ? PagesList.catalogPage : linkPath);
            }
          }
        });
        link.classList.add('link-changed');
      }
    });
  }

  static startRouter() {
    window.addEventListener('popstate', () => {
      Router.render(new URL(window.location.href).pathname);
    });
    const page = new URL(window.location.href).pathname;
    Router.render(page);
  }
}

export default Router;
