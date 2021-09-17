<template>
  <v-app>
    <app-header />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import appHeader from "./components/header/Header.vue"

export default {
  name: 'App',

  components: {
      appHeader
  }
};
</script>

<style lang="scss">
input {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  outline: none;
}
</style>
