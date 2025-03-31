/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DataImport } from './routes/data'
import { Route as IndexImport } from './routes/index'
import { Route as DataNewsecretImport } from './routes/data_.new_secret'
import { Route as DataNewImport } from './routes/data_.new'
import { Route as DataKeyKeyImport } from './routes/data.key.$key'
import { Route as DataKeyKeyEditImport } from './routes/data.key.$key.edit'

// Create/Update Routes

const DataRoute = DataImport.update({
  id: '/data',
  path: '/data',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DataNewsecretRoute = DataNewsecretImport.update({
  id: '/data_/new_secret',
  path: '/data/new_secret',
  getParentRoute: () => rootRoute,
} as any)

const DataNewRoute = DataNewImport.update({
  id: '/data_/new',
  path: '/data/new',
  getParentRoute: () => rootRoute,
} as any)

const DataKeyKeyRoute = DataKeyKeyImport.update({
  id: '/key/$key',
  path: '/key/$key',
  getParentRoute: () => DataRoute,
} as any)

const DataKeyKeyEditRoute = DataKeyKeyEditImport.update({
  id: '/edit',
  path: '/edit',
  getParentRoute: () => DataKeyKeyRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/data': {
      id: '/data'
      path: '/data'
      fullPath: '/data'
      preLoaderRoute: typeof DataImport
      parentRoute: typeof rootRoute
    }
    '/data_/new': {
      id: '/data_/new'
      path: '/data/new'
      fullPath: '/data/new'
      preLoaderRoute: typeof DataNewImport
      parentRoute: typeof rootRoute
    }
    '/data_/new_secret': {
      id: '/data_/new_secret'
      path: '/data/new_secret'
      fullPath: '/data/new_secret'
      preLoaderRoute: typeof DataNewsecretImport
      parentRoute: typeof rootRoute
    }
    '/data/key/$key': {
      id: '/data/key/$key'
      path: '/key/$key'
      fullPath: '/data/key/$key'
      preLoaderRoute: typeof DataKeyKeyImport
      parentRoute: typeof DataImport
    }
    '/data/key/$key/edit': {
      id: '/data/key/$key/edit'
      path: '/edit'
      fullPath: '/data/key/$key/edit'
      preLoaderRoute: typeof DataKeyKeyEditImport
      parentRoute: typeof DataKeyKeyImport
    }
  }
}

// Create and export the route tree

interface DataKeyKeyRouteChildren {
  DataKeyKeyEditRoute: typeof DataKeyKeyEditRoute
}

const DataKeyKeyRouteChildren: DataKeyKeyRouteChildren = {
  DataKeyKeyEditRoute: DataKeyKeyEditRoute,
}

const DataKeyKeyRouteWithChildren = DataKeyKeyRoute._addFileChildren(
  DataKeyKeyRouteChildren,
)

interface DataRouteChildren {
  DataKeyKeyRoute: typeof DataKeyKeyRouteWithChildren
}

const DataRouteChildren: DataRouteChildren = {
  DataKeyKeyRoute: DataKeyKeyRouteWithChildren,
}

const DataRouteWithChildren = DataRoute._addFileChildren(DataRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/data': typeof DataRouteWithChildren
  '/data/new': typeof DataNewRoute
  '/data/new_secret': typeof DataNewsecretRoute
  '/data/key/$key': typeof DataKeyKeyRouteWithChildren
  '/data/key/$key/edit': typeof DataKeyKeyEditRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/data': typeof DataRouteWithChildren
  '/data/new': typeof DataNewRoute
  '/data/new_secret': typeof DataNewsecretRoute
  '/data/key/$key': typeof DataKeyKeyRouteWithChildren
  '/data/key/$key/edit': typeof DataKeyKeyEditRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/data': typeof DataRouteWithChildren
  '/data_/new': typeof DataNewRoute
  '/data_/new_secret': typeof DataNewsecretRoute
  '/data/key/$key': typeof DataKeyKeyRouteWithChildren
  '/data/key/$key/edit': typeof DataKeyKeyEditRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/data'
    | '/data/new'
    | '/data/new_secret'
    | '/data/key/$key'
    | '/data/key/$key/edit'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/data'
    | '/data/new'
    | '/data/new_secret'
    | '/data/key/$key'
    | '/data/key/$key/edit'
  id:
    | '__root__'
    | '/'
    | '/data'
    | '/data_/new'
    | '/data_/new_secret'
    | '/data/key/$key'
    | '/data/key/$key/edit'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DataRoute: typeof DataRouteWithChildren
  DataNewRoute: typeof DataNewRoute
  DataNewsecretRoute: typeof DataNewsecretRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DataRoute: DataRouteWithChildren,
  DataNewRoute: DataNewRoute,
  DataNewsecretRoute: DataNewsecretRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/data",
        "/data_/new",
        "/data_/new_secret"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/data": {
      "filePath": "data.tsx",
      "children": [
        "/data/key/$key"
      ]
    },
    "/data_/new": {
      "filePath": "data_.new.tsx"
    },
    "/data_/new_secret": {
      "filePath": "data_.new_secret.tsx"
    },
    "/data/key/$key": {
      "filePath": "data.key.$key.tsx",
      "parent": "/data",
      "children": [
        "/data/key/$key/edit"
      ]
    },
    "/data/key/$key/edit": {
      "filePath": "data.key.$key.edit.tsx",
      "parent": "/data/key/$key"
    }
  }
}
ROUTE_MANIFEST_END */
