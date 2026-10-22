import Vue from 'vue'
import RendererLab from './RendererLab.vue'
import '@/styles/index.scss'

new Vue({ render: (h) => h(RendererLab) }).$mount('#app')
