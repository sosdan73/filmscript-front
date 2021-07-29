<template>
  <v-app>
    <v-app-bar
      app
      color="gray lighten-5"
      dark
    >
      <h1>Сценарий съемки</h1>
      <v-spacer></v-spacer>
      <v-btn
        tile
        color="secondary"
      >
        <v-icon left>
          mdi-cog
        </v-icon>
        Настройки
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
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
