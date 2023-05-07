const browserEnv = require('browser-env');
browserEnv(['navigator', 'self']);
const {createStorefrontClient, InMemoryCache} = require('@shopify/hydrogen');
const {createRequestHandler} = require('@remix-run/express');
const {createCookieSessionStorage} = require('@shopify/remix-oxygen');
const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const BUILD_DIR = path.join(process.cwd(), 'build');
const app = express();

const env = process.env;

const port =
  process.env.PORT || (process.env.NODE_ENV === 'development' ? 3456 : 8080);
app.use(compression());
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/build', express.static('public/build', {cacheControl: 'no-cache'}));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', {cacheControl: 'no-cache'}));
app.use(morgan('dev'));

app.all('*', async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    purgeRequireCache();
  }

  let session = await HydrogenSession.init(req, [env.SESSION_SECRET]);
  let cache = new InMemoryCache();
  /**
   * Create Hydrogen's Storefront client.
   */
  const {storefront} = createStorefrontClient({
    cache,
    i18n: {language: 'EN', country: 'US'},
    publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
    storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
    storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2023-04',
    storefrontId: env.PUBLIC_STOREFRONT_ID,
  });

  /**
   * Create a Remix request handler and pass
   * Hydrogen's Storefront client to the loader context.
   */
  return createRequestHandler({
    build: require(BUILD_DIR),
    mode: process.env.NODE_ENV,
    getLoadContext: () => ({storefront, env, session}),
  })(req, res, next);
});

app.listen(port, () => {
  console.log(`Express server start on http://localhost:${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
class HydrogenSession {
  constructor(sessionStorage, session) {
    this.sessionStorage = sessionStorage;
    this.session = session;
  }

  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.cookies);
    return new this(storage, session);
  }

  get(key) {
    return this.session.get(key);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  flash(key, value) {
    this.session.flash(key, value);
  }

  unset(key) {
    this.session.unset(key);
  }

  set(key, value) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}
