import { RouteParamsWithQueryOverload, Router } from 'ziggy-js';

export default function useRoute() {
  function routeWrapper(
    name?: undefined,
    params?: RouteParamsWithQueryOverload,
    absolute?: boolean,
  ): Router;
  function routeWrapper(
    name: string,
    params?: RouteParamsWithQueryOverload,
    absolute?: boolean,
  ): string;
  function routeWrapper(
    name?: any,
    params?: RouteParamsWithQueryOverload,
    absolute?: boolean,
  ): any {
    return (window as any).route(name, params, absolute);
  }

  return routeWrapper;
}
