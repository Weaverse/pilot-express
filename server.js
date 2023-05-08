const {createStorefrontClient, InMemoryCache} = require('@shopify/hydrogen');
const {createRequestHandler} = require('@remix-run/express');
const {createCookieSessionStorage} = require('@shopify/remix-oxygen');
const path = require('path');
const express = require('express');

const BUILD_DIR = path.join(process.cwd(), 'build');
const app = express();

const env = process.env;

const port = process.env.PORT || 3456;
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/build', express.static('public/build', {cacheControl: 'no-cache'}));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', {cacheControl: 'no-cache'}));

const countries = {
  default: {
    label: 'United States (USD $)',
    language: 'EN',
    country: 'US',
    currency: 'USD',
  },
  '/en-ad': {
    label: 'Andorra (EUR €)',
    language: 'EN',
    country: 'AD',
    currency: 'EUR',
  },
  '/en-at': {
    label: 'Austria (EUR €)',
    language: 'EN',
    country: 'AT',
    currency: 'EUR',
  },
  '/en-au': {
    label: 'Australia (AUD $)',
    language: 'EN',
    country: 'AU',
    currency: 'AUD',
  },
  '/en-be': {
    label: 'Belgium (EUR €)',
    language: 'EN',
    country: 'BE',
    currency: 'EUR',
  },
  '/en-ca': {
    label: 'Canada (CAD $)',
    language: 'EN',
    country: 'CA',
    currency: 'CAD',
  },
  '/en-cn': {
    label: 'China (CNY ¥)',
    language: 'EN',
    country: 'CN',
    currency: 'CNY',
  },
  '/en-cy': {
    label: 'Cyprus (EUR €)',
    language: 'EN',
    country: 'CY',
    currency: 'EUR',
  },
  '/en-de': {
    label: 'Germany (EUR €)',
    language: 'EN',
    country: 'DE',
    currency: 'EUR',
  },
  '/en-ee': {
    label: 'Estonia (EUR €)',
    language: 'EN',
    country: 'EE',
    currency: 'EUR',
  },
  '/en-es': {
    label: 'Spain (EUR €)',
    language: 'EN',
    country: 'ES',
    currency: 'EUR',
  },
  '/en-fi': {
    label: 'Finland (EUR €)',
    language: 'EN',
    country: 'FI',
    currency: 'EUR',
  },
  '/en-fr': {
    label: 'France (EUR €)',
    language: 'EN',
    country: 'FR',
    currency: 'EUR',
  },
  '/en-gb': {
    label: 'United Kingdom (GBP £)',
    language: 'EN',
    country: 'GB',
    currency: 'GBP',
  },
  '/en-gr': {
    label: 'Greece (EUR €)',
    language: 'EN',
    country: 'GR',
    currency: 'EUR',
  },
  '/en-id': {
    label: 'Indonesia (IDR Rp)',
    language: 'EN',
    country: 'ID',
    currency: 'IDR',
  },
  '/en-ie': {
    label: 'Ireland (EUR €)',
    language: 'EN',
    country: 'IE',
    currency: 'EUR',
  },
  '/en-in': {
    label: 'India (INR ₹)',
    language: 'EN',
    country: 'IN',
    currency: 'INR',
  },
  '/en-it': {
    label: 'Italy (EUR €)',
    language: 'EN',
    country: 'IT',
    currency: 'EUR',
  },
  '/en-jp': {
    label: 'Japan (JPY ¥)',
    language: 'EN',
    country: 'JP',
    currency: 'JPY',
  },
  '/en-kr': {
    label: 'South Korea (KRW ₩)',
    language: 'EN',
    country: 'KR',
    currency: 'KRW',
  },
  '/en-lt': {
    label: 'Lithuania (EUR €)',
    language: 'EN',
    country: 'LT',
    currency: 'EUR',
  },
  '/en-lu': {
    label: 'Luxembourg (EUR €)',
    language: 'EN',
    country: 'LU',
    currency: 'EUR',
  },
  '/en-lv': {
    label: 'Latvia (EUR €)',
    language: 'EN',
    country: 'LV',
    currency: 'EUR',
  },
  '/en-mc': {
    label: 'Monaco (EUR €)',
    language: 'EN',
    country: 'MC',
    currency: 'EUR',
  },
  '/en-me': {
    label: 'Montenegro (EUR €)',
    language: 'EN',
    country: 'ME',
    currency: 'EUR',
  },
  '/en-mt': {
    label: 'Malta (EUR €)',
    language: 'EN',
    country: 'MT',
    currency: 'EUR',
  },
  '/en-nl': {
    label: 'Netherlands (EUR €)',
    language: 'EN',
    country: 'NL',
    currency: 'EUR',
  },
  '/en-nz': {
    label: 'New Zealand (NZD $)',
    language: 'EN',
    country: 'NZ',
    currency: 'NZD',
  },
  '/en-pt': {
    label: 'Portugal (EUR €)',
    language: 'EN',
    country: 'PT',
    currency: 'EUR',
  },
  '/en-sg': {
    label: 'Singapore (SGD $)',
    language: 'EN',
    country: 'SG',
    currency: 'SGD',
  },
  '/en-si': {
    label: 'Slovenia (EUR €)',
    language: 'EN',
    country: 'SI',
    currency: 'EUR',
  },
  '/en-sk': {
    label: 'Slovakia (EUR €)',
    language: 'EN',
    country: 'SK',
    currency: 'EUR',
  },
  '/en-sm': {
    label: 'San Marino (EUR €)',
    language: 'EN',
    country: 'SM',
    currency: 'EUR',
  },
  '/en-th': {
    label: 'Thailand (THB ฿)',
    language: 'EN',
    country: 'TH',
    currency: 'THB',
  },
  '/en-va': {
    label: 'Vatican City (EUR €)',
    language: 'EN',
    country: 'VA',
    currency: 'EUR',
  },
  '/en-vn': {
    label: 'Vietnam (VND ₫)',
    language: 'EN',
    country: 'VN',
    currency: 'VND',
  },
  '/en-xk': {
    label: 'Kosovo (EUR €)',
    language: 'EN',
    country: 'XK',
    currency: 'EUR',
  },
};

function getLocaleFromRequest(request) {
  const url = new URL(
    request.protocol + '://' + request.get('host') + request.originalUrl,
  );
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
      };
}

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
    i18n: getLocaleFromRequest(req),
    publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
    storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
    storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2023-04',
    storefrontId: env.PUBLIC_STOREFRONT_ID,
  });

  res.set('Cross-Origin-Embedder-Policy', 'credentialless');
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
