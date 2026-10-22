<template>
  <div class="sdt-export" @keydown.esc.stop.prevent="close(true)">
    <button
      ref="trigger"
      type="button"
      class="sdt-control"
      :aria-expanded="open ? 'true' : 'false'"
      :disabled="disabled || loading"
      :aria-busy="loading ? 'true' : undefined"
      @click="toggle"
    >
      <span v-if="loading" class="sdt-action__spinner" aria-hidden="true" /><SmartTableIcon
        v-else
        :icon="icon"
        :size="18"
      />{{ messages.export }}
    </button>
    <div v-if="open" class="sdt-export__panel" role="group" :aria-label="messages.export">
      <template v-for="exporter in exporters"
        ><button
          v-for="scope in exporter.scopes"
          :key="`${exporter.key}-${scope}`"
          type="button"
          :disabled="disabled || loading"
          @click="choose(exporter.key, scope)"
        >
          {{ exporter.label }} — {{ scope === 'current' ? messages.currentPage : messages.allRows }}
        </button></template
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from './SmartTableIcon.vue'
import type { DataTableIcon, DataTableMessages, ExporterAdapter, ExportScope } from '../types'
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
  data: () => ({ open: false }),
  watch: {
    disabled(value: boolean) {
      if (value) this.close(false)
    },
    loading(value: boolean) {
      if (value) this.close(false)
    },
  },
  mounted() {
    document.addEventListener('pointerdown', this.outside)
    document.addEventListener('focusin', this.focusOutside)
  },
  beforeDestroy() {
    document.removeEventListener('pointerdown', this.outside)
    document.removeEventListener('focusin', this.focusOutside)
  },
  methods: {
    toggle() {
      if (!this.disabled && !this.loading) this.open = !this.open
    },
    close(restore: boolean) {
      this.open = false
      if (restore) (this.$refs.trigger as HTMLButtonElement)?.focus()
    },
    outside(event: Event) {
      if (!this.$el.contains(event.target as Node)) this.close(false)
    },
    focusOutside(event: Event) {
      if (!this.$el.contains(event.target as Node)) this.close(false)
    },
    choose(exporter: string, scope: ExportScope) {
      if (this.disabled || this.loading) return
      this.close(true)
      this.$emit('export', { exporter, scope })
    },
  },
})
</script>
