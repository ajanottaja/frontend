# Ajanottaja - A simple time keeping tool

This is the frontend of the [Ajanottaja time keeping tool](https://ajanottaja.app).
It is implemented in [React.js](https://reactjs.org/) using [Vite](https://vitejs.dev/) as a build tool.
The frontend runs on top of the [Supabase backend](https://github.com/ajanottaja/backend).

## Development

First clone the repository and create a local configuration file `.env.local` with the following content:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

Then install dependencies and run the development script:

```
bun install
bun run dev
```

## Testing

Tests are run using [Jest](https://jestjs.io/).
To run tests once off or in watch mode:

```
bun run test
bun run test -- --watch
```

## Building

To build production build and bake in the configuration in the static output first set the configuration values and then run build command:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
bun run build
```

### Docker (WIP)

A Docker file and image will eventually be provided.

## Hosting

As Ajanottaja's frontend is a simple single page app with static files you can host it in various ways.

### Edge network (Cloudflare Pages)

The "official" instance of Ajanottaja is hosted using [Cloudflare Pages](https://pages.cloudflare.com/).
It is a service that allows you to build and host sites at Cloudflare's edge network.
This gives users of [Ajanottaja.app](https://ajanottaja.app) low latency access to the client side app assets world wide.
Further more Cloudflare Pages scales effortlessly to as many users as needed.
To host Ajanottaja's frontend with Cloudflare Pages consider [mirroring](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/duplicating-a-repository#mirroring-a-repository-in-another-location) the repository and connect it to your Cloudflare Pages account.

Another great edge network hosting option is [Vercel](https://vercel.com/docs).

### Reverse proxies

You can build the static files and stick the `/dist` folder behind a reverse proxy.
A few good options include:

- [Traefik](https://traefik.io/traefik/)
- [Nginx](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)
- [Caddy](https://caddyserver.com/)

# License

Licensed under AGPLv3, see [License](/LICENSE).

In short this means you can:

1. Copy, run, and redistribute the code for free
2. Modify the code and run a public service, in which case source code MUST be released
3. Modify the code and run a private service (e.g. for yourself or your family) without releasing source code, but it is nice if you do
4. You must retain the copyright in any modified work

The AGPLv3 license was chosen to keep the project and any forks open for the public good.

## Rationale and philosophy

Initially the Ajanottaja frontend was to be built using ClojureScript.
This would facilitate code-sharing between the backend and frontend.
Especially shared schema models and routing library would have been a boon.
It turned out however that Figwheel's file watcher did not support the latest MacOS.
While interop is reasonably simple in ClojureScript, that too presents a bit of overhead.

In the end Vite with its modern and fast developer experience and TypeScript won out.
The end result is a slightly smaller bundle size and access to the latest functionality in React.

The code is built with a few main goals in mind:

### Validate and coerce or transform values at the edges.

Using the [superstruct](https://github.com/ianstormtaylor/superstruct) library it is possible to validate and coerce values.
When done at the edges, i.e. were you receive responses from the API, the rest of the app can use the values safely.

### Provide meaningful abstractions

Code wraps hooks like useSWR in meaninful abstractions to make code more readable.
Pages should not care how http calls are made or how data is validated.
Combining useSWR, the fetch function, and superstruct's validation provide a cohesive whole for fetching data.

### Only test meaningful application logic

Testing React virtual dom rendering is mostly wasteful.
It is better to test the functions that operate on or change data.
When the UI becomes more stable E2E browser tests can have value.
