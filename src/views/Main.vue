<template>
    <div class="container pt-8">
        <mixer-data></mixer-data>
        <v-divider class="my-10"></v-divider>
        <presentation-table v-if="showTable"></presentation-table>
    </div>
</template>

<script>
import { mapState } from "vuex";
import mixerData from "../components/mixingDesk/MixerData.vue";
import presentationTable from "../components/presentationTable/PresentationTable.vue";

export default {
    name: "Main",
    components: {
        mixerData,
        presentationTable,
    },
    computed: {
        ...mapState({
            mixerOn: (state) => state.mixingDesk.isOBS || state.mixingDesk.isVMix,
            transitions: state => state.transitions,
            sources: state => state.sources,
            isVmix: state => state.mixingDesk.isVMix,
        }),
        showTable() {
            if (!this.mixerOn) {
                return this.mixerOn
            }
            return this.transitions[this.isVmix ? 'vmix' : 'obs'].length && this.sources[this.isVmix ? 'vmix' : 'obs'].length
        }
    },
};
</script>
