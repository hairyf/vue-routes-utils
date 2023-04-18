import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

/**
 * determine whether the current route has a target routing list
 *
 * You need to call handleMetaPaths in advance
 * @param current
 * @param target
 * @returns
 */
export function someOf(current: RouteLocationNormalizedLoaded,
  target: RouteRecordRaw | RouteLocationNormalizedLoaded) {
  const fullPath = target.meta?.fullPath || (target as any)?.fullPath
  return current.meta.paths?.includes(fullPath) || false
}

/**
 * Recursively compare the routes permission table (name field) and return a list of routes intersections
 *
 * @param baseRoutes basic routes
 * @param surfaceRoutes compare routes
 */
export function intersection(baseRoutes: RouteRecordRaw[] = [], surfaceRoutes: RouteRecordRaw[] = []) {
  const filterRoutes = baseRoutes.filter((base) => {
    const surface = surfaceRoutes.find(v => base.name === v.name)
    if (base.children && base.children?.length > 0)
      base.children = intersection(base.children, surface?.children)

    return surface
  })
  return filterRoutes
}
