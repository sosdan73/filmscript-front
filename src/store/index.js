import Vue from 'vue'
import Vuex from 'vuex'

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
    courses: [
      {
        name: 'Видеосетевые технологии',
        teacher: 'Королев Д. А.',
        presentations: []
      },
      {
        name: 'Мультимедиа-технологии',
        teacher: 'Королев Д. А.',
        presentations: [
          {
            number: 1,
            name: 'Gstreamer',
            presentationTables: []
          }
        ]
      },
    ],
    backend: {
      sourcesOBS: [
        '57 front',
        'Евсютин',
        'King 77'
      ],
      sourcesVMix: [
        'NDI TEACHER (Intel(R) UHD Graphics 1)',
        'VLC rtsp://172.18.191.57:554/stream/main',
        'Colour',
      ],
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
    }
  },
  mutations: {
    setMixingDesk(state, payload) {
      if (payload == 'obs') {
        state.mixingDesk.isOBS = !state.mixingDesk.isOBS;
        state.mixingDesk.isVMix = false
      } else {
        state.mixingDesk.isOBS = false;
        state.mixingDesk.isVMix = !state.mixingDesk.isVMix
      }
    },
    addRow(state) {
      const row = {
        checked: false,
        source: '',
        overlay1: '',
        overlay2: '',
        overlay3: '',
        overlay4: '',
        promptText: ''
      };
      row.id = state.presentationTables.length == 0 ? 0 : Math.max(...state.presentationTables.map(row => row.id)) + 1;
      row.slideNumber = state.presentationTables.length == 0 ? 1 : Math.max(...state.presentationTables.map(row => row.slideNumber)) + 1;
      if (state.mixingDesk.isOBS) {
        row.transition = state.backend.transitionsOBS[0]
      } else if (state.mixingDesk.isVMix) {
        row.transition = state.backend.transitionsVMix[0]
      }
      state.presentationTables.push(row)
    },
    deleteRow(state, payload) {
      const index = state.presentationTables.map(table => table.id).indexOf(payload.id);
      state.presentationTables.splice(index, 1)
    },
    establishConnection(state) {
      state.connection = true
    },
    abortConnection(state) {
      state.connection = false
    }
  },
  actions: {
    async getPresentationsData(s) {
      const state = s.state;
      state.connection.loading = true;
      setTimeout(() => {
        state.connection = {
          status: true,
          loading: false,
          text: 'Подключение установлено',
          alertColor: 'success',
        }
        state.connectionData.password = ''
      }, 1000);
    },
  },
})
