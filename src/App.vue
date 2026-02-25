<template>
  <v-app>
    <v-main class="main-bg">
      <BowlingRandomizer />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import BowlingRandomizer from '@/components/BowlingRandomizer.vue'
</script>

<style>
.main-bg {
  min-height: 100dvh;
  background: #0f0f0f;
}
</style>
