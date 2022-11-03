import { History } from './base.js';
import { cleanPath } from '../util/path.js';
import { START } from '../util/route.js';
import { setupScroll, handleScroll } from '../util/scroll.js';
import { pushState, replaceState, supportsPushState } from '../util/push-state.js';

/*  */

class HTML5History extends History {
  

  constructor (router, base) {
    super(router, base);

    this._startLocation = getLocation(this.base);
  }

  setupListeners () {
    if (this.listeners.length > 0) {
      return
    }

    const router = this.router;
    const expectScroll = router.options.scrollBehavior;
    const supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      this.listeners.push(setupScroll());
    }

    const handleRoutingEvent = () => {
      const current = this.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      const location = getLocation(this.base);
      if (this.current === START && location === this._startLocation) {
        return
      }

      this.transitionTo(location, route => {
        if (supportsScroll) {
          handleScroll(router, route, current, true);
        }
      });
    };
    window.addEventListener('popstate', handleRoutingEvent);
    this.listeners.push(() => {
      window.removeEventListener('popstate', handleRoutingEvent);
    });
  }

  go (n) {
    window.history.go(n);
  }

  push (location, onComplete, onAbort) {
    const { current: fromRoute } = this;
    this.transitionTo(location, route => {
      pushState(cleanPath(this.base + route.fullPath));
      handleScroll(this.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  }

  replace (location, onComplete, onAbort) {
    const { current: fromRoute } = this;
    this.transitionTo(location, route => {
      replaceState(cleanPath(this.base + route.fullPath));
      handleScroll(this.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  }

  ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      const current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  }

  getCurrentLocation () {
    return getLocation(this.base)
  }
}

function getLocation (base) {
  let path = window.location.pathname;
  const pathLowerCase = path.toLowerCase();
  const baseLowerCase = base.toLowerCase();
  // base="/a" shouldn't turn path="/app" into "/a/pp"
  // https://github.com/vuejs/vue-router/issues/3555
  // so we ensure the trailing slash in the base
  if (base && ((pathLowerCase === baseLowerCase) ||
    (pathLowerCase.indexOf(cleanPath(baseLowerCase + '/')) === 0))) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

export { HTML5History, getLocation };
