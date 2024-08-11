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

  const { data, pending, error } = useAsyncData(key, async () => {
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

export function usePagination(defaultLimit = 20) {
  const route = useRoute()
  const router = useRouter()

  const page = ref(1)
  const limit = ref(defaultLimit)

  const updateURL = (newPage: number) => {
    router.push({ query: { ...route.query, page: newPage.toString() } })
  }

  watch(() => route.query.page, (newPage) => {
    if (newPage) {
      page.value = Number(newPage)
    }
  }, { immediate: true })

  watch(page, (newPage) => {
    updateURL(newPage)
  })

  onMounted(() => {
    const pageFromURL = route.query.page as string
    if (pageFromURL) {
      page.value = Number(pageFromURL)
    } else {
      updateURL(page.value)
    }
  })

  return {
    page,
    limit,
    updatePage: (newPage: number) => {
      page.value = newPage
    }
  }
}
