import { NotFound } from './NotFound'
import { TRoute } from 'types'

export const NotFoundRoutes: TRoute[] = [
  {
    path: '*',
    component: NotFound,
  },
]
