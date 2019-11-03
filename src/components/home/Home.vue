<template>
  <div class="container">
    <header>SUDOKU</header>
    <article>
      <Cell v-for="(value,key) of sudoku" :number="key" :info="randomSudoku[key]"
            :classBorder="classesBorder[key + 1]" :cellBackground="cellBackground[key]"
            :success="successResult[key]" :errorSize="randomSudoku[key].error.size"
            v-on:handleClick="handleClick($event)" v-on:handleInput="handleInput($event)" />
    </article>
    <footer>2019</footer>
  </div>

</template>

<script>
  import Cell from './components/Cell';

  export default {
    components: {
      Cell,
    },
    data() {
      return {
        sudoku: [
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          [4, 5, 6, 7, 8, 9, 1, 2, 3],
          [7, 8, 9, 1, 2, 3, 4, 5, 6],
          [2, 3, 1, 5, 6, 4, 8, 9, 7],
          [5, 6, 4, 8, 9, 7, 2, 3, 1],
          [8, 9, 7, 2, 3, 1, 5, 6, 4],
          [3, 1, 2, 6, 4, 5, 9, 7, 8],
          [6, 4, 5, 9, 7, 8, 3, 1, 2],
          [9, 7, 8, 3, 1, 2, 6, 4, 5]
        ],
        randomSudoku: [],
        cellBackground: [],
        classesBorder: [],
        classesInput: [],
        successResult: [],
      }
    },
    methods: {
      classBorder: function (i) {
        const classes = {
          'border-top': i <= 9 || (i >= 28 && i <= 36) || (i >= 55 && i <= 63),
          'border-right': i % 3 == 0,
          'border-bottom': i >= 73 && i <= 81,
          'border-left': (i - 1) % 9 == 0
        };
        this.classesBorder[i] = classes;
      },
      handleInput: function ({value, index}) {
        const row = Math.ceil((index + 1) / 9) - 1;
        const column = (index + 1) % 9 === 0 ? 8 : ((index + 1) % 9) - 1;
        const firstCell = 27 * Math.floor(row / 3) + 3 * Math.floor(column / 3);
        let success = true;
        this.successResult = [];
        this.randomSudoku[index].value = value;
        this.randomSudoku[index].error.clear();
        this.randomSudoku[index].success = false;
        this.successResult[index] = false;

        for (let i = 0; i < 9; i++) {
          const indexSqr = firstCell + Math.floor(i / 3) * 9 + i % 3;

          if (
            !this.randomSudoku[9 * row + i].initial
            && this.randomSudoku[9 * row + i].error.size == 1
            && this.randomSudoku[9 * row + i].error.has(index)
          ) {
            this.randomSudoku[9 * row + i].success = true;
            this.successResult[9 * row + i] = true;
          }
          this.randomSudoku[9 * row + i].error.delete(index);
          if (index != (9 * row + i) && value != '' && value == this.randomSudoku[9 * row + i].value) {
            this.randomSudoku[9 * row + i].error.add(index);
            this.randomSudoku[9 * row + i].success = false;
            this.successResult[9 * row + i] = false;
            this.randomSudoku[index].error.add(9 * row + i);
            success = false;
          }

          if (
            !this.randomSudoku[9 * i + column].initial
            && this.randomSudoku[9 * i + column].error.size == 1
            && this.randomSudoku[9 * i + column].error.has(index)
          ) {
            this.randomSudoku[9 * i + column].success = true;
            this.successResult[9 * i + column] = true;
          }
          this.randomSudoku[9 * i + column].error.delete(index);
          if (index != (9 * i + column) && value != '' && value == this.randomSudoku[9 * i + column].value) {
            this.randomSudoku[9 * i + column].error.add(index);
            this.randomSudoku[9 * i + column].success = false;
            this.successResult[9 * i + column] = false;
            this.randomSudoku[index].error.add(9 * i + column);
            success = false;
          }

          if (
            !this.randomSudoku[indexSqr].initial
            && this.randomSudoku[indexSqr].error.size == 1
            && this.randomSudoku[indexSqr].error.has(index)
          ) {
            this.randomSudoku[indexSqr].success = true;
            this.successResult[indexSqr] = true;
          }
          this.randomSudoku[indexSqr].error.delete(index);
          if (index != indexSqr && value != '' && value == this.randomSudoku[indexSqr].value) {
            this.randomSudoku[indexSqr].error.add(index);
            this.randomSudoku[indexSqr].success = false;
            this.successResult[indexSqr] = false;
            this.randomSudoku[index].error.add(indexSqr);
            success = false;
          }
        }

        if (success && value != '') {
          this.randomSudoku[index].success = true;
          this.successResult[index] = true;
        }

        if (this.randomSudoku.filter(item => item.success).length == 61) {
          alert('GAME OVER');
          location.reload();
        }
      },
      handleClick: function (index) {
        const row = Math.ceil(index / 9) - 1;
        const column = index % 9 === 0 ? 8 : (index % 9) - 1;
        const firstCell = 27 * Math.floor(row / 3) + 3 * Math.floor(column / 3);
        this.cellBackground = [];
        for (let i = 0; i < 9; i++) {
          this.cellBackground[9 * row + i] = true;
          this.cellBackground[9 * i + column] = true;
          const indexSqr = firstCell + Math.floor(i / 3) * 9 + i % 3;
          this.cellBackground[indexSqr] = true;
        }
      },
      randomIntFromInterval: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      moveRow: function (firstRow, secondRow) {
        const buffer = this.sudoku[firstRow];
        this.sudoku[firstRow] = this.sudoku[secondRow];
        this.sudoku[secondRow] = buffer;
      },
      moveColumn: function (firstColumn, secondColumn) {
        for (let i = 0; i < 9; i++) {
          const buffer = this.sudoku[i][firstColumn];
          this.sudoku[i][firstColumn] = this.sudoku[i][secondColumn];
          this.sudoku[i][secondColumn] = buffer;
        }
      },
      initialize: function () {
        const arr = [...this.sudoku.keys()];
        const randomSudoku = [];

        for (let i = 0; i < 20; i++) {
          const randomInt = this.randomIntFromInterval(0, 80 - i);
          randomSudoku.push(...arr.splice(randomInt, 1));
        }

        this.randomSudoku = this.sudoku.map((value, key) => {
          this.classBorder(key + 1);
          this.classesInput[key] = {};
          return randomSudoku.includes(key) ? {value, initial: true, error: new Set()} : {
            value: '',
            error: new Set()
          };
        });
      }
    },
    created: function () {
      for (let i = 0; i < 3; i++) {
        const randomInt = this.randomIntFromInterval(3 * i, 3 * i + 2);
        let first, second;
        switch (randomInt) {
          case 3 * i :
            first = 3 * i + 1;
            second = 3 * i + 2;
            break;
          case 3 * i + 1 :
            first = 3 * i;
            second = 3 * i + 2;
            break;
          case 3 * i + 2 :
            first = 3 * i;
            second = 3 * i + 1;
            break;
        }
        this.moveRow(first, second);
        this.moveColumn(first, second);
      }

      this.sudoku = this.sudoku.reduce(function (result, arr) {
        return [...result, ...arr];
      }, []);
      this.initialize();
    }
  }
</script>

<style scoped>
  .container {
    display: grid;
    grid-template-areas: "header header header" ". article ." "footer footer footer";
    grid-gap: 2vw;
  }

  header {
    grid-area: header;
    text-align: center;
  }

  article {
    grid-area: article;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(9, minmax(auto, 50px));
    grid-template-rows: repeat(9, minmax(auto, 50px));
    grid-auto-rows: 1fr;
  }

  article::before {
    content: '';
    width: 0;
    padding-bottom: 100%;
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }

  article > *:first-child {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }

  footer {
    grid-area: footer;
    text-align: center;
  }
</style>
