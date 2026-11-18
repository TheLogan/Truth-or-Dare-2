import blue from './assets/img/cardBgBlue.jpg?url';
import pink from './assets/img/cardBgPink.jpg?url';
import gold from './assets/img/cardBgGold.jpg?url';
import bottle from './assets/img/wine-bottle.png?url';

// Card backgrounds are CSS background-images, which the browser only fetches
// once a card renders. Kick the requests off at startup so they're cached by then.
const urls = [blue, pink, gold, bottle];

export function preloadImages() {
  for (const url of urls) {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  }
}
