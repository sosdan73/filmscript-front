<template>
  <div>
    <h2 class="mb-3">Учетные данные:</h2>
    <v-form v-model="valid">
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            :disabled="disabled"
            v-model="connectionData.ip"
            :rules="ipRules"
            label="IP-адрес микшера"
            required
          ></v-text-field>
        </v-col>
        <v-col
          v-if="mixerIsOBS"
          cols="12"
          md="4"
        >
          <v-text-field
            :disabled="disabled"
            v-model="connectionData.port"
            :counter="4"
            label="Номер порта"
          ></v-text-field>
        </v-col>
        <v-col
          v-if="mixerIsOBS"
          cols="12"
          md="4"
        >
          <v-text-field
            :disabled="disabled"
            type="password"
            v-model="connectionData.password"
            label="Пароль"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { eventBus } from '../../main';
  import inputIp from '../inputIP.vue';

  export default {
    components: {
      inputIp,
    },
    data() {
      return {
        valid: false,
        ipRules: [
          v => this.ipFormatCheck || 'Неверный формат. Пример: 192.168.0.1',
          v => this.octetFormatCheck || 'Числа должны быть в диапазоне от 0 до 256',
        ],
      }
    },
    methods: {
      connect() {
        console.log('заглушка');
      }
    },
    computed: {
      ...mapState({
        mixerIsOBS: state => state.mixingDesk.isOBS,
        mixerIsVMix: state => state.mixingDesk.isVMix,
        connectionData: state => state.connectionData,
        connection: state => state.connection,
      }),
      disabled() {
        return this.connection.loading || this.connection.status
      },
      ipFormatCheck() {
        const re_ip = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        return re_ip.test(this.connectionData.ip);
      },
      octetFormatCheck() {
        let valid = true;
        const ip = this.connectionData.ip.split('.');
        ip.forEach(octet => {
          if (String(octet).length > 1 && String(octet)[0] == '0') valid = false;
          if (octet < 0 || octet > 255) valid = false;
        })
        return valid
      },
      ipIsValid() {
        return this.ipFormatCheck ? this.octetFormatCheck : false
      },
      portIsValid() {
        return !isNaN(Number(this.connectionData.port)) && String(this.connectionData.port).length <= 4 && String(this.connectionData.port).length >= 1
      },
      isValid() {
        if (this.mixerIsOBS) {
          return this.ipIsValid && this.portIsValid && this.connectionData.password
        } else if (this.mixerIsVMix) {
          return this.ipIsValid
        }
        return false
      }
    },
    watch: {
      isValid(payload) {
        eventBus.$emit('validity-value-changed', payload)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .alert-width {
    min-width: 170px;
  }
</style>