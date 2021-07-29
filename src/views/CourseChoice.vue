<template>
    <div class="container pt-8">
        <v-progress-circular
            v-if="loading"
            class="d-block mx-auto"
            indeterminate
            color="green"
            :size="100"
            :width="6"
        ></v-progress-circular>
        <div v-else>
            <h2>Выбор курса:</h2>
            <div class="d-flex align-center">
                <v-select
                    :disabled="courseIsSelected"
                    v-model="selectedCourse"
                    :items="courses"
                    label="Выберите курс"
                    single-line
                ></v-select>
                <v-btn
                    v-if="!courseIsSelected"
                    :disabled="!selectedCourse"
                    outlined
                    tile
                    color="primary"
                    @click="getCourseClasses"
                    class="ml-8 px-8"
                >
                    Далее
                </v-btn>
                <v-btn
                    v-else
                    outlined
                    tile
                    color="error"
                    @click="deselectCourse"
                    class="ml-8 px-8"
                >
                    Изменить курс
                </v-btn>
            </div>
            <div
                v-if="courseIsSelected"
            >
                <h2>Выбор занятия:</h2>
                <div class="d-flex align-center gap-8">
                    <v-select
                        v-model="selectedLesson"
                        :items="[1, 2, 3]"
                        label="Выберите номер занятия"
                        single-line
                    ></v-select>
                    <v-btn
                        :disabled="!selectedLesson"
                        outlined
                        tile
                        color="primary"
                        @click="redirectMain(0)"
                        class="ml-8 px-6"
                    >
                        Перейти к занятию
                    </v-btn>
                    <v-btn
                        outlined
                        tile
                        color="success"
                        @click="redirectMain(-1)"
                        class="ml-8 px-6"
                    >
                        Создать новое занятие
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        data() {
            return {
                loading: true, // Показывать лоадер
                selectedCourse: '', // Выбранный курс
                courseIsSelected: false,
                selectedLesson: '',
            }
        },
        created() {
            // Получение данных о курсах
            setTimeout(() => {
                this.loading = false
            }, 1000);
        },
        methods: {
            getCourseClasses() {
                this.loading = true;
                // Запрос к серверу на наличие занятий в курсе. Если занятия есть, показывать их в селекте и давать кнопку выбора
                // Если занятий нет, то выводить соответствующее сообщение (с предложением создать шаблон нового занятия)
                setTimeout(() => {
                    this.loading = false;
                    this.courseIsSelected = true;
                    //
                }, 1000);
            },
            deselectCourse() {
                this.courseIsSelected = false;
                this.selectedLesson = ''
            },
            redirectMain(id) {
                this.$router.push(`class-data/${id}`)
            }
        },
        computed: {
            ...mapState({
                courses: state => state.courses.map(course => `${course.name}, ${course.teacher}`)
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>