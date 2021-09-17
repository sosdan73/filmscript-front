<template>
    <div>
        <v-container class="px-8">
            <h2 class="my-8 text-center text-h4">Панель администратора</h2>
            <h3 class="my-4 text-center text-h5">Добавление курса</h3>
            <form class="mx-auto">
                <v-text-field
                v-model="name"
                label="Название курса"
                required
                ></v-text-field>
                <v-text-field
                v-model="teacher"
                label="ФИО преподавателя"
                required
                ></v-text-field>
                <v-btn
                    tile
                    color="primary"
                    class="px-3 py-1"
                    :disabled="!name || !teacher"
                    :loading="loading"
                    @click="save"
                >
                    Сохранить
                </v-btn>
            </form>
        </v-container>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        data() {
            return {
                name: '',
                teacher: '',
                loading: false,
            }
        },
        methods: {
            ...mapActions(['createCourse']),
            save() {
                this.loading = true;
                this.createCourse({ name: this.name, teacher: this.teacher })
                .finally(() => {
                    this.loading = false
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
form {
    max-width: 400px;
}
</style>