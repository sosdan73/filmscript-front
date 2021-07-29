<template>
  <div class="d-flex align-end inputs">
    <input type="number" maxlength="3" @keypress="checkNumber" v-model="text[0]" />
    <span class="">.</span>
    <input type="number" maxlength="3" @keypress="checkNumber" v-model="text[1]" />
    <span>.</span>
    <input type="number" maxlength="3" @keypress="checkNumber" v-model="text[2]" />
    <span>.</span>
    <input type="number" maxlength="3" @keypress="checkNumber" v-model="text[3]" />
  </div>
</template>

<script>

export default {
  props: {
    label: {
      type: String,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Array,
    },
  },
  methods: {
    checkNumber(e) {
      // Регулярное выражение, работающее на пустую строку или число от 0 до 255
      const re = /^(^1?\d{1,2}$)?(^2[0-4]\d$)?(^25[0-5]$)?$/;
      const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if (!re.test(e.target.value + key)) {
        event.preventDefault();
        return false;
      }
    },
  },
  watch: {
    text() {
      for (let i = 0; i < 4; i++) {
        if (String(this.text[i]).length > 3) {
          this.text[i] = Number(String(this.text[i]).substring(0, 3))
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .inputs {
    width: 150px;
  }
  input {
    width: 25%;
    text-align: center;
    border-bottom: 1px solid #000;
  }
  span {
    line-height: 18px;
  }
</style>
