<template>
  <div class="sdt-toolbar">
    <div class="sdt-toolbar__content"><slot /></div>
    <v-spacer />
    <v-btn v-if="hasFilters" text @click="$emit('toggle-filters')"
      ><v-icon left>{{ icons.filter }}</v-icon
      >{{ messages.filters }}</v-btn
    >
    <v-btn v-if="columnVisibility" text @click="$emit('columns')"
      ><v-icon left>{{ icons.columns }}</v-icon
      >{{ messages.columns }}</v-btn
    >
    <ExportMenu
      v-if="exporters.length"
      :exporters="exporters"
      :messages="messages"
      :icon="icons.export"
      :loading="exporting"
      @export="$emit('export', $event)"
    />
    <slot name="append" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ExportMenu from './ExportMenu.vue'
import type { DataTableIcons, DataTableMessages, ExporterAdapter } from '../types'
export default Vue.extend({
  name: 'SmartTableToolbar',
  components: { ExportMenu },
  props: {
    hasFilters: Boolean,
    columnVisibility: Boolean,
    exporters: { type: Array as () => ExporterAdapter[], default: () => [] },
    messages: { type: Object as () => DataTableMessages, required: true },
    icons: { type: Object as () => DataTableIcons, required: true },
    exporting: Boolean,
  },
})
</script>
