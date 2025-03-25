import type { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from '@hairy/utils'
import { describe, expect, it } from 'vitest'
import { routesWithMetaPaths } from '../src/with'

describe('routesWithMetaPaths', () => {
  it('fullPath integrity', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/home',
        component: {},
        children: [{ path: 'index', component: {} }],
      },
    ]
    routesWithMetaPaths(routes)

    expect(routes[0].children![0]!.meta!.fullPath).toMatch('/home/index')
  })

  it('paths Integrity', () => {
    const children: RouteRecordRaw[] = [{ path: 'A2', component: {} }]
    const routes: RouteRecordRaw[] = [
      {
        path: '/A0',
        component: {},
        children: [
          { path: 'A1', component: {}, children: cloneDeep(children) },
          { path: 'B1', component: {}, children: cloneDeep(children) },
        ],
      },
      {
        path: '/A--',
        component: {},
        children: [
          { path: 'A1', component: {}, children: cloneDeep(children) },
          { path: 'B1', component: {}, children: cloneDeep(children) },
        ],
      },
    ]

    routesWithMetaPaths(routes)

    const deepLevelRoute = routes[0]!.children![0]!.children![0]
    const equalValue = ['/A0', '/A0/A1', '/A0/A1/A2']
    expect(deepLevelRoute!.meta!.paths).toEqual(equalValue)
  })
})
