<template>
  <span
    class="sdt-icon"
    :class="[{ 'sdt-icon--leading': leading }, tone ? `sdt-icon--${tone}` : undefined]"
    :style="{ '--sdt-icon-size': `${size}px` }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <svg
      v-if="definition"
      :viewBox="definition.viewBox || '0 0 24 24'"
      :fill="definition.stroke ? 'none' : 'currentColor'"
      :stroke="definition.stroke ? 'currentColor' : 'none'"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path v-for="(path, index) in iconPaths" :key="index" :d="path" />
    </svg>
    <span v-else-if="fontClasses.length" :class="fontClasses" aria-hidden="true" />
  </span>
</template>
<script lang="ts">
import Vue from 'vue'
import { resolveSvgIcon, resolveFontIcon } from '../core/icons'
import type { DataTableIcon, SvgIconDefinition } from '../types'
export default Vue.extend({
  name: 'SmartTableIcon',
  props: {
    icon: { type: [String, Object] as unknown as () => DataTableIcon, default: '' },
    label: String,
    size: { type: Number, default: 18 },
    leading: Boolean,
    tone: { type: String as () => 'success' | 'error' | undefined },
  },
  computed: {
    definition(): SvgIconDefinition | null {
      return resolveSvgIcon(this.icon)
    },
    iconPaths(): readonly string[] {
      return this.definition
        ? typeof this.definition.path === 'string'
          ? [this.definition.path]
          : this.definition.path
        : []
    },
    fontClasses(): string[] {
      return resolveFontIcon(this.icon)
    },
  },
})
</script>
