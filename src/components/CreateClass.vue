<template>
    <div class="text-center">
        <v-dialog
            v-model="dialog"
            width="500"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    outlined
                    tile
                    color="success"
                    @click="dialog = true"
                    class="ml-8 px-6"
                >
                    Создать новое занятие
                </v-btn>
            </template>

            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Новое занятие
                </v-card-title>

                <v-card-text>
                    <v-form
                        ref="form"
                    >
                        <v-text-field
                            v-model="number"
                            label="Номер занятия"
                        ></v-text-field>

                        <v-text-field
                            v-model="name"
                            label="Тема занятия"
                            required
                        ></v-text-field>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        text
                        @click="dialog = false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="success"
                        text
                        :disabled="!number || !name"
                        @click="createClass"
                    >
                        Создать
                    </v-btn>
                </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import { mapActions, mapMutations, mapState } from 'vuex';

    export default {
        data() {
            return {
                dialog: false,
                number: '',
                name: ''
            }
        },
        methods: {
            ...mapActions(['postClass']),
            ...mapMutations(['setActiveClass']),
            createClass() {
                this.$emit('loadingStart');
                this.postClass({
                    name: this.name,
                    number: Number(this.number)
                })
                .then(() => {
                    // this.$router.push(`class-data/${this.activeClass.id}`)
                })
                .finally(() => {
                    this.$emit('loadingEnd');
                })
            }
        },
        computed: {
            ...mapState({
                activeClass: state => state.activeClass
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>