<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rows: any[],
    columns: any[],
    title?: string,
    pending?: boolean,
    isFull?: boolean,
    mobileWithoutHeader?: boolean,
  }>(),
  {
    isFull: false,
    pending: false,
    mobileWithoutHeader: false,
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
      class="pb-4 md:pb-6"
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
        v-if="pending || rows?.length > 0"
        class="grid-cols-[repeat(24,minmax(0,1fr))] gap-4 px-4 py-2 border-b border-b-gray-300"
        :class="[
          mobileWithoutHeader ? 'hidden md:grid' : 'grid',
          isFull ? 'min-w-full' : 'min-w-[1200px] bazk:min-w-full',
        ]"
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

          <Tooltip
            :value="column.description"
            v-if="column.description"
          />
        </div>
      </div>

      <div
        class="relative divide-y"
        :class="[isFull ? 'min-w-full' : 'min-w-[1200px] bazk:min-w-full']"
      >
        <div
          v-if="pending"
        >
          <TablePending
            :columns="props.columns"
          />
        </div>

        <div
          v-else-if="rows?.length === 0"
        >
          <slot
            name="empty"
          />
        </div>

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
            :isLast="rowIndex === rows.length - 1"
          >
            <TableRowDefault
              :row="row"
              :columns="columns"
              :rowIndex="rowIndex"
              :isLast="rowIndex + 1 === rows.length"
            >
              <template v-for="name in filteredSlots" v-slot:[name]="slotData">
                <slot :name="name" v-bind="slotData" />
              </template>
            </TableRowDefault>
          </slot>
        </template>
      </div>
    </div>

    <div
      v-if="rows?.length > 0"
    >
      <slot
        name="footer"
      />
    </div>
  </div>
</template>
