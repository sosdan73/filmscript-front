<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            tile
            color="secondary"
            v-bind="attrs"
            v-on="on"
            @click="getCourses"
        >
            <v-icon left>
                mdi-cog
            </v-icon>
            Настройки
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Настройки MQTT
        </v-card-title>

        <v-card-text>
            <v-form
                ref="form"
            >
                <v-text-field
                    v-model="mqtt.server"
                    label="Сервер"
                ></v-text-field>

                <v-text-field
                    v-model="mqtt.user"
                    label="Пользователь"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="mqtt.password"
                    label="Пароль"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="mqtt.port"
                    label="Порт"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="mqtt.sslPort"
                    label="SSL-порт"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="mqtt.websocketsPort"
                    label="Websocket-порт"
                    required
                ></v-text-field>
            </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn
                tile
                color="success"
                class="px-4"
                @click="saveMqtt"
            >
                Сохранить
            </v-btn>
           <v-btn
                tile
                color="error"
                class="px-4 ml-4"
                @click="dialog = false"
            >
                Закрыть
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';

    export default {
        data() {
            return {
                dialog: false,
            }
        },
        methods: {
            ...mapActions(['saveMqtt', 'getCourses'])
        },
        computed: {
            ...mapState({
                mqtt: state => state.mqtt
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>