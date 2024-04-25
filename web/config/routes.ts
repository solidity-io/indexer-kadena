export type RouteType = 'link' | 'group';

export interface BaseRoute {
  path?: string;
  tag: string;
  label: string;
}

export interface LinkRoute extends BaseRoute{
  type: 'link';
}

export interface GroupRoute {
  type: 'group';
  tag: string;
  label: string;
  subroutes?: BaseRoute[];
}

export type Route = LinkRoute | GroupRoute;

export const routes: Route[] = [
  {
    type: 'link',
    path: '/',
    label: 'Home',
    tag: 'route:home',
  },
  {
    type: 'link',
    path: '/blocks',
    label: 'Blocks',
    tag: 'route:blockchains',
  },
  {
    type: 'link',
    path: '/transactions',
    label: 'Transactions',
    tag: 'route:transactions',
  },
  {
    type: 'group',
    label: 'Tokens',
    tag: 'route:token',
    subroutes: [
      {
        path: '/tokens',
        label: 'Trending tokens',
        tag: 'route:tokens',
      },
      {
        path: '/tokens/transfers',
        label: 'Token Transfers',
        tag: 'route:token:transfers',
      }
    ]
  },
  {
    label: 'NFT',
    type: 'group',
    tag: 'route:nft',
    subroutes: [
      {
        path: '/collections',
        tag: 'route:collections',
        label: 'NFT Trending Collections',
      },
      {
        path: '/collections/nft-transfers',
        label: 'NFT Transfers',
        tag: 'route:collections:nfts',
      }
    ]
  }
]

export default routes
