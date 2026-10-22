<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }"
      ><v-btn text v-bind="attrs" :loading="loading" :disabled="disabled" v-on="on"
        ><SmartTableIcon :icon="icon" :size="18" leading />{{ messages.export }}</v-btn
      ></template
    >
    <v-list dense
      ><template v-for="exporter in exporters"
        ><v-list-item
          v-for="scope in exporter.scopes"
          :key="`${exporter.key}-${scope}`"
          @click="!disabled && $emit('export', { exporter: exporter.key, scope })"
          ><v-list-item-title
            >{{ exporter.label }} —
            {{ scope === 'current' ? messages.currentPage : messages.allRows }}</v-list-item-title
          ></v-list-item
        ></template
      ></v-list
    >
  </v-menu>
</template>
<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from './SmartTableIcon.vue'
import type { DataTableIcon, DataTableMessages, ExporterAdapter } from '../types'
export default Vue.extend({
  name: 'ExportMenu',
  components: { SmartTableIcon },
  props: {
    exporters: { type: Array as () => ExporterAdapter[], required: true },
    messages: { type: Object as () => DataTableMessages, required: true },
    icon: { type: [String, Object] as unknown as () => DataTableIcon, default: '' },
    loading: Boolean,
    disabled: Boolean,
  },
})
</script>
