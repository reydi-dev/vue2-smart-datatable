import Vue from 'vue'
import App from './App.vue'
import vuetify from './vuetify'
import './icons.scss'
import 'vuetify/dist/vuetify.min.css'
import '@/styles/index.scss'

new Vue({ vuetify, render: (h) => h(App) }).$mount('#app')
