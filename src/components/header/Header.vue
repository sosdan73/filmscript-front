<template>
    <v-app-bar
      app
      color="gray lighten-5"
      dark
    >
      <h1 @click="$router.push('/')">Сценарий съемки</h1>
      <v-spacer></v-spacer>
      <mqtt />
    </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex';
    import mqtt from "./Mqtt.vue";

    export default {
        components: {
            mqtt
        },
        created() {
            this.getMqtt();
        },
        methods: {
            ...mapActions(["getMqtt"]),
        }
    }
</script>

<style lang="scss" scoped>
h1 {
    cursor: pointer;
}
</style>