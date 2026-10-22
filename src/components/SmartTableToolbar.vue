<template>
  <div class="sdt-toolbar">
    <div class="sdt-toolbar__content"><slot /></div>
    <div class="sdt-toolbar__actions">
      <button
        type="button"
        class="sdt-control"
        v-if="hasFilters"
        :disabled="disabled"
        :aria-expanded="filtersOpen ? 'true' : 'false'"
        @click="!disabled && $emit('toggle-filters')"
      >
        <SmartTableIcon :icon="icons.filter" :size="18" leading />{{ messages.filters }}
      </button>
      <button
        type="button"
        class="sdt-control"
        v-if="columnVisibility"
        :disabled="disabled"
        aria-haspopup="dialog"
        @click="!disabled && $emit('columns')"
      >
        <SmartTableIcon :icon="icons.columns" :size="18" leading />{{ messages.columns }}
      </button>
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
    filtersOpen: Boolean,
    columnVisibility: Boolean,
    exporters: { type: Array as () => ExporterAdapter[], default: () => [] },
    messages: { type: Object as () => DataTableMessages, required: true },
    icons: { type: Object as () => DataTableIcons, required: true },
    exporting: Boolean,
    disabled: Boolean,
  },
})
</script>
