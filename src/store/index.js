import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { obs } from '../main'

// import OBSWebSocket from 'obs-websocket-js';
// const obs = new OBSWebSocket();

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mixingDesk: {
      isOBS: false,
      isVMix: false
    },
    presentationTables: [],
    connectionData: {
      ip: '',
      port: '',
      password: ''
    },
    connection: {
      status: false,
      loading: false,
      text: '',
      alertColor: '',
    },
    courses: [],
    classes: [],
    activeCourse: undefined,
    activeClass: undefined,
    mqtt: {
        server: '',
        user: '',
        password: '',
        port: undefined,
        sslPort: undefined,
        websocketsPort: undefined,
    },
    sources: {
        obs: [],
        vmix: []
    },
    transitions: {
        obs: [],
        vmix: [
        'Cut',
        'Fade',
        'Zoom',
        'Slide',
        'Fly',
        'CrossZoom',
        'FlyRotate',
        'Cube',
        'CubeZoom',
        'VerticalWipe',
        'VerticalSlide',
        'Merge',
        'WipeReverse',
        'SlideReverse',
        'VerticalWipeReverse',
        'VerticalSlideReverse',
        'Stinger1',
        'Stinger2',
        ]
    }
  },


  mutations: {
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
    // Classes
    async getClasses(s, id) {
        const state = s.state;
        axios.post(
            process.env.VUE_APP_LINK+'/get-classes', {
            courseId: id
        })
        .then(data => {
            state.classes = [];
            if (data.data && data.data.length) {
                data.data.forEach(cl => {
                    if (cl.presentation.length > 0) {
                        cl.presentation.forEach(row => {
                            row.checked = false;
                        })
                    }
                    state.classes.push({
                        courseId: cl.courseId,
                        id: cl._id,
                        number: cl.number,
                        name: cl.name,
                        presentation: cl.presentation
                    })
                })
            }
        })
        .catch(err => {
            console.error(err);
        })
    },
    async postClass(s, newClass) {
        const state = s.state;
        axios.post(process.env.VUE_APP_LINK+'/create-class', {
            courseId: state.activeCourse.id,
            number: newClass.number,
            name: newClass.name
        })
        .catch(err => {
            console.error(err);
        })
    },
    async updateClass(s) {
        const state = s.state;
        axios.post(
            process.env.VUE_APP_LINK+'/update-presentation',
            {
                id: state.activeClass.id,
                presentation: state.activeClass.presentation
            }
        )
        .catch(err => {
            console.error(err);
        })
    },
    // Courses
    async getCourses(s) {
        const state = s.state;
        axios.get(process.env.VUE_APP_LINK+'/get-courses')
        .then(data => {
            if (data.data.length) {
                state.courses = [];
                data.data.forEach(course => {
                    state.courses.push({
                        id: course._id,
                        name: course.name,
                        teacher: course.teacher
                    })
                })
            }
        }).catch(err => {
            console.error(err)
        })
    },
    async createCourse(s, payload) {
        const state = s.state;
        axios.post(process.env.VUE_APP_LINK+'/post-course', {
            name: payload.name,
            teacher: payload.teacher
        })
        .catch(err => {
            console.error(err)
        })
    },
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
        axios.post(process.env.VUE_APP_LINK+'/put-mqtt', {
            server: mqtt.server,
            user: mqtt.user,
            password: mqtt.password,
            port: Number(mqtt.port),
            sslPort: Number(mqtt.sslPort),
            websocketsPort: Number(mqtt.websocketsPort)
        })
        .then(data => {
            console.log(data);
        }).catch(err => {
            console.error(err)
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
        }).catch(err => {
            console.error(err)
        })
        .finally(() => {
            state.connection.loading = false;
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

    // vMix
    async connectVMix(s) {
        const state = s.state;
        axios.post(process.env.VUE_APP_LINK+'/connect-vmix', {
            address: state.connectionData.ip,
        })
        .then(data => {
            console.log(data);
        }).catch(err => {
            console.error(err)
        })
    },
  },
})
