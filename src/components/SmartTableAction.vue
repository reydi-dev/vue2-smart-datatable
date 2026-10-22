<template>
  <button
    type="button"
    class="sdt-action"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    :style="{ color: actionColor }"
    @click="activate"
  >
    <span v-if="loading" class="sdt-action__spinner" aria-hidden="true" />
    <SmartTableIcon v-else-if="action.icon" :icon="action.icon" leading :size="16" />
    <span>{{ action.label }}</span>
  </button>
</template>
<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from './SmartTableIcon.vue'
import type { RowAction } from '../types'
const colors: Record<string, string> = {
  primary: 'var(--sdt-accent)',
  success: 'var(--sdt-success-color)',
  error: 'var(--sdt-error-color)',
  secondary: 'var(--sdt-muted-color)',
  warning: 'var(--sdt-warning-color)',
  info: 'var(--sdt-info-color)',
}
export default Vue.extend({
  components: { SmartTableIcon },
  props: { action: { type: Object as () => RowAction, required: true }, disabled: Boolean, loading: Boolean },
  computed: {
    actionColor(): string | undefined {
      return this.action.color
        ? Object.prototype.hasOwnProperty.call(colors, this.action.color)
          ? colors[this.action.color]
          : this.action.color
        : undefined
    },
  },
  methods: {
    activate(event: MouseEvent) {
      if (!this.disabled && !this.loading) this.$emit('click', event)
    },
  },
})
</script>
