<template>
  <v-app id="inspire" :dark="this.$vuetify.theme.dark = this.goDark"> 
  
  
  
        <v-card class="pa-2 ma-2 mr-1">
           <p class="text-left">Type</p>
          <p class="text-right">{{ txData.txData?.type }}</p>
        </v-card>  
  
  
     <v-row no-gutters>
      <v-col cols="12" class="">
        <v-card class="pa-2 ma-2 ">
           <p class="text-left">Amount</p>
          <p class="text-right">{{ txData.txData?.amount / 1000000 }} BCNA</p>
        </v-card>    
        <v-card class="pa-2 ma-2 ">
           <p class="text-left">From</p>
           <p class="text-right text-truncate" style="max-width: 350px;">{{ txData.txData?.from }}</p>
        </v-card>
        <v-card class="pa-2 ma-2 ">
           <p class="text-left">to</p> 
          <p class="text-right text-truncate" style="max-width: 350px;">{{ txData.txData?.to }}</p>
        </v-card>
        <v-card class="pa-2 ma-2 ">
           <p class="text-left">memo</p>
          <p class="text-right">{{ txData.txData?.memo }}</p>
        </v-card>           
      </v-col>
    </v-row>    

  
  
  
  
<!--  <v-card class=" pa-6" width="700" min-height="220"> 
  <v-card-title>
  BitCanna transaction
  </v-card-title>
    <v-card-text >
 
         
      <v-simple-table>
        <template v-slot:default>
       
           <tbody>
            <tr>
              <td>Type </td>
              <td>{{ txData.txData?.type  }}</td>
            </tr>            
            <tr>
              <td>Amount</td>
              <td>{{ txData.txData?.amount / 1000000 }} BCNA</td>
            </tr>            
            <tr>
              <td>From </td>
              <td >{{ txData.txData?.from }}</td>
            </tr>
            <tr>
              <td>To </td>
              <td >{{ txData.txData?.to }}</td>
            </tr>       
            <tr>
              <td>Memo</td>
              <td>{{ txData.txData?.memo }}</td>
            </tr>              
          </tbody> 
        </template>
      </v-simple-table>      
    </v-card-text>
  </v-card> -->    
      </v-app>
</template>
 
<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
    data: () => ({
 
        drawer: false,
        drawerRight: false,
        group: null,
        goDark: true,
        walletAmount: 0,
        tokenValue: 0,
        walletValue: 0,
        accounts: '', 
        txData: ''
        
    }),
    
    watch: {
      group () {
        this.drawer = false
      },
    }, 
    computed: {
      ...mapState(['wallet'])
    },    
    async mounted () {
      await this.$store.dispatch('defaultWallet')
 
      let finalAccounts = []
      chrome.storage.local.get(["accounts"], async function(items){
        
        
        for (let i = 0; i < items.accounts.length; i++) {
          finalAccounts.push({ 'name': items.accounts[i].name, 'address': items.accounts[i].address})
 
        }
        //console.log(finalAccounts)
        
      }); 
 
      this.accounts = finalAccounts
      
      
      
    chrome.storage.sync.get('txData', storageData => {
        this.txData = storageData
    });         
      
    },    
    methods: {
      async changeAccount(name) {
        console.log('change account')
        console.log(this.wallet) 
        await this.$store.dispatch('changeWallet', name)
        // await this.$store.dispatch('updateDataWallet', this.wallet.address)       
      },
    }     
}
</script>

<style>
html {
  width: 400px;
  height: 500px;
}
</style>
