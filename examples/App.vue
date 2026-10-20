<template>
  <v-app>
    <v-main class="demo-page">
      <v-container class="demo-shell py-10">
        <header class="demo-hero">
          <div>
            <p class="demo-eyebrow">Vue 2.7 · Vuetify 2.6</p>
            <h1>Smart Data Table v0.1.0</h1>
            <p class="demo-subtitle">
              A practical table for Vue 2 apps: switch between local and server data, try filters, and check the mobile
              layout.
            </p>
          </div>
          <v-btn
            href="https://github.com/reydi-dev/vue2-smart-datatable"
            target="_blank"
            rel="noopener noreferrer"
            outlined
            color="white"
          >
            View source
          </v-btn>
        </header>

        <v-card class="demo-card">
          <v-card-text class="demo-card__body">
            <div class="demo-intro">
              <div>
                <p class="demo-section-label">INTERACTIVE PREVIEW</p>
                <h2>Explore the table</h2>
              </div>
              <p>Change the data source, then try sorting, filtering, selecting, and exporting rows.</p>
            </div>
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
  min-height: 100vh;
  background: linear-gradient(180deg, #eef1ff 0, #f6f7fb 300px);
}
.demo-shell {
  max-width: 1440px;
}
.demo-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 36px 40px;
  border-radius: 20px;
  background: linear-gradient(120deg, #182859, #3446a4 70%, #5166c8);
  box-shadow: 0 18px 42px rgba(35, 53, 119, 0.18);
  color: #fff;
}
.demo-hero h1 {
  font-size: clamp(1.9rem, 3vw, 2.75rem);
  line-height: 1.15;
}
.demo-eyebrow {
  margin-bottom: 8px;
  color: #cdd5ff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.demo-subtitle {
  max-width: 760px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.84);
  line-height: 1.7;
}
.demo-card {
  margin-top: 24px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 38px rgba(28, 42, 93, 0.09) !important;
  overflow: hidden;
}
.demo-card__body {
  padding: 24px !important;
}
.demo-intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-bottom: 20px;
}
.demo-intro h2 {
  color: #1e2b54;
  font-size: 1.35rem;
  line-height: 1.3;
}
.demo-intro p:last-child {
  max-width: 520px;
  margin: 0;
  color: #5e6884;
}
.demo-section-label {
  margin: 0 0 4px;
  color: #5265b6;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}
.demo-controls,
.demo-feedback {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.demo-controls {
  padding-bottom: 16px;
  border-bottom: 1px solid #e8eaf2;
}
.demo-feedback {
  justify-content: space-between;
  color: #5e6884;
  font-size: 0.875rem;
}
@media (max-width: 600px) {
  .demo-shell {
    padding: 16px 12px !important;
  }
  .demo-hero {
    flex-direction: column;
    padding: 28px 24px;
    border-radius: 16px;
  }
  .demo-card__body {
    padding: 16px !important;
  }
}
</style>
