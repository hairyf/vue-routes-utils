import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    fullPath?: string
    /**
     * path maps
     *
     * @example ["/home", "/home/list", "/home/list/add"]
     */
    paths?: string[]
  }
}

/**
 * deep helper routes meta info
 * @param routes
 */
export function routesWithMetaPaths(routes: RouteRecordRaw[]) {
  let paths: string[] = []

  const deepHandler = (routes: RouteRecordRaw[], upperPath?: string) => {
    typeof upperPath !== 'string' && (paths = [])
    for (const index in routes) {
      const route = routes[index]
      // splicing route absolute path
      const fullPath = upperPath ? `${upperPath === '/' ? '/' : `${upperPath}/`}${route.path}` : route.path
      // record routing path information
      paths.push(fullPath)
      // add routing path information
      route.meta ??= {}
      route.meta.paths = [...paths]
      route.meta.fullPath = fullPath

      if (Array.isArray(route.children))
        deepHandler(route.children, fullPath)

      paths = paths.slice(0, paths.indexOf(fullPath))
    }
  }

  deepHandler(routes)
}

function _routesWithRedirects(routes: RouteRecordRaw[] = [], upperPath?: string) {
  for (const route of routes) {
    if (!(route.children && route.children.length > 0) || route.redirect)
      continue

    const prefix = upperPath === '/' ? '' : `${upperPath}/`
    const fullPath = upperPath ? `${prefix}${route.path}` : route.path
    const splice = route.path === '/' ? '' : '/'

    // Current full address
    route.redirect = `${fullPath}${splice}${parseChildrenFullPath(route.children[0])}`
    // Recursively set redirect address again
    _routesWithRedirects(route.children, fullPath)
  }

  function parseChildrenFullPath(route: RouteRecordRaw): string {
    if (route?.children) {
      if (route.path === '/')
        return parseChildrenFullPath(route.children[0])

      return `${route.path}/${parseChildrenFullPath(route.children[0])}`
    }
    return route.path
  }
}

/**
 * Define default redirect address
 *
 * @if route.children && route.children.length > 0 && !route.redirect
 * @param routes
 */
export function routesWithRedirects(routes: RouteRecordRaw[] = []) {
  _routesWithRedirects(routes)
}

/**
 * set the default route path of the current route table/=>the first path
 *
 * If path: `/` is not set, add `{path: '/', redirect: routes[0].path}`
 */
export function withDefaultRedirect(routes: RouteRecordRaw[] = []) {
  if (routes.some(v => v.path === '/'))
    return
  routes.unshift({ path: '/', redirect: routes[0].path })
}
