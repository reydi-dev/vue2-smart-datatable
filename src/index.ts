import SmartDataTable from './components/SmartDataTable.vue'
import './styles/index.scss'

export { SmartDataTable }
export { createCsvExporter } from './adapters/exporters/csv'
export { createLocalStoragePersistenceAdapter } from './adapters/persistence/local-storage'
export * from './types'
export default SmartDataTable
