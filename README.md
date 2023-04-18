# vue-routes-utils

Regarding the utility function of routes in vue router

## Install

```bash
pnpm add vue-routes-utils --dev
# Or Yarn
yarn add vue-routes-utils --dev
```

## intersection

Compare the `name` field of routes and return a new route:

```ts
const routes = intersection(
  // source routes
  [{ name: 'home' }, { name: 'order' }],
  // compare routes
  [{ name: 'order' }]
)

routes // [{ name: home }]
```

## routesWithMetaPaths

Used to handle the path mapping issue of `routes` in `vue-router`. Due to the way `vue-router` defines routes, it is impossible to know the specific complete path and mapping of a route externally:

```js
const routes = [
  {
    path: '/home',
    children: [
      { path: 'list' }
    ]
  }
]

// What is the complete path of the current route?
// What are its parent paths?
routes[0].children[0].path
```

Use `routesWithMetaPaths` to calculate the full information of the current route:

```ts
import { routesWithMetaPaths } from 'vue-routes-utils'

const routes = [
  {
    path: '/home',
    children: [
      { path: 'list' }
    ]
  }
]
routesWithMetaPaths(routes)

routes[0].children[0].meta.fullPath // /home/list
routes[0].children[0].meta.paths // ['/home', '/home/list']
```

## someOf

Because determining whether the current route exists in `paths` requires calling `routesWithMetaPaths` first:

```ts
import { someOf } from 'vue-routes-utils'

import { useRoute } from 'vue-router'

const cur = { meta: { paths: ['/home', '/home/list'] } }
const route = useRoute()

route.path // home

someOf(cur, route) // true
```

## routesWithRedirects

Recursively process the `redirect` property of all hierarchical routes:

```ts
import { routesWithRedirects } from 'vue-routes-utils'

const routes = [
  {
    path: '/home',
    children: [
      { path: '/list', children: [{ path: 'add' }] }
    ]
  }
]

routesWithRedirects(routesWithRedirects)
```

After processing:

```ts
[
  {
    path: '/home',
    redirect: '/home/list',
    children: [
      {
        path: '/list',
        redirect: '/home/list/add',
        children: [{ path: 'add' }]
      }
    ]
  }
]
```

## withDefaultRedirect

Set the default redirect path. If `/` has already been set, it will not take effect:

```ts
const routes = [
  { path: '/home' }
]

withDefaultRedirect(routes)
```

After processing:

```ts
[
  { path: '/', redirect: '/home' },
  { path: '/home', }
]
```

[![NPM version](https://img.shields.io/npm/v/vue-routes-utils?color=a1b858&label=)](https://www.npmjs.com/package/vue-routes-utils)

## License

[MIT](./LICENSE) License © 2022 [Hairyf](https://github.com/hairyf)
