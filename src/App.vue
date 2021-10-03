<template>
  <v-app>
    <app-header />
    <v-main>
      <router-view/>
    </v-main>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import appHeader from "./components/header/Header.vue"

export default {
  name: 'App',

  components: {
      appHeader
  },
  computed: {
      ...mapState({
          snackbar: state => state.snackbar
      })
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
.v-input.justify textarea {
    text-align: justify;
}
</style>
