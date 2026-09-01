<template>
  <v-app
    ><v-main
      ><v-container fluid>
        <h1>Smart Data Table v0.1.0</h1>
        <v-btn-toggle v-model="mode" mandatory class="mb-3"
          ><v-btn value="local">Local</v-btn><v-btn value="server">Server</v-btn></v-btn-toggle
        >
        <v-switch v-model="rtl" label="RTL" class="d-inline-flex ml-4" />
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
          <template #toolbar-prepend
            ><strong>{{ mode === 'local' ? 'Local data' : 'Normalized server data' }}</strong></template
          >
          <template #cell.email="{ formattedValue }"
            ><a :href="`mailto:${formattedValue}`">{{ formattedValue }}</a></template
          >
        </SmartDataTable>
        <p data-testid="selection">Selected: {{ selected.join(', ') || 'none' }}</p>
        <p>{{ lastAction }}</p>
      </v-container></v-main
    ></v-app
  >
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
