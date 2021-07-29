<template>
  <div class="container pt-8">
    <mixer-data></mixer-data>
    <v-divider class="my-10"></v-divider>
    <presentation-data v-if="mixerOn"></presentation-data>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import mixerData from '../components/mixingDesk/MixerData.vue';
  import presentationData from '../components/presentationTable/PresentationData.vue';

  export default {
    name: 'Main',
    components: {
      mixerData,
      presentationData,
    },
    created() {
      console.log(this.$route.params.id);
    },
    computed: {
      ...mapState({
        mixerOn: state => state.mixingDesk.isOBS || state.mixingDesk.isVMix
      })
    }
  }
</script>
