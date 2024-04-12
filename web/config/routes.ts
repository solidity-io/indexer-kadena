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
        path: '/token/trending',
        label: 'Trending tokens',
        tag: 'route:tokens:trending',
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
        path: '/nft/collections',
        tag: 'route:nft:collections',
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
