<template>
 <div> 
  {{ currentAddress }}
  <homeChart 
    :balance="balance" 
    :totalDelegations="totalDelegations"
    :totalUnbound="totalUnbound"
    :totalRewards="totalRewards"
  />


     <v-row no-gutters class="mt-4">
      <v-col cols="6">
        <v-card class="pa-2 ma-2">
          
          <p class="text-left">Available</p>
          <p class="text-right">{{ balance }} <strong :style="'color:' + defaultChain.color">{{ defaultChain.coinLookup.viewDenom }}</strong></p>
        </v-card>
        <v-card class="pa-2 ma-2">
          
          <p class="text-left">Delegated</p> 
          <p class="text-right">{{ totalDelegations }} <strong :style="'color:' + defaultChain.color">{{ defaultChain.coinLookup.viewDenom }}</strong></p>
        </v-card>    
  
      </v-col>
      <v-col>
        <v-card class="pa-2 ma-2">
          
          <p class="text-left">Rewards</p>
          <p class="text-right">{{ totalRewards }} <strong :style="'color:' + defaultChain.color">{{ defaultChain.coinLookup.viewDenom }}</strong></p>
        </v-card>
        <v-card class="pa-2 ma-2">
          
          <p class="text-left">Unbonding</p> 
          <p class="text-right"> {{ totalUnbound }} <strong :style="'color:' + defaultChain.color">{{ defaultChain.coinLookup.viewDenom }}</strong></p>
        </v-card>  
          
      </v-col>
 


    </v-row>  
  
  
  
 
 
   <v-row >
                      <v-col class="mr-4 pa-2" md="6"> 
                        <v-btn
 
                          block
                          class="white--text ml-3 mr-6" 
                          :color="defaultChain.color" 
                        >
                          Send
                        </v-btn> 
                      </v-col>
                      <v-col 
                        md="6" 
                        class="mr-3 pa-2" 
                      >
                        <v-btn
 
                          block
                          class="green--text" 
                          :color="defaultChain.color" 
                        >
                          Receive
                        </v-btn>                      
                      </v-col>
                    </v-row>
 
 

    
      </div>



      
</template>

<script>
import { mapState } from 'vuex'      
//import axios from 'axios' 
import homeChart from '@/components/charts/homeChart.vue'
/* import {
	StargateClient,
} from '@cosmjs/stargate'
 */

export default {
  name: 'HomeView',
  components: {
    homeChart
  },
  data: () => ({
    walletAmount: 0,
    tokenValue: 0,
    walletValue: 0,
    priceByCoin: '', 
  }),  
  computed: {
    ...mapState(['wallet', 'currentAddress', 'totalRewards', 'balance', 'totalDelegations', 'totalUnbound', 'defaultChain'])
  },    
  async mounted () { 
    //const coin_info = await axios('https://api.coingecko.com/api/v3/coins/' + item.coingeckoId)
/*     const market_chart = await axios('https://api.coingecko.com/api/v3/coins/' + this.defaultChain.coingeckoId + '/market_chart?vs_currency=usd&days=7')
    console.log('market_chart', market_chart.data.prices)
          
    var priceByCoin = []
    market_chart.data.prices.forEach(function(coinValue){
      priceByCoin.push(coinValue[1])
    })  
    this.priceByCoin = priceByCoin */


/*     const getPrice = await axios('https://bcnaracle.bitcanna.io/bcnaracle.json') 
    const client = await StargateClient.connect('https://rpc.bitcanna.io')
    const response1 = await client.getBalance(this.wallet.address, 'ubcna')
 
    this.tokenValue = getPrice.data.bitcanna.usd.toFixed(4)  
    this.walletAmount = response1.amount / 1000000
    this.walletValue = Number(this.tokenValue * this.walletAmount).toFixed(6) */
  }  
}
</script>
<style>
.icon {
  display: inline-flex;
  align-self: right;
}
</style>
