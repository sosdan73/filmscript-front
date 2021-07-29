<template>
  <div class="d-flex align-center d-flex-gap mb-8">
    <h2>Микшер:</h2>
    <v-btn
      outlined
      tile
      :color="mixerIsOBS ? 'success' : 'error'"
      :elevation="mixerIsOBS ? 0 : 4"
      :disabled="(connection.loading || connection.status) && !mixerIsOBS"
      @click="chooseMix('obs')"
    >
      OBS
    </v-btn>
    <v-btn
      outlined
      tile
      :color="mixerIsVMix ? 'success' : 'error'"
      :elevation="mixerIsVMix ? 0 : 4"
      :disabled="(connection.loading || connection.status) && !mixerIsVMix"
      @click="chooseMix('vmix')"
    >
      vMix
    </v-btn>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';

  export default {
    methods: {
      ...mapMutations(['setMixingDesk']),
      chooseMix(param) {
        if (!this.connection.loading && !this.connection.status) {
          this.setMixingDesk(param);
        }
      }
    },
    computed: {
      ...mapState({
        mixerIsOBS: state => state.mixingDesk.isOBS,
        mixerIsVMix: state => state.mixingDesk.isVMix,
        connection: state => state.connection,
      })
    }
  }
</script>

<style lang="scss" scoped>
  .d-flex-gap {
    gap: 25px;
  }
</style>