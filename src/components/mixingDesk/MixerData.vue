<template>
    <div>
        <mixing-desk></mixing-desk>
        <mixer-ip></mixer-ip>
        <connection-buttons></connection-buttons>
    </div>
</template>

<script>
import mixingDesk from './MixingDesk.vue';
import mixerIp from './MixingDeskIP.vue';
import connectionButtons from './ConnectionButtons.vue'

export default {
    components: {
        mixingDesk,
        mixerIp,
        connectionButtons
    }
}
</script>
