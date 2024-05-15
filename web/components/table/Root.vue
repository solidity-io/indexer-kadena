<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rows: any[],
    columns: any[],
    title?: string,
    pending?: boolean,
  }>(),
  {
    pending: false,
  }
)

const slots = useSlots();

const filteredSlots = computed(() => {
  return Object.keys(slots).filter(name => !['default', 'row'].includes(name))
})

const emit = defineEmits(['rowClick'])
</script>

<template>
  <div>
    <div
      v-if="title"
      class="pb-4 bazk:pb-6"
    >
      <span
        class="text-font-400 text-lg leading-[100%] font-semibold tracking-[0.36px]"
      >
        {{ title }}
      </span>
    </div>

    <div
      class="max-w-full overflow-auto w-full"
    >
      <div
        class="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4 px-4 py-2 min-w-[1200px] bazk:min-w-full"
      >
        <div
          v-for="column in props.columns"
          :key="column.key"
          class="flex items-center gap-1"
          :class="[column.center && 'justify-center', !!column.isFixed && 'sticky left-0 bg-gray-800']"
          :style="{ gridColumn: `span ${column.cols} / span ${column.cols}` }"
        >
          <span
            class="text-font-500 text-xs font-semibold leading-[150%] h-[18px] block"
          >
            {{ column.label }}
          </span>

          <Tooltip />
        </div>
      </div>

      <div
        class="border-t border-t-gray-300 min-w-[1200px] bazk:min-w-full relative"
      >
        <TablePending
          v-if="pending"
          :columns="props.columns"
        />

        <template
          v-else
        >
          <slot
            name="row"
            :row="row"
            :columns="columns"
            :rowIndex="rowIndex"
            :key="row.requestKey"
            v-for="(row, rowIndex) in rows"
          >
            <TableRowDefault
              :row="row"
              :columns="columns"
              :rowIndex="rowIndex"
            >
              <template v-for="name in filteredSlots" v-slot:[name]="slotData">
                <slot :name="name" v-bind="slotData" />
              </template>
            </TableRowDefault>
          </slot>
        </template>
      </div>
    </div>
  </div>
</template>
