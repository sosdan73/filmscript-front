<template>
  <div
    class="row"
    :class="{'obs': isOBS, 'vmix': isVMix}"
  >
    <v-checkbox v-model="data.checked"></v-checkbox>
    <v-text-field
      v-model="data.slideNumber"
    ></v-text-field>
    <v-text-field
      v-model="data.source"
    ></v-text-field>
    <v-select
      :items="backend.transitionsVMix"
      v-model="data.transition"
    ></v-select>
    <v-text-field
      v-if="isVMix"
      v-model="data.overlay1"
    ></v-text-field>
    <v-text-field
      v-if="isVMix"
      v-model="data.overlay2"
    ></v-text-field>
    <v-text-field
      v-if="isVMix"
      v-model="data.overlay3"
    ></v-text-field>
    <v-text-field
      v-if="isVMix"
      v-model="data.overlay4"
    ></v-text-field>
    <v-textarea
      rows="1"
      v-model="data.promptText"
    ></v-textarea>
    <v-btn
      icon
      dark
      small
      color="red"
      @click="deleteRow"
    >
      <v-icon dark>
        mdi-delete
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    props: ['data'],
    methods: {
      deleteRow() {
        this.$emit('delete-row')
      }
    },
    computed: {
      ...mapState({
        isOBS: state => state.mixingDesk.isOBS,
        isVMix: state => state.mixingDesk.isVMix,
        backend: state => state.backend,
      })
    }
  }
</script>

<style lang="scss" scoped>
  .row {
    display: grid;
    place-items: center;
    gap: 5px;
  }
  .vmix {
    grid-template-columns: minmax(40px, 1fr) minmax(60px, 2fr) repeat(6, minmax(120px, 3fr)) minmax(200px, 4fr) minmax(40px, 1fr);
    min-width: calc(1105px);
  }
  .obs {
    grid-template-columns: minmax(40px, 1fr) minmax(60px, 2fr) repeat(2, minmax(120px, 3fr)) minmax(200px, 4fr) minmax(40px, 1fr);
    min-width: calc(605px);
  }
</style>