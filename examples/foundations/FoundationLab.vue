<template>
  <main class="sdt-root foundation-page" :data-sdt-theme="theme" :dir="direction">
    <header class="foundation-header">
      <span class="foundation-eyebrow">SMART / TABLE · CLARITY</span>
      <h1>UI foundations</h1>
      <p>Shared colors, clear focus, and icons that stay sharp at every size.</p>
      <a href="./index.html">Back to the table demo</a>
    </header>
    <div class="foundation-controls">
      <label
        >Theme<select v-model="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select></label
      >
      <label
        >Direction<select v-model="direction">
          <option value="ltr">LTR</option>
          <option value="rtl">RTL</option>
        </select></label
      >
      <label
        >Mobile threshold<select v-model.number="breakpoint">
          <option :value="960">960px</option>
          <option :value="600">600px</option>
        </select></label
      >
    </div>
    <section class="foundation-card">
      <h2>One set of controls, any workspace</h2>
      <p>
        Viewport:
        <output data-testid="viewport-mode">{{
          viewportWidth === null ? 'Desktop' : mobile ? 'Mobile' : 'Desktop'
        }}</output
        ><span v-if="viewportWidth !== null"> · {{ viewportWidth }}px</span>
      </p>
      <div class="foundation-icons">
        <div v-for="(icon, name) in samples" :key="name">
          <SmartTableIcon :icon="icon" :size="24" /><span>{{ name }}</span>
        </div>
      </div>
      <button class="sdt-pagination__button" disabled>Disabled action</button>
      <SmartTablePagination
        :page.sync="page"
        :items-per-page="pageSize"
        :total="1000"
        :page-size-options="[10, 25, 50]"
        :messages="messages"
        :previous-icon="direction === 'rtl' ? 'chevron-right' : 'chevron-left'"
        :next-icon="direction === 'rtl' ? 'chevron-left' : 'chevron-right'"
        @update:items-per-page="setPageSize"
      />
    </section>
    <p class="foundation-note">
      Standalone verification page · Vue + library styles · No Vuetify or icon font imported
    </p>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'
import SmartTableIcon from '@/components/SmartTableIcon.vue'
import SmartTablePagination from '@/components/SmartTablePagination.vue'
import { defaultMessages } from '@/core/messages'
import { matchesMobileBreakpoint, observeViewportWidth } from '@/core/responsive'
export default Vue.extend({
  components: { SmartTableIcon, SmartTablePagination },
  data: () => ({
    theme: 'light',
    direction: 'ltr',
    breakpoint: 960,
    viewportWidth: null as number | null,
    stopObserving: null as (() => void) | null,
    page: 1,
    pageSize: 25,
    messages: defaultMessages,
    samples: {
      Sort: 'arrow-up',
      Filter: 'filter-variant',
      Columns: 'view-column',
      Export: 'download',
      Copy: 'content-copy',
      Refresh: 'refresh',
      Success: 'check-circle',
      Custom: { path: 'M12 2 2 22h20L12 2Z', viewBox: '0 0 24 24' },
    },
  }),
  computed: {
    mobile(): boolean {
      return this.viewportWidth !== null && matchesMobileBreakpoint(this.viewportWidth, this.breakpoint)
    },
  },
  mounted() {
    this.stopObserving = observeViewportWidth((width) => {
      this.viewportWidth = width
    })
  },
  beforeDestroy() {
    this.stopObserving?.()
  },
  methods: {
    setPageSize(size: number) {
      this.pageSize = size
      this.page = 1
    },
  },
})
</script>
<style>
body {
  margin: 0;
}
.foundation-page {
  min-height: 100vh;
  padding: 48px max(24px, calc((100vw - 1000px) / 2));
  background: var(--sdt-tint-color);
  color: var(--sdt-text-color);
  font:
    14px/1.7 system-ui,
    sans-serif;
}
.foundation-eyebrow {
  color: var(--sdt-accent);
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 650;
}
.foundation-header h1 {
  font-size: 36px;
  letter-spacing: -1px;
  margin: 12px 0 0;
}
.foundation-header p,
.foundation-note {
  color: var(--sdt-muted-color);
}
.foundation-header a {
  color: var(--sdt-accent);
}
.foundation-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 32px 0;
}
.foundation-controls label {
  display: grid;
  gap: 6px;
  font-size: var(--sdt-font-size-small);
}
.foundation-controls select {
  padding: 8px 12px;
  border: 1px solid var(--sdt-border-color);
  border-radius: var(--sdt-control-radius);
  color: var(--sdt-text-color);
  background: var(--sdt-surface);
  font: inherit;
}
.foundation-card {
  padding: 24px;
  border: 1px solid var(--sdt-border-color);
  border-radius: var(--sdt-radius);
  background: var(--sdt-surface);
}
.foundation-card h2 {
  font-size: 20px;
  margin: 0;
}
.foundation-icons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
  gap: 20px;
  padding-block: 24px;
  margin-bottom: 12px;
}
.foundation-icons > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--sdt-accent);
  font-size: var(--sdt-font-size-small);
}
.foundation-card .sdt-pagination {
  margin-top: 24px;
  padding-inline: 0;
}
.foundation-note {
  font-size: 12px;
}
</style>
