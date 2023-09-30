<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <add-pre-load/>
    <div class="container">
      <section>
        <add-tickers @add-ticker="addPost" :tickers="this.tickers"/>
        Фильтр: 
        <input
         v-model="filter"
         class="border-0"
         @input="page = 1"
        >
        <br/>
      </section>

      <template v-if="tickers.length">
        <add-list @delPost="delPost" @selectPost='select' :paginatedTickers="paginatedTickers" :selectedTicker="selectedTicker"/> 
        <add-paganation @add-plus="PlusPage" @add-minus="MinusPage" :page="this.page" :tickers="this.tickers" :tickersOnPage="this.tickersOnPage" :hasNextPage="hasNextPage"/>
        
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <add-graph @max-graf-elements="maxGraph" @del-graph="delGraphNow" :hasNextPage="this.hasNextPage" :graph="this.graph" :selectedTicker="this.selectedTicker"/>
    </div>
  </div>
</template>

<script>
import { loadTicker } from './api'; 
import AddTickers from './components/AddTickers.vue'
import AddGraph from './components/AddGraph.vue'
import AddList from './components/AddList.vue'
import AddPreLoad from './components/AddPreLoad.vue'
import AddPaganation from './components/AddPaganation.vue'

export default {
  name: 'App',
  components: {
    AddTickers,
    AddGraph,
    AddList,
    AddPreLoad,
    AddPaganation
  },
  data() {
    return {
      filter: '',

      tickers: [],
      selectedTicker: null,

      graph: [],
      
      page: 1,
      maxGraphElements: 1,

      tickersOnPage: 6
    }
  },
  created() {
    const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())
    if (windowData.filter) {
      this.filter = windowData.filter
    }

    if (windowData.page) {
      this.page = windowData.page
    }

    const tickersData = localStorage.getItem('crypot-list')
    if (tickersData) {
      this.tickers = JSON.parse(tickersData)
      this.tickers.forEach(ticker => {
        this.subscripePrice(ticker.title)
      })
    }
  },
  computed: {
    startIndex() {
      return (this.page - 1) * this.tickersOnPage
    },
    endIndex() {
      return this.page * this.tickersOnPage
    },
    filteredTickers() {
        return this.tickers.filter(ticker => ticker.title.includes(this.filter))
    }, 
    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex)
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIndex
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      }
    }
  },
  methods: {
    addPost(ticker) {
      const newPost = { title: ticker, price: "-" };
          this.tickers.push(newPost);
          this.filter = "";
          localStorage.setItem("crypot-list", JSON.stringify(this.tickers));
          this.subscripePrice(newPost.title);
          console.log(this.page);
        },

    subscripePrice(tickerName) {
      setInterval(async() => {
        const exchangeData = await loadTicker(tickerName)
            if (this.tickers.find(c => c.title === tickerName) != undefined) {
              this.tickers.find(c => c.title === tickerName).price = exchangeData.USD
            }
            if (this.selectedTicker?.title === tickerName) {
              this.graph.push(exchangeData.USD)
            }
            while (this.graph.length > this.maxGraphElements) {
              this.graph.shift()
            }
          }, 5000)
    },
    delPost(post) {
      this.tickers = this.tickers.filter(c => c != post)
      this.selectedTicker = null;
    },
    maxGraph(maxGraphElem) {
      this.maxGraphElements = maxGraphElem
    },
    delGraphNow(delGraph) {
      this.selectedTicker = delGraph
      this.graph = []
    },
    select(tick) {
      if (this.selectedTicker != tick) {
        this.selectedTicker = tick
        this.graph = []
      }
    },
    PlusPage() {
      this.page += 1
    },
    MinusPage() {
      this.page -= 1
    }
  },
  watch: {
    paginatedTickers() {
      if (this.page > 1 && this.paginatedTickers.length === 0) {
        this.page -= 1
      }
    },
    tickers() {
      localStorage.setItem('crypot-list', JSON.stringify(this.tickers))
    },
    filter() {
      this.filter = this.filter.toUpperCase()
      this.page = 1
    },
    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&?page=${value.page}`
      )
    }
  },

}
</script>
