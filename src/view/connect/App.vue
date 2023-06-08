<template>
  <v-app id="inspire" > 
    <v-sheet align="center" justify="center" color="#121212" class="pa-6 mt-6 mx-auto">  
 
      <v-img
        :width="150"
        aspect-ratio="16/9"
        cover
        src="https://i.imgur.com/TWCBMXG.png"
      ></v-img>    
  </v-sheet>
    <v-container class="pt-8"> 
    {{ chainSelected }}
      <v-card class="mt-4 pa-4" v-for="item in wallets" :key="item.address" @click="sendSelected(item.address)">  
        {{ item.name }}<br />
        {{ item.address }}
      </v-card>  
    </v-container>
  </v-app>
</template>
 
<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
    data: () => ({
      goDark: true,
      chainSelected: ''
    }),    
    watch: {
    }, 
    computed: {
      ...mapState(['wallets'])
    },    
    async mounted () {
      await this.$store.dispatch('defaultWallet') 
      chrome.storage.sync.get('chainSelected', storageData => {
          this.chainSelected = storageData
      });       
    },    
    methods: {
      async sendSelected(addr) {
        await chrome.runtime.sendMessage({ account: addr })
        window.close()
      }
    }     
}
</script>

<style>
html {
  width: 400px;
  height: 500px;
      background-color: #000000 !important;
    background-repeat: repeat-y;
}
</style>
