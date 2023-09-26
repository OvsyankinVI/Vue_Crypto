<template>
  <div class="flex">
    <div class="max-w-xs">
      <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
      >
      <div class="mt-1 relative rounded-md shadow-md">
        <input
          v-model="ticker"
          @keydown.enter="addPost"
          @input="clearErrors"
          type="text"
          name="wallet"
          id="wallet"
          class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          placeholder="Например DOGE"
        />
      </div>
      <div class="flex bg-white p-1 rounded-md shadow-md flex-wrap">
        <span
          v-for="example in exampels"
          :key="example"
          @click="addNewExamplePost(example)"
          class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
        >
          {{ example.title }}
        </span>
      </div>
      <div v-if="pos" class="text-sm text-red-600">
        Такая криптовалюта уже добавлена
      </div>
      <div v-if="error" class="text-sm text-red-600">
        Это поле не должно быть пустым
      </div>
    </div>
  </div>
  <add-button
    @click="addPost"
   />
</template>

<script>
import AddButton from './AddButton.vue'

export default {
  name: "AddTickers",
  emits: ['add-ticker'],
  props: ['tickers'],
  components: {
    AddButton
  },
  data() {
    return {
      ticker: "",
      exampels: [
        {title: 'BTC', price: '-'}, 
        {title: 'TON', price: '-'},
        {title: 'BCH', price: '-'}, 
        {title: 'CHD', price: '-'}
    ] ,
      error: false,
      pos: false,
    };
  },
  methods: {
    addPost() {
      if (this.ticker === "") {
        this.error = true;
      } else {
        for (let i = 0; i < this.tickers.length; i++) {
          if (
            this.tickers[i].title.toLowerCase() === this.ticker.toLowerCase()
          ) {
            this.pos = true;
          }
        } 
        if (this.pos === false) {
          this.$emit('add-ticker', this.ticker)
          this.ticker = "";
        }
      }
    },
    addNewExamplePost(post) {
      this.ticker = post.title
      this.addPost()
    },
    clearErrors() {
      this.pos = false  
      this.error = false
    }
  },
  watch: {
    ticker() {
      this.ticker = this.ticker.toUpperCase()
    },
  }
};
</script>