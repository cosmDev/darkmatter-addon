<template>
<div>
  <v-card >
    <v-layout>
      <v-app-bar 
        prominent 
      >
        <v-app-bar-nav-icon :color="defaultChain.color" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
 
          <v-img
          max-height="30"
          max-width="30"
          :src="defaultChain.coinLookup?.icon"
          
        ></v-img>  
        
        <v-menu>
        
            <template v-slot:activator="{ props }">
            
              <v-toolbar-title v-bind="props">{{ wallet.name }} <span class="mdi mdi-arrow-down-thin"></span></v-toolbar-title> 
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) in wallets"
                :key="i"
                @click.prevent="changeAccount(item.name)"
              >
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> 
        <v-spacer></v-spacer>

    <v-menu
      open-on-hover
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
        >
         <v-icon :color="defaultChain.color">mdi-security-network</v-icon> 
        </v-btn>
        
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in cosmosConfig"
          :key="index"
          @click.prevent="changeChain(index)"
        >
          <v-list-item-title>
            <v-avatar size="x-small">
              <v-img
                :src="item.coinLookup.icon"
                :alt="item.name"
              ></v-img>
            </v-avatar>            
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>


        <!-- <v-btn icon @click.stop="drawerRight = !drawerRight">
          <v-icon>mdi-security-network</v-icon> 
        </v-btn> -->
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"         
        temporary
      >
        <v-list density="compact">
          <v-list-subheader>Menu</v-list-subheader>

          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item" 
            :to="item.link"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
 
      </v-navigation-drawer>
      
      <v-navigation-drawer
        v-model="drawerRight" 
        location="right"         
        temporary
      > 
        <v-list>
          <v-list-item
            v-for="(item, index) in cosmosConfig"
            :key="item.address"
            link 
            @click.prevent="changeChain(index)"
          >
         
<!--             <v-list-item-icon>
              <v-icon>{{ icon }}</v-icon>
            </v-list-item-icon>
   -->
            <v-list-item-content>
              <v-list-item-title><span class="mdi mdi-account"></span> {{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>      
      
      
      
      <v-main  style="background-color: #000000"  height="648" class="mx-auto">
        <v-container>
         <!--  {{ wallet }} -->
          <br />
           
        <router-view />
          <!--<v-row dense>
            <v-col
              v-for="n in 4"
              :key="n"
              cols="12"
            >
              <v-card
                :title="`Content ${n}`"
                :subtitle="`Subtitle for Content ${n}`"
                text="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"
              ></v-card>
            </v-col>
          </v-row>-->
        </v-container>
        <v-bottom-navigation :elevation="16">
          <v-btn value="recent">
            <v-icon :color="defaultChain.color">mdi-format-list-bulleted</v-icon>

            <strong :style="'color:' + defaultChain.color">Txs</strong>
          </v-btn>

          <v-btn value="favorites">
            <v-icon :color="defaultChain.color">mdi-finance</v-icon>

            <strong :style="'color:' + defaultChain.color">Stats</strong>
          </v-btn>

          <v-btn value="nearby">
            <v-icon :color="defaultChain.color">mdi-cog</v-icon>

            <strong :style="'color:' + defaultChain.color">Config</strong>
          </v-btn>
        </v-bottom-navigation>             
      </v-main>
    </v-layout>
  </v-card>
 
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios' 
import { mapState } from 'vuex'
import {
	StargateClient,
} from '@cosmjs/stargate'


  export default {
   name: 'App',
    data: () => ({
      drawer: false,
      group: null,
      drawerRight: false,
      items: [
        {
          title: 'Home',
          icon: 'mdi-home',
          link: '/'
        },
        {
          title: 'Chain Statss',
          icon: 'mdi-home',
          link: '/chainstats'
        },   
        {
          title: 'Import wallet',
          icon: 'mdi-home',
          link: '/importwallet'
        },            
      ],
    }),

    watch: {
      group () {
        this.drawer = false
      },
      /* async wallet(newQuestion) {
        console.log(newQuestion)
 
  
        await this.$store.dispatch('getWalletData', this.currentAddress)
        await this.$store.dispatch('getBankModule', this.currentAddress)
      }, */
      defaultChain(newQuestion) {
        console.log(newQuestion)
        // this.$store.dispatch('initRpc')
      }    
    },
    computed: {
      ...mapState(['wallet', 'wallets', 'cosmosConfig', 'defaultChain', 'currentAddress', 'isLogged'])
    },    
    
    async beforeMount () {
      if(this.isLogged === true) {
        //this.$router.push('/importwallet')
      } else {
 

        await this.$store.dispatch('defaultWallet')     
        await this.$store.dispatch('initChainsConfig')
        await this.$store.dispatch('changeChain', 0)

          
        await this.$store.dispatch('initRpc') 
        //console.log('this.currentAddress', this.currentAddress)
        //await this.$store.dispatch('getBankModule', this.currentAddress)
        console.log('this.currentAddress', this.currentAddress)

        await this.$store.dispatch('getWalletData', this.currentAddress)
        await this.$store.dispatch('getBankModule', this.currentAddress)   
        await this.$store.dispatch('getStakingModule')   
        
        
        
        let finalAccounts = []
        chrome.storage.local.get(["accounts"], async function(items){
          
          
          for (let i = 0; i < items.accounts.length; i++) {
            finalAccounts.push({ 'name': items.accounts[i].name, 'address': items.accounts[i].address})
  
          }
          //console.log(finalAccounts)
          
        }); 
  
        this.accounts = finalAccounts
      }  
    },    
    methods: {
      async changeAccount(name) {
        await this.$store.dispatch('changeWallet', name)
        this.drawerRight = false
 
        await this.$store.dispatch('getBankModule', this.currentAddress)
        await this.$store.dispatch('getWalletData', this.currentAddress)   
        await this.$store.dispatch('getStakingModule')                   
      },
      async changeChain(id) {
        
        this.drawerRight = false
        await this.$store.dispatch('changeChain', id)
        await this.$store.dispatch('initRpc') 
        //await this.$store.dispatch('defaultWallet')

        await this.$store.dispatch('getBankModule', this.currentAddress)
        await this.$store.dispatch('getWalletData', this.currentAddress)
        await this.$store.dispatch('getStakingModule')   
      }
    }      
  }
</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html {
    background-color: black !important;
    background-repeat: repeat-y;
  width: 400px;
  height: 500px;
}
.v-application {

}
</style>
