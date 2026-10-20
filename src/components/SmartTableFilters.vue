<template>
  <v-card outlined class="sdt-filters">
    <v-card-text class="sdt-filters__grid">
      <div v-for="column in filterColumns" :key="column.key" class="sdt-filter">
        <slot
          :name="`filter.${column.key}`"
          :column="column"
          :clause="value[column.key]"
          :set-clause="setClauseFor(column.key)"
          :clear="clearFor(column.key)"
        >
          <v-select
            class="sdt-filter__operator"
            dense
            outlined
            hide-details
            :label="column.label"
            :items="operatorItems(column)"
            :value="clauseFor(column).operator"
            :disabled="disabled"
            @change="setOperator(column, $event)"
          />
          <template v-if="clauseFor(column).operator === 'between'">
            <v-text-field
              dense
              outlined
              hide-details
              :type="inputType(column)"
              :placeholder="'From'"
              :value="clauseFor(column).from"
              :disabled="disabled"
              @input="setBetween(column, 'from', $event)"
            />
            <v-text-field
              dense
              outlined
              hide-details
              :type="inputType(column)"
              :placeholder="'To'"
              :value="clauseFor(column).to"
              :disabled="disabled"
              @input="setBetween(column, 'to', $event)"
            />
          </template>
          <v-select
            v-else-if="filterType(column) === 'select'"
            dense
            outlined
            hide-details
            clearable
            :items="column.options || []"
            item-text="label"
            item-value="value"
            :multiple="clauseFor(column).operator === 'in'"
            :value="clauseFor(column).value"
            :disabled="disabled"
            @change="setValue(column, $event)"
          />
          <v-text-field
            v-else
            dense
            outlined
            hide-details
            clearable
            :type="inputType(column)"
            :placeholder="column.filter && column.filter.placeholder"
            :value="clauseFor(column).value"
            :disabled="disabled"
            @input="setValue(column, $event)"
          />
        </slot>
      </div>
    </v-card-text>
    <v-card-actions
      ><v-spacer /><v-btn text small :disabled="disabled" @click="!disabled && $emit('input', {})">{{
        messages.clearFilters
      }}</v-btn></v-card-actions
    >
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
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
      return (column.filter?.operators || operatorsByType[type]).map((value) => ({ text: value, value }))
    },
    inputType(column: DataTableColumn): string {
      const type = this.filterType(column)
      return type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'
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
      this.setClause(column.key, { ...previous, operator })
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
