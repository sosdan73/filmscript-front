<template>
  <div>
    <!-- <div v-if="!connectionStatus"> -->
      <mixing-desk></mixing-desk>
      <mixer-ip></mixer-ip>
    <!-- </div> -->
    <connection-buttons></connection-buttons>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import mixingDesk from './MixingDesk.vue';
  import mixerIp from './MixingDeskIP.vue';
  import connectionButtons from './ConnectionButtons.vue'

  export default {
    components: {
      mixingDesk,
      mixerIp,
      connectionButtons
    },
    computed: {
      ...mapState({
        connectionStatus: state => state.connection.status
      })
    }
  }
</script>

<style lang="scss" scoped>

</style>