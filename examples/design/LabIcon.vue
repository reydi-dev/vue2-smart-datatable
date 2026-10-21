<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name] || paths.grid" />
  </svg>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: { name: { type: String, default: 'grid' } },
  data: () => ({
    paths: {
      grid: 'M3 3h18v18H3zM3 9h18M9 9v12',
      search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
      filter: 'M4 7h16M7 12h10M10 17h4M8 5v4M16 10v4',
      columns: 'M3 4h18v16H3zM10 4v16M16 4v16',
      download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
      arrow: 'm9 5 7 7-7 7',
      sort: 'M8 4v16m-4-4 4 4 4-4M16 20V4m-4 4 4-4 4 4',
      close: 'm6 6 12 12M6 18 18 6',
      check: 'm5 12 4 4L19 6',
      box: 'm3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10M7 5l9 4',
      retry: 'M20 7v5h-5M4 17v-5h5M20 12a8 8 0 0 0-14-5M4 12a8 8 0 0 0 14 5',
      external: 'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
    } as Record<string, string>,
  }),
})
</script>
