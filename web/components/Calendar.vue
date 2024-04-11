<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'
import '@/css/calendar.css'
import '@/css/transition.css'
import '@/css/theme.css'

const props = defineProps({
  modelValue: {
    type: [Date, Object] as PropType<DatePickerDate | DatePickerRangeObject | null>,
    default: null
  }
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  }
})

const attrs = {
  transparent: true,
  borderless: true,
  content: {
    class: 'indexer-content'
  },
  "title-position": "left",
  'first-day-of-week': 2,
}
</script>

<template>
  <div
    id="calendar"
    class="bg-gray-700 w-max px-4 py-6 rounded-lg border border-gray-300"
  >
    <VCalendarDatePicker
      :columns="1"
      v-model.range="date"
      v-bind="{ ...attrs, ...$attrs }" />
  </div>
</template>

<style>
.vc-header {
  margin-top: 0px;
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.vc-weeks {
  padding: 0;
}

.vc-title {
  padding: 0 !important;
  color: white !important;
  font-family: Inter !important;
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 140% !important;
}

.vc-header .vc-arrow {
  color: white !important
}

.vc-weekdays {
  margin-top: 16px !important;
  margin-bottom: 8px !important;
  border-radius: 4px !important;
  background: var(--Gray-400, #484A4B) !important;

}

.vc-weekday {
  display: flex !important;
  width: 40px !important;
  padding: 8px 2px !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 8px !important;
  color: var(--White, #FFF) !important;
  text-align: center !important;
  font-family: Inter !important;
  font-size: 12px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: 150% !important; /* 18px */
}

.vc-day {
  display: flex !important;
  width: 40px !important;
  height: 40px !important;
  justify-content: center !important;
  align-items: center !important;
  color: var(--Font-Color-1, #FAFAFA) !important;
  text-align: center !important;
  font-family: Inter !important;
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 140% !important; /* 22.4px */
}
</style>
