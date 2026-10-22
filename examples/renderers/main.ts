import Vue from 'vue'
import OrdersDemo from '../orders/OrdersDemo.vue'
import '@/styles/index.scss'

new Vue({ render: (h) => h(OrdersDemo) }).$mount('#app')
