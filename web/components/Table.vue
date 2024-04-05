<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rows: any[],
    columns: any[],
  }>(),
  {
    //
  }
)
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
          class="text-font-500 text-xs font-semibold leading-[150%]"
        >
          {{ column.label }}
        </span>
      </div>
    </div>

    <div
      class="border-t border-t-gray-300"
    >
      <div
        v-for="row in rows"
        :key="row.requestKey"
        class="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4 px-4 py-2 border-b border-b-gray-300 justify-between"
      >
        <div
          :key="index"
          v-for="(column, index) in props.columns"
          :style="{ gridColumn: `span ${column.cols} / span ${column.cols}` }"
          class="text-font-400 truncate"
          :class="column.center && 'text-center'"
        >
          <slot
            :name="column.key"
            :row="row"
          >
            <span
              class="text-font-400 text-sm"
            >
              {{ row[column.key] }}
            </span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
