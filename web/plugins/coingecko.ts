export default defineNuxtPlugin(async () => {
  const apiKey = useRuntimeConfig().public.CG_KEY;
  const baseUrl = useRuntimeConfig().public.CG_URL;

  const request = async (endpoint: string, params = {}) => {
    const url = new URL(`${baseUrl}/${endpoint}`) as any;

    url.search = new URLSearchParams({ ...params, 'x_cg_api_key': apiKey });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetching CoinGecko API failed:', error);
      return null;
    }
  };

  return {
    provide: {
      coingecko: {
        request,
      },
    },
  };
});
