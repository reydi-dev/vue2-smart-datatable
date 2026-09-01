<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }"
      ><v-btn text v-bind="attrs" :loading="loading" v-on="on"
        ><v-icon left>{{ icon }}</v-icon
        >{{ messages.export }}</v-btn
      ></template
    >
    <v-list dense
      ><template v-for="exporter in exporters"
        ><v-list-item
          v-for="scope in exporter.scopes"
          :key="`${exporter.key}-${scope}`"
          @click="$emit('export', { exporter: exporter.key, scope })"
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
import type { DataTableMessages, ExporterAdapter } from '../types'
export default Vue.extend({
  name: 'ExportMenu',
  props: {
    exporters: { type: Array as () => ExporterAdapter[], required: true },
    messages: { type: Object as () => DataTableMessages, required: true },
    icon: String,
    loading: Boolean,
  },
})
</script>
