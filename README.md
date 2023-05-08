## How to patch the Hydrogen with Oxgen deployment to use Express:
1. Patch the original `server.ts` or `server.js` file with the one from this repo.
2. Patch the `remix.config.js` file with the one from this repo.
3. Remove the `app/entry.server.ts` file.
4. Add `.env` file.
5. Patch the package.json with following json data:

```json
  {
    "scripts": {
      "build": "remix build",
      "start": "cross-env NODE_ENV=production node --require dotenv/config ./server.js",
      "preview": "npm run build && npm run start",
    },
    "dependencies": {
      "@remix-run/express": "^1.16.0",
      "@remix-run/node": "^1.16.0",
      "@weaverse/hydrogen": "1.0.36",
      "express": "^4.18.2",
    }
  }
```
