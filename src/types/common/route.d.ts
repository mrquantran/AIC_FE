import React from 'react'
import { BreadcrumbComponentType } from 'use-react-router-breadcrumbs'
import { IconType } from 'react-icons'
import { TKeyPermission, TPortalPages } from 'types/models'

export type TRoute = {
  path: string
  redirectTo?: string
  exact?: boolean
  component: React.ComponentType
  children?: TRoute[]
  page?: TPortalPages
  permission?: TKeyPermission
  breadcrumb?: BreadcrumbComponentType<any> | string | null
  showInMenu?: boolean
  menuIcon?: IconType
  menuLabel?: string
  /**
   * Breadcrumb props
   */
  props?: Record<string, unknown>
}
