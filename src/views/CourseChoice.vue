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
                    v-model="selectedCourseName"
                    :items="coursesText"
                    label="Выберите курс"
                    single-line
                ></v-select>
                <v-btn
                    v-if="!courseIsSelected"
                    :disabled="!selectedCourseName"
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
                        v-if="classes.length"
                        v-model="selectedClassName"
                        :items="classesText"
                        label="Выберите занятие"
                        single-line
                    ></v-select>
                    <v-btn
                        v-if="classes.length"
                        :disabled="!selectedClassName"
                        outlined
                        tile
                        color="primary"
                        @click="chooseClass"
                        class="ml-8 px-6"
                    >
                        Перейти к занятию
                    </v-btn>
                    <div 
                        v-if="!classes.length"
                    >
                        Занятий не найдено. Создайте свое первое занятие!
                    </div>
                    <v-spacer v-if="!classes.length"></v-spacer>
                    <create-class
                        @loadingStart="loading = true"
                        @loadingEnd="loading = false"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapMutations, mapState } from 'vuex';
    import createClass from "../components/CreateClass.vue";

    export default {
        components: {
            createClass
        },
        data() {
            return {
                loading: true, // Показывать лоадер
                selectedCourseName: '', // Выбранный курс
                selectedCourseId: '', // ID выбранного курса
                courseIsSelected: false,
                selectedClassName: '',
            }
        },
        created() {
            // Получение данных о курсах
            this.getCourses()
            .then(() => {
                this.loading = false;
            }).catch(err => {
                console.error(err);
                this.loading = false;
            })
        },
        methods: {
            ...mapActions(['getCourses', 'getClasses']),
            ...mapMutations(['setActiveCourse', 'setActiveClass']),
            getCourseClasses() {
                this.loading = true;
                // Запрос к серверу на наличие занятий в курсе. Если занятия есть, показывать их в селекте и давать кнопку выбора
                // Если занятий нет, то выводить соответствующее сообщение (с предложением создать шаблон нового занятия)
                this.getClasses(this.selectedCourseId)
                .then(() => {
                    this.loading = false;
                    this.courseIsSelected = true;
                    this.setActiveCourse(this.courses.find(course => course.id === this.selectedCourseId));
                })
                .catch(err => {
                    console.error(err);
                    this.loading = false;
                })
            },
            deselectCourse() {
                this.courseIsSelected = false;
                this.selectedClassName = '';
                this.setActiveCourse(undefined)
            },
            chooseClass() {
                let number = this.selectedClassName.split(":")[0];
                this.setActiveClass(this.classes.find(cl => cl.number === Number(number)));
                this.$router.push(`class-data/${this.activeClass.id}`)
            }
        },
        computed: {
            ...mapState({
                coursesText: state => state.courses.map(course => `${course.name}, ${course.teacher}`),
                courses: state => state.courses,
                classesText: state => state.classes.length ? state.classes.map(cl => `${cl.number}: ${cl.name}`) : [],
                classes: state => state.classes,
                activeCourse: state => state.activeCourse,
                activeClass: state => state.activeClass,
            })
        },
        watch: {
            selectedCourseName(text) {
                let index = this.coursesText.indexOf(text);
                this.selectedCourseId = index === -1 ? '' : this.courses[index].id;
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>