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

  const { data: data } = await useAsyncData(key, async () => {
    const res = await $graphql.default.request(query, {
      first: limit.value,
      offset: (page.value - 1) * 20,
    });

    const totalPages = Math.max(Math.ceil(res[key].totalCount / limit.value), 1)

    return {
      ...res[key],
      totalPages
    };
  }, {
    watch: [page]
  });


  return {
    page,
    data,
    limit,
  }
}
