import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
    backend: {
    //   sourcesOBS: [
    //     '57 front',
    //     'Евсютин',
    //     'King 77'
    //   ],
    //   sourcesVMix: [
    //     'NDI TEACHER (Intel(R) UHD Graphics 1)',
    //     'VLC rtsp://172.18.191.57:554/stream/main',
    //     'Colour',
    //   ],
      transitionsOBS: [
        'trans1',
        'trans2',
        'trans3'
      ],
      transitionsVMix: [
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
    },
    transitions: {
        obs: [
        'trans1',
        'trans2',
        'trans3'
        ],
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
            'http://localhost:8081/get-classes', {
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
        axios.post('http://localhost:8081/create-class', {
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
            'http://localhost:8081/update-presentation',
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
        axios.get('http://localhost:8081/get-courses')
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
        axios.post('http://localhost:8081/post-course', {
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
        axios.get('http://localhost:8081/get-mqtt')
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
        axios.post('http://localhost:8081/put-mqtt', {
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
        axios.post('http://localhost:8081/connect-obs', {
            address: state.connectionData.ip,
            port: state.connectionData.port,
            password: state.connectionData.password
        })
        .then(data => {
            console.log(data);
            state.connection.text = 'Cоединение установлено'
        }).catch(err => {
            console.error(err)
        })
    },

    async disconnectOBS(s) {
        const state = s.state;
        axios.post('http://localhost:8081/disconnect-obs')
        .then(data => {
            console.log(data);
            state.connection.text = 'Cоединение разорвано';
            setTimeout(() => {
                state.connection.text = ''
            }, 3000);
        }).catch(err => {
            console.error(err)
        })
    },

    // vMix
    async connectVMix(s) {
        const state = s.state;
        axios.post('http://localhost:8081/connect-vmix', {
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
