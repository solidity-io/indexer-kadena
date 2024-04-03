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
    path: '/',
    type: 'link',
    label: 'Home',
    tag: 'route:home',
  },
  {
    type: 'link',
    path: '/blockchains',
    label: 'Blockchains',
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
    tag: 'route:tokens',
    subroutes: [
      {
        path: '/tokens/trending',
        label: 'Trending tokens',
        tag: 'route:tokens:trending',
      },
      {
        path: '/tokens/transfers',
        label: 'Token Transfers',
        tag: 'route:tokens:transfers',
      }
    ]
  },
  {
    label: 'NFT',
    type: 'group',
    tag: 'route:nft',
    subroutes: [
      {
        path: '/nft/trending',
        tag: 'route:nft:trending',
        label: 'NFT Trending Collections',
      },
      {
        path: '/nft/transfers',
        label: 'NFT Transfers',
        tag: 'route:nft:transfers',
      }
    ]
  }
]

export default routes
