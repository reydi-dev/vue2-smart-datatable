<template>
  <v-app>
    <v-main class="demo-page">
      <v-container class="demo-shell py-10">
        <header class="demo-hero mb-8">
          <div>
            <p class="demo-eyebrow">Vue 2.7 · Vuetify 2.6 · Pre-release</p>
            <h1>Smart Data Table v0.1.0</h1>
            <p class="demo-subtitle">
              A backend-neutral table with controlled state, provider mode, responsive rendering, persistence, and safe
              CSV export.
            </p>
          </div>
          <v-btn
            href="https://github.com/reydi-dev/vue2-smart-datatable"
            target="_blank"
            rel="noopener noreferrer"
            outlined
            color="primary"
          >
            View source
          </v-btn>
        </header>

        <v-card outlined class="demo-card">
          <v-card-text>
            <div class="demo-controls mb-4">
              <v-btn-toggle v-model="mode" mandatory>
                <v-btn value="local">Local</v-btn>
                <v-btn value="server">Server</v-btn>
              </v-btn-toggle>
              <v-switch v-model="rtl" label="RTL" hide-details />
              <v-chip small outlined>{{ mode === 'local' ? '67 in-memory rows' : 'Async provider' }}</v-chip>
            </div>

            <SmartDataTable
              v-model="selected"
              :columns="columns"
              :items="rows"
              :mode="mode"
              :data-provider="mockProvider"
              :normalize-response="normalize"
              :actions="actions"
              selectable
              :direction="rtl ? 'rtl' : 'ltr'"
              persistence-key="demo"
              :persistence-adapter="persistence"
              :exporters="exporters"
              @row-action="lastAction = `${$event.action.key}:${$event.row.id}`"
            >
              <template #toolbar-prepend>
                <strong>{{ mode === 'local' ? 'Local data' : 'Normalized server data' }}</strong>
              </template>
              <template #cell.email="{ formattedValue }">
                <a :href="`mailto:${formattedValue}`">{{ formattedValue }}</a>
              </template>
            </SmartDataTable>
          </v-card-text>
        </v-card>

        <div class="demo-feedback mt-4">
          <span data-testid="selection">Selected: {{ selected.join(', ') || 'none' }}</span>
          <span>Last action: {{ lastAction || 'none' }}</span>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import { SmartDataTable, createCsvExporter, createLocalStoragePersistenceAdapter } from '@/index'
import { actions, columns, rows } from './data'
import { mockProvider } from './mock-provider'
import type { DataProviderRequest } from '@/types'
export default Vue.extend({
  components: { SmartDataTable },
  data: () => ({
    mode: 'local',
    rtl: false,
    selected: [] as number[],
    lastAction: '',
    rows,
    columns,
    actions,
    mockProvider,
    persistence: createLocalStoragePersistenceAdapter(),
    exporters: [createCsvExporter()],
    normalize: (raw: any, _request: DataProviderRequest) => ({
      items: raw.records,
      total: raw.count,
      meta: { page: raw.requestPage },
    }),
  }),
})
</script>

<style scoped>
.demo-page {
  background: #f6f7fb;
}
.demo-shell {
  max-width: 1440px;
}
.demo-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
.demo-eyebrow {
  margin-bottom: 8px;
  color: #5c6bc0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.demo-subtitle {
  max-width: 760px;
  margin: 8px 0 0;
  color: rgba(0, 0, 0, 0.68);
  line-height: 1.7;
}
.demo-card {
  border-radius: 12px;
  background: #fff;
}
.demo-controls,
.demo-feedback {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.demo-feedback {
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.68);
  font-size: 0.875rem;
}
@media (max-width: 600px) {
  .demo-shell {
    padding: 24px 12px !important;
  }
  .demo-hero {
    flex-direction: column;
  }
}
</style>
