<template>
  <section class="sdt-filters" :aria-label="messages.filters">
    <div class="sdt-filters__grid">
      <div v-for="column in filterColumns" :key="column.key" class="sdt-filter">
        <slot
          :name="`filter.${column.key}`"
          :column="column"
          :clause="value[column.key]"
          :set-clause="setClauseFor(column.key)"
          :clear="clearFor(column.key)"
        >
          <label
            ><span>{{ column.label }} · {{ messages.filterOperator || 'Condition' }}</span>
            <select
              class="sdt-filter__operator"
              :value="clauseFor(column).operator"
              :disabled="disabled"
              @change="changeOperator(column, $event)"
            >
              <option v-for="item in operatorItems(column)" :key="item.value" :value="item.value">
                {{ item.text }}
              </option>
            </select>
          </label>
          <template v-if="clauseFor(column).operator === 'between'">
            <label
              ><span>{{ column.label }} · {{ messages.filterFrom || 'From' }}</span
              ><input
                :type="inputType(column)"
                :value="clauseFor(column).from"
                :disabled="disabled"
                @input="changeInput(column, $event, 'from')"
            /></label>
            <label
              ><span>{{ column.label }} · {{ messages.filterTo || 'To' }}</span
              ><input
                :type="inputType(column)"
                :value="clauseFor(column).to"
                :disabled="disabled"
                @input="changeInput(column, $event, 'to')"
            /></label>
          </template>
          <label v-else-if="filterType(column) === 'select'"
            ><span>{{ column.label }} · {{ messages.filterValue || 'Value' }}</span>
            <select
              :multiple="clauseFor(column).operator === 'in'"
              :value="optionIndices(column)"
              :disabled="disabled"
              @change="changeOptions(column, $event)"
            >
              <option v-if="clauseFor(column).operator !== 'in'" value="">
                {{ messages.filterAny || 'Any value' }}
              </option>
              <option v-for="(option, index) in column.options || []" :key="index" :value="String(index)">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label v-else
            ><span>{{ column.label }} · {{ messages.filterValue || 'Value' }}</span
            ><input
              :type="inputType(column)"
              :placeholder="column.filter && column.filter.placeholder"
              :value="clauseFor(column).value"
              :disabled="disabled"
              @input="changeInput(column, $event)"
          /></label>
          <button
            type="button"
            class="sdt-control sdt-filter__clear"
            :disabled="disabled || !value[column.key]"
            :aria-label="`${messages.clearFilter || 'Clear filter'}: ${column.label}`"
            @click="clear(column.key)"
          >
            {{ messages.clearFilter || 'Clear filter' }}
          </button>
        </slot>
      </div>
    </div>
    <footer>
      <button type="button" class="sdt-control" :disabled="disabled" @click="!disabled && $emit('input', {})">
        {{ messages.clearFilters }}
      </button>
    </footer>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { defaultMessages } from '../core/messages'
import { operatorDefaults, operatorsByType } from '../core/filters'
import type { DataTableColumn, DataTableMessages, FilterClause, FilterOperator, FilterState } from '../types'

export default Vue.extend({
  name: 'SmartTableFilters',
  props: {
    columns: { type: Array as () => DataTableColumn[], required: true },
    value: { type: Object as () => FilterState, required: true },
    messages: { type: Object as () => DataTableMessages, required: true },
    disabled: Boolean,
  },
  computed: {
    filterColumns(): DataTableColumn[] {
      return this.columns.filter((column) => column.filterable)
    },
  },
  methods: {
    filterType(column: DataTableColumn): 'text' | 'number' | 'date' | 'select' {
      const type = column.filter?.type || column.type || 'text'
      return ['number', 'date', 'select'].includes(type) ? (type as any) : 'text'
    },
    clauseFor(column: DataTableColumn): FilterClause {
      const type = this.filterType(column)
      return this.value[column.key] || { operator: column.filter?.defaultOperator || operatorDefaults[type] }
    },
    operatorItems(column: DataTableColumn) {
      const type = this.filterType(column)
      return (column.filter?.operators || operatorsByType[type]).map((value) => ({
        text: this.messages.filterOperators?.[value] || defaultMessages.filterOperators[value],
        value,
      }))
    },
    inputType(column: DataTableColumn): string {
      const type = this.filterType(column)
      return type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'
    },
    changeOperator(column: DataTableColumn, event: Event) {
      this.setOperator(column, (event.target as HTMLSelectElement).value as FilterOperator)
    },
    changeInput(column: DataTableColumn, event: Event, bound?: 'from' | 'to') {
      const text = (event.target as HTMLInputElement).value
      const value = this.filterType(column) === 'number' && text !== '' ? Number(text) : text
      if (bound) this.setBetween(column, bound, value)
      else this.setValue(column, value)
    },
    optionIndices(column: DataTableColumn): string | string[] {
      const value = this.clauseFor(column).value
      const options = column.options || []
      if (this.clauseFor(column).operator === 'in')
        return options.flatMap((option, index) =>
          Array.isArray(value) && value.some((item) => Object.is(item, option.value)) ? [String(index)] : [],
        )
      const index = options.findIndex((option) => Object.is(option.value, value))
      return index < 0 ? '' : String(index)
    },
    changeOptions(column: DataTableColumn, event: Event) {
      const select = event.target as HTMLSelectElement
      const options = column.options || []
      this.setValue(
        column,
        select.multiple
          ? Array.from(select.selectedOptions).map((option) => options[Number(option.value)]?.value)
          : select.value === ''
            ? undefined
            : options[Number(select.value)]?.value,
      )
    },
    setClause(key: string, clause: FilterClause) {
      if (this.disabled) return
      this.$emit('input', { ...this.value, [key]: clause })
    },
    setClauseFor(key: string) {
      return (clause: FilterClause) => this.setClause(key, clause)
    },
    clearFor(key: string) {
      return () => this.clear(key)
    },
    clear(key: string) {
      if (this.disabled) return
      const next = { ...this.value }
      delete next[key]
      this.$emit('input', next)
    },
    setOperator(column: DataTableColumn, operator: FilterOperator) {
      const previous = this.clauseFor(column)
      this.setClause(column.key, {
        ...previous,
        operator,
        value:
          operator === 'in'
            ? Array.isArray(previous.value)
              ? previous.value
              : previous.value === undefined || previous.value === ''
                ? []
                : [previous.value]
            : Array.isArray(previous.value)
              ? previous.value[0]
              : previous.value,
      })
    },
    setValue(column: DataTableColumn, value: unknown) {
      this.setClause(column.key, { ...this.clauseFor(column), value })
    },
    setBetween(column: DataTableColumn, key: 'from' | 'to', value: unknown) {
      this.setClause(column.key, { ...this.clauseFor(column), [key]: value })
    },
  },
})
</script>
