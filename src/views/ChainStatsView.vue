<template>
  <div class="about">
    <h1>This is an chainstats page</h1>

    <v-item-group selected-class="bg-primary">
    <v-container>
 

      <v-table theme="dark">
        <tbody>
          <tr>
            <td>Inflation</td>
            <td>{{ chainsStats.inflation }}</td>
          </tr>
          <tr>
            <td>Total Supply</td>
            <td>{{ totalSupply }}</td>
          </tr>
          <tr>
            <td>Bonded Tokens</td>
            <td>{{ chainsStats.bondedTokens }}</td>
          </tr>
          <tr>
            <td>Community Pool</td>
            <td>{{ chainsStats.communityPool }} </td>
          </tr>            
        </tbody>
      </v-table>


    </v-container>
  </v-item-group>


  </div>
</template>

<script>
import { mapState } from 'vuex' 

export default {
  name: 'HomeView', 
  data: () => ({
    walletAmount: 0,
    chartData: {
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
      } 
  }),  
  computed: {
    ...mapState(['wallet', 'totalRewards', 'balance', 'chainsStats', 'totalSupply'])
  },    
  async mounted () { 
    
    await this.$store.dispatch('getChainStats')
    await this.$store.dispatch('getMintModule')
    
    console.log('Calcul test ', (this.chainsStats.bondedTokens * 100 ) / this.chainsStats.totalSupply)
    this.series = [this.chainsStats.bondedTokens, 32, 45, 32]
  }  
}
</script>