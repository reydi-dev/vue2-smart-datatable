<template>
  <div class="sdt-toolbar">
    <div class="sdt-toolbar__content"><slot /></div>
    <div class="sdt-toolbar__actions">
      <v-btn v-if="hasFilters" text :disabled="disabled" @click="$emit('toggle-filters')"
        ><SmartTableIcon :icon="icons.filter" :size="18" leading />{{ messages.filters }}</v-btn
      >
      <v-btn v-if="columnVisibility" text :disabled="disabled" @click="$emit('columns')"
        ><SmartTableIcon :icon="icons.columns" :size="18" leading />{{ messages.columns }}</v-btn
      >
      <ExportMenu
        v-if="exporters.length"
        :exporters="exporters"
        :messages="messages"
        :icon="icons.export"
        :loading="exporting"
        :disabled="disabled"
        @export="$emit('export', $event)"
      />
      <slot name="append" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from './SmartTableIcon.vue'
import ExportMenu from './ExportMenu.vue'
import type { DataTableIcons, DataTableMessages, ExporterAdapter } from '../types'
export default Vue.extend({
  name: 'SmartTableToolbar',
  components: { ExportMenu, SmartTableIcon },
  props: {
    hasFilters: Boolean,
    columnVisibility: Boolean,
    exporters: { type: Array as () => ExporterAdapter[], default: () => [] },
    messages: { type: Object as () => DataTableMessages, required: true },
    icons: { type: Object as () => DataTableIcons, required: true },
    exporting: Boolean,
    disabled: Boolean,
  },
})
</script>
