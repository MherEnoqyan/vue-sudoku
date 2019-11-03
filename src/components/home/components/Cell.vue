<template>
  <div class="cell" :class="classBorder" v-on:click="handleClick(number + 1)" >
    <input type="text" :class="classInput"  maxlength="1" v-model.lazy.number="value"
           :disabled="info.initial" :readonly="info.initial" v-on:input="handleInput($event, number)"/>
  </div>
</template>

<script>

  export default {
    props: ['number', 'info', 'classBorder', 'cellBackground', 'success', 'errorSize'],
    methods: {
      handleClick: function (index) {
        this.$emit('handleClick', index);
      },
      handleInput: function (event, index) {
        event.target.value = event.target.value.replace(/[^1-9]/g, '');
        const value = event.target.value;
        this.$emit('handleInput', {value, index});
      },
    },
    computed: {
      classInput: function () {
        this.success;
        return {
          'cell-background': this.cellBackground,
          'initial': this.info.initial,
          'success': this.info.success,
          'error': this.errorSize > 0
        };
      },
      value: {
        get() {
          return this.info.value;
        },
        set(value) {}
      },
    }
  }
</script>

<style scoped>

  .cell {
    border: 1px solid #ccc;
  }

  input:hover {
    background: #def;
    cursor: pointer;
  }

  input {
    border: 0;
    background: #fff;
    width: 100%;
    height: 100%;
    font-size: 20px;
    text-align: center;
  }

  .cell-background {
    background: #e2e7ed;
  }

  .success {
    color: blue;
  }

  .error {
    background: #f7cfd6;
    color: red;
  }

  .initial {
    color: black;
  }

  .border-top {
    border-top: 2px solid #000;
  }

  .border-right {
    border-right: 2px solid #000;
  }

  .border-bottom {
    border-bottom: 2px solid #000;
  }

  .border-left {
    border-left: 2px solid #000;
  }
</style>
