<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rows: any[],
    columns: any[],
    pending?: boolean,
  }>(),
  {
    pending: false,
    //
  }
)

const emit = defineEmits(['rowClick'])
</script>

<template>
  <div>
    <div
      class="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4 px-4 py-2"
    >
      <div
        v-for="column in props.columns"
        :key="column.key"
        :class="column.center && 'text-center'"
        :style="{ gridColumn: `span ${column.cols} / span ${column.cols}` }"
      >
        <span
          class="text-font-500 text-xs font-semibold leading-[150%] h-[18px] block"
        >
          {{ column.label }}
        </span>
      </div>
    </div>

    <div
      class="border-t border-t-gray-300"
    >
      <TablePending
        v-if="pending"
        :columns="props.columns"
      />

      <slot
        name="row"
      >
        <TableRowDefault
          v-for="(row, rowIndex) in rows"
          :key="row.requestKey"
          :row="row"
          :columns="columns"
          :rowIndex="rowIndex"
        >
          <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </TableRowDefault>
      </slot>
    </div>
  </div>
</template>
