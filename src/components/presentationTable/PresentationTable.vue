<template>
    <div class="mt-7">
        <v-data-table
            :headers="headers"
            :items="loading ? [] : data"
            hide-default-footer
            :items-per-page="100"
            :loading="loading"
            loading-text="Подключение к серверу"
            no-data-text="Нет данных о презентации"
            class="elevation-1"
        >
            <template v-slot:item.checked="{ item }">
                <v-checkbox
                    v-model="item.checked"
                    @click="selectRow(item)"
                ></v-checkbox>
            </template>
            <template v-slot:item.slideNumber="{ item }">
                <v-text-field
                    v-model="item.slideNumber"
                ></v-text-field>
            </template>
            <template v-slot:item.source="{ item }">
                <v-text-field
                    v-model="item[isVMix ? 'source' : 'scene']"
                ></v-text-field>
            </template>
            <template v-slot:item.transition="{ item }">
                <v-select
                    :items="transitions[isVMix ? 'vmix' : 'obs']"
                    v-model="item.transition"
                ></v-select>
            </template>
            <template
                v-if="isVMix"
                v-slot:item.overlay1="{ item }"
            >
                <v-text-field
                    v-model="item.overlay1"
                ></v-text-field>
            </template>
            <template
                v-if="isVMix"
                v-slot:item.overlay2="{ item }"
            >
                <v-text-field
                    v-model="item.overlay2"
                ></v-text-field>
            </template>
            <template
                v-if="isVMix"
                v-slot:item.overlay3="{ item }"
            >
                <v-text-field
                    v-model="item.overlay3"
                ></v-text-field>
            </template>
            <template
                v-if="isVMix"
                v-slot:item.overlay4="{ item }"
            >
                <v-text-field
                    v-model="item.overlay4"
                ></v-text-field>
            </template>
            <template v-slot:item.promptText="{ item }">
                <v-textarea
                    rows="1"
                    v-model="item.promptText"
                ></v-textarea>
            </template>
            <template v-slot:item.delete="{ item }">
                <v-btn
                    icon
                    dark
                    small
                    color="red"
                    @click="deleteRow(item)"
                >
                <v-icon dark>
                    mdi-delete
                </v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <div class="d-flex my-4">
            <v-btn
                class="mr-2"
                outlined
                color="success"
                :elevation="0"
                :loading="loading"
                @click="addRow"
            >
                <v-icon
                    left
                    dark
                >
                    mdi-plus
                </v-icon>
                Строка
            </v-btn>
            <v-btn
                v-if="selectedItems.length > 0"
                outlined
                color="error"
                :elevation="0"
                :loading="loading"
                @click="deleteSelectedRows"
            >
                <v-icon
                    left
                    dark
                >
                    mdi-delete
                </v-icon>
                Удалить
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                class="mr-2"
                color="amber"
                :elevation="0"
                :loading="loading"
                @click="importTable"
            >
                <v-icon
                    left
                    dark
                >
                    mdi-arrow-up-bold
                </v-icon>
                Импорт
            </v-btn>
            <input
                ref="uploader"
                class="d-none"
                type="file"
                @change="onFileChanged"
            >
            <v-btn
                class="mr-2"
                color="amber"
                :elevation="0"
                :loading="loading"
                @click="exportTable"
            >
                <v-icon
                    left
                    dark
                >
                    mdi-arrow-down-bold
                </v-icon>
                Экспорт
            </v-btn>
            <v-btn
                color="success"
                :elevation="0"
                :loading="loading"
                @click="saveTable"
            >
                Сохранить
            </v-btn>
        </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import Row from './Row.vue';

  export default {
    components: {
      row: Row,
    },
    data() {
      return {
        loading: false,
        selectedItems: []
      }
    },
    methods: {
        ...mapMutations(['addRow', 'deleteRow', 'setPresentation']),
        ...mapActions(['updateClass']),
        selectRow(item) {
            if (item.checked) {
                this.selectedItems.push(item)
            } else {
                let index = this.selectedItems.map(i => i.id).indexOf(item.id);
                this.selectedItems.splice(index, 1)
            }
        },
        deleteSelectedRows() {
            this.selectedItems.forEach(item => {
                this.deleteRow(item)
            });
            this.selectedItems = []
        },
        importTable() {
            this.$refs.uploader.click();
        },
        exportTable() {
            let blob = new Blob([JSON.stringify(this.activeClass.presentation)], {type: 'json'});
            let link = document.createElement('a');
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", "table-data.json")
            link.click();
        },
        saveTable() {
            this.loading = true;
            this.updateClass()
            .finally(() => {
                this.loading = false;
            })
        },
        onFileChanged(e) {
            let selectedFile = e.target.files[0];
            selectedFile.text().then(data => {
                this.activeClass.presentation = [];
                let rows = JSON.parse(data);
                if (rows && rows.length) {
                    console.log('works');
                    rows.forEach(item => {
                        this.activeClass.presentation.push(item)
                    })
                }
            })
        }
    },
    computed: {
      ...mapState({
        isOBS: state => state.mixingDesk.isOBS,
        isVMix: state => state.mixingDesk.isVMix,
        presentationTables: state => state.presentationTables,
        backend: state => state.backend,
        transitions: state => state.transitions,
        activeClass: state => state.activeClass,
      }),
      headers() {
        const headers = [
          {
            text: '',
            align: 'center',
            sortable: false,
            value: 'checked',
            width: '40px'
          },
          {
            text: 'Слайд',
            align: 'center',
            sortable: false,
            value: 'slideNumber',
            width: '60px'
          },
          {
            text: 'Источник',
            align: 'center',
            sortable: false,
            value: 'source',
            width: '120px'
          },
          {
            text: 'Переход',
            align: 'center',
            sortable: false,
            value: 'transition',
            width: '140px'
          },
          {
            text: 'Оверлей 1',
            align: 'center',
            sortable: false,
            value: 'overlay1',
            width: '120px'
          },
          {
            text: 'Оверлей 2',
            align: 'center',
            sortable: false,
            value: 'overlay2',
            width: '120px'
          },
          {
            text: 'Оверлей 3',
            align: 'center',
            sortable: false,
            value: 'overlay3',
            width: '120px'
          },
          {
            text: 'Оверлей 4',
            align: 'center',
            sortable: false,
            value: 'overlay4',
            width: '120px'
          },
          {
            text: 'Текст для суфлера',
            align: 'center',
            sortable: false,
            value: 'promptText',
            width: '200px'
          },
          {
            text: '',
            align: 'center',
            sortable: false,
            value: 'delete',
            width: '40px'
          },
        ]
        if (this.isOBS) {
          headers.splice(4, 4);
          headers[2].text = 'Сцена';
        }
        return headers
      },
      data() {
        // return this.presentationTables
        return this.activeClass.presentation
      },
      pageWidth() {
        return document.getElementsByClassName('container')[0].offsetWidth
      }
    },
  }
</script>

<style lang="scss" scoped>
  .grid-row {
    display: grid;
    justify-items: center;
    gap: 5px;
  }
  .vmix {
    grid-template-columns: minmax(40px, 1fr) minmax(60px, 2fr) repeat(6, minmax(120px, 3fr)) minmax(200px, 4fr) minmax(40px, 1fr);
    min-width: calc(1105px);
  }
  .obs {
    grid-template-columns: minmax(40px, 1fr) minmax(60px, 2fr) repeat(2, minmax(120px, 3fr)) minmax(200px, 4fr) minmax(40px, 1fr);
    min-width: calc(605px);
  }
  .bgc {
    background-color: #444;
  }
  .item {
    border: 1px solid black;
  }
  .item-2 {
    border: 1px solid black;
    width: 200px;
  }
  .table {
    overflow-x: auto;
  }
</style>