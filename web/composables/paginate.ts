export interface PaginateInterface {
  key: string,
  query: string,
}

export const usePaginate = async ({
  key,
  query,
}: PaginateInterface) => {
  const { $graphql } = useNuxtApp();

  const page = ref(1)
  const limit = ref(20)

  const { data, pending, error } = await useAsyncData(key, async () => {
    try {
      const res = await $graphql.default.request(query, {
        first: limit.value,
        offset: (page.value - 1) * 20,
      });

      const totalPages = Math.max(Math.ceil(res[key].totalCount / limit.value), 1)

      return {
        ...res[key],
        totalPages
      };
    } catch (e) {
      console.warn('e', e)

      return null
    }
  }, {
    watch: [page]
  });


  return {
    page,
    data,
    error,
    limit,
    pending,
  }
}
