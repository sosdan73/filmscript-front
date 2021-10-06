import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { obs } from '../main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    snackbar: {
        show: false,
        text: '',
        color: '',
        time: 3000,
    },
    mixingDesk: {
        isOBS: true,
        isVMix: false
    },
    presentationTables: [],
    connectionData: {
      ip: '127.0.0.1',
      port: '4444',
      password: ''
    },
    connection: {
      status: false,
      loading: false,
      text: '',
      alertColor: '',
    },
    activeClass: {
        presentation: []
    },
    mqtt: {
        server: '',
        user: '',
        password: '',
        port: undefined,
    },
    sources: {
        obs: [],
    },
    transitions: {
        obs: []
    }
  },


  mutations: {
    showSnackbar(state, payload) {
        state.snackbar.show = true;
        state.snackbar.text = payload.text;
        state.snackbar.color = payload.color
    },
    setMixingDesk(state, payload) {
        state.mixingDesk.isOBS = payload === 'obs';
        state.mixingDesk.isVMix = payload !== 'obs'
    },
    addRow(state) {
        const row = {
            checked: false,
            source: '',
            scene: '',
            overlay1: '',
            overlay2: '',
            overlay3: '',
            overlay4: '',
            promptText: ''
        };
        row.slideNumber = state.activeClass.presentation.length === 0 ? 1 : Math.max(...state.activeClass.presentation.map(row => row.slideNumber)) + 1;
        row.transition = state.transitions[state.mixingDesk.isOBS ? 'obs' : 'vmix'][0];
        state.activeClass.presentation.push(row)
    },
    deleteRow(state, payload) {
      const index = state.activeClass.presentation.map(table => table.slideNumber).indexOf(payload.slideNumber);
      state.activeClass.presentation.splice(index, 1)
    },
    establishConnection(state) {
      state.connection = true
    },
    abortConnection(state) {
      state.connection = false
    },
    setActiveCourse(state, payload) {
        state.activeCourse = payload;
    },
    setActiveClass(state, payload) {
        state.activeClass = payload;
    },
    setPresentation(state, pres) {
        state.activeClass.presentation = pres
    }
  },


  actions: {
    // MQTT
    async getMqtt(s) {
        const state = s.state;
        // Получение данных MQTT, затем присваивание их в стейт
        axios.get(process.env.VUE_APP_LINK+'/get-mqtt')
        .then(data => {
            state.mqtt = {
                server: data.data[0].server,
                user: data.data[0].user,
                password: data.data[0].password,
                port: data.data[0].port,
                sslPort: data.data[0].sslPort,
                websocketsPort: data.data[0].websocketsPort,
            }
        }).catch(err => {
            console.error(err)
        })
    },
    async saveMqtt(s) {
        const state = s.state;
        const mqtt = state.mqtt;
        axios.post(process.env.VUE_APP_SAVE_MQTT, {
            server: mqtt.server,
            user: mqtt.user,
            password: mqtt.password,
            port: Number(mqtt.port)
        })
        .then(() => {
            s.commit('showSnackbar', {
                text: 'Данные сохранены',
                color: 'success'
            });
        })
        .catch(err => {
            s.commit('showSnackbar', {
                text: 'Ошибка подключения',
                color: 'error'
            });
        })
    },

    // Connection data
    async getConnectionData(s) {
        const state = s.state;
        state.connection.loading = true;
        axios.get(process.env.VUE_APP_GET_OBS_DATA)
        .then(data => {
            console.log('connection data here');
            console.log(data);
            if (data) {
                state.connectionData = {
                    ip: data.address,
                    port: data.port,
                    password: data.password ? data.password : ''
                };
                s.dispatch('connectOBS');
            }
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            state.connection.loading = false;
        })
    },

    async postConnectionData(s) {
        const state = s.state;
        state.connection.loading = true;
        axios.post(process.env.VUE_APP_POST_OBS_DATA, {
            address: state.connectionData.ip,
            port: state.connectionData.port,
            password: state.connectionData.password
        })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            state.connection.loading = false;
        })
    },

    // OBS
    async connectOBS(s) {
        const state = s.state;
        state.connection.loading = true;
        obs.connect({
            address: `${state.connectionData.ip}:${state.connectionData.port}`,
            password: state.connectionData.password
        })
        .then(() => {
            return obs.send('GetSceneList')
        })
        .then(data => {
            console.log(data);
            state.sources.obs = [];
            data.scenes.forEach(scene => {
                state.sources.obs.push(scene)
            })
            return obs.send('GetTransitionList')
        })
        .then(data => {
            state.connection.status = true;
            state.connection.text = 'Cоединение установлено';
            state.connection.alertColor = 'success';

            state.transitions.obs = [];
            data.transitions.forEach(transition => {
                state.transitions.obs.push(transition)
            })

            obs.on('ScenesChanged', () => {
                s.dispatch('getScenesOBS')
            });
        }).then(() => {
            s.dispatch('getTable')
        }).catch(err => {
            console.error(err);
            s.commit('showSnackbar', {
                text: 'Ошибка подключения',
                color: 'error'
            });
        })
        .finally(() => {
            state.connection.loading = false;
        })
    },

    async getScenesOBS(s) {
        const state = s.state;
        obs.send('GetSceneList')
        .then(data => {
            state.sources.obs = [];
            data.scenes.forEach(scene => {
                state.sources.obs.push(scene)
            })
            s.commit('showSnackbar', {
                text: 'Сцены OBS изменены',
                color: 'warning'
            });
        })
        .catch(err => {
            console.error(err);
            s.commit('showSnackbar', {
                text: 'Ошибка подключения',
                color: 'error'
            });
        })
    },

    async disconnectOBS(s) {
        const state = s.state;
        obs.disconnect();
        state.connection.status = false;
        state.connection.text = 'Cоединение разорвано';
        setTimeout(() => {
            state.connection.text = ''
        }, 3000)
        state.connection.alertColor = 'warning';
    },

    // Table communication
    async postTable(s) {
        const state = s.state;
        const table = [];
        const transition = {
            'Обрезка': 'Cut',
            'Затухание': 'Fade'
        }
        table.push([]);
        if (state.activeClass.presentation.length) {
            state.activeClass.presentation.forEach(item => {
                table.push([
                    String(item.slideNumber),
                    state.mixingDesk.isOBS ? item.scene : item.source,
                    item.transition.length && !item.transition[0].match(/[a-z]/i) ? transition[item.transition] : item.transition.name,
                    item.overlay1,
                    item.overlay2,
                    item.overlay3,
                    item.overlay4,
                    null,
                    null,
                    item.promptText
                ]);
            })
        }
        console.log(table);
        axios.post(process.env.VUE_APP_POST_TABLE, table)
        .then(() => {
            s.commit('showSnackbar', {
                text: 'Данные сохранены',
                color: 'success'
            });
        })
        .catch(() => {
            s.commit('showSnackbar', {
                text: 'Ошибка подключения',
                color: 'error'
            });
        })
    },
    // Table communication
    async getTable(s) {
        const state = s.state;
        const transition = {
            'Cut': 'Обрезка',
            'Fade': 'Затухание'
        }
        axios.get(process.env.VUE_APP_GET_TABLE)
        .then(data => {
            if (data && data.length) {
                state.activeClass.presentation = []
                data.forEach((item, index) => {
                    if (index > 0) {
                        const row = {
                            checked: false,
                            slideNumber: Number(item[0]),
                            scene: item[1],
                            source: '',
                            transition: item[2].length && item[2].match(/[a-z]/i) ? transition[item[2]] : item[2],
                            overlay1: item[3],
                            overlay2: item[4],
                            overlay3: item[5],
                            overlay4: item[6],
                            promptText: item[9]
                        };
                        state.activeClass.presentation.push(row)
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    },
  },
})
