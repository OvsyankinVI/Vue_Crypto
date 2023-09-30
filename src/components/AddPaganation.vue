<template>
  <div
    class="pagin"
    style="display: flex; justify-content: center; align-items: center"
  >
    <div style="width: 110px">
      <button
        @click="MinusPage"
        v-show="this.page > 1"
        class="mr-5 my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Назад
      </button>
    </div>

    <p class="text-center" v-if="tickers.length > tickersOnPage">
      Стр. {{ page }}
    </p>
    <div style="width: 110px">
      <button
        @click="PlusPage"
        v-show="hasNextPage"
        class="ml-5 my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Вперед
      </button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'AddPaganation',
    emits: ['add-plus', 'add-minus'],
    props: {
        page: {},
        tickers: {},
        tickersOnPage: {},
        hasNextPage: {}
    },
    datd() {
      return {
        plus: 1,
        minus: 1
      }
    },
    methods: {
        PlusPage() {
            this.$emit('add-plus', this.plus)
        },
        MinusPage() {
            this.$emit('add-minus', this.minus)
        }
    }
}
</script>