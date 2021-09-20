<template>
    <div class="d-flex align-center mt-3">
        <v-btn
            v-if="!connection.status"
            :loading="connection.loading"
            outlined
            tile
            color="success"
            :disabled="!isValid"
            @click="connect"
            class="mr-5"
        >
            Подключиться
        </v-btn>
        <v-btn
            v-else
            outlined
            tile
            color="error"
            @click="disconnect"
            class="mr-5"
        >
            Отключиться
        </v-btn>
        <v-alert
            v-if="connection.text"
            dense
            :type="connection.alertColor"
            class="mb-0 alert-width"
        >
            {{ connection.text }}
        </v-alert>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { eventBus } from '../../main';

export default {
    data() {
        return {
            isValid: false
        }
    },
    created() {
        eventBus.$on('validity-value-changed', payload => {
            this.isValid = payload
        })
    },
    methods: {
        ...mapActions(['connectOBS', 'disconnectOBS', 'connectVMix']),
        connect() {
            if (this.isOBS) {
                this.connectOBS()
            } else {
                this.connectVMix()
            }
        },
        disconnect() {
            if (this.isOBS) {
                this.disconnectOBS()
            } else {
                this.connectVMix()
            }
        }
    },
    computed: {
    ...mapState({
        connection: state => state.connection,
        isOBS: state => state.mixingDesk.isOBS,
    })
    }
}
</script>

<style lang="scss" scoped>

</style>