<template>
  <div>
    <nav class="demo-navigation" aria-label="Demo examples">
      <a href="#orders" :aria-current="view === 'orders' ? 'page' : undefined">Orders · سفارش‌ها</a>
      <a href="#data" :aria-current="view === 'data' ? 'page' : undefined">Local / API · محلی و سرور</a>
      <a href="https://www.npmjs.com/package/vue2-smart-datatable/v/0.3.0" target="_blank" rel="noopener noreferrer"
        >v0.3.0 · npm</a
      >
    </nav>
    <OrdersDemo v-if="view === 'orders'" />
    <DataDemo v-else />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import OrdersDemo from './orders/OrdersDemo.vue'
import DataDemo from './DataDemo.vue'

export default Vue.extend({
  components: { OrdersDemo, DataDemo },
  data: () => ({ view: 'orders' as 'orders' | 'data' }),
  mounted() {
    this.updateView()
    window.addEventListener('hashchange', this.updateView)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.updateView)
  },
  methods: {
    updateView() {
      this.view = window.location.hash === '#data' ? 'data' : 'orders'
    },
  },
})
</script>
<style>
.demo-navigation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
  padding: 12px max(12px, 5vw);
  background: #fff;
  border-bottom: 1px solid #dfe7e4;
  font:
    13px/1.6 system-ui,
    Tahoma,
    sans-serif;
}
.demo-navigation a {
  padding: 6px 0;
  color: #52665f;
  text-decoration: none;
}
.demo-navigation a[aria-current='page'] {
  color: #087f68;
  box-shadow: inset 0 -2px currentColor;
  font-weight: 650;
}
.demo-navigation a:focus-visible {
  outline: 2px solid #087f68;
  outline-offset: 3px;
}
.demo-navigation a:last-child {
  margin-inline-start: auto;
}
</style>
