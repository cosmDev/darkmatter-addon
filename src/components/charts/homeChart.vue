<template>
  <div> 
  <DoughnutChart 
    :chartData="chartData" 
    :options="chartOptions"
    width="200"
    height="200"
  />
  </div>
</template>

<script>
import { mapState } from 'vuex'   
import { defineComponent } from 'vue';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
  props: ['balance', 'totalDelegations', 'totalUnbound', 'totalRewards'],
  name: 'HomeChart',
  components: { DoughnutChart },
  data: () => ({
    finalChartColors: '',
    testData: '',
    options: ''
  }),  
  computed: {
    ...mapState([ 'defaultChain']),
    chartData() {
      return {
        labels: ["Available", "Delegated", "Undelegated", "Reward"],
        datasets: [
          {
            label: "test",
            data: [
              this.balance,
              this.totalDelegations,
              this.totalUnbound,
              this.totalRewards,
            ],
            backgroundColor: this.finalChartColors
          },
        ],
      };
    },   
    chartOptions() { 
      return {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Wallet portfolio',
          },
        },
      };
    },      
  },  
  watch: {
    defaultChain() { 
      this.finalChartColors = this.defaultChain.colorChart    
    }
  },  
  async mounted () { 
    this.finalChartColors = this.defaultChain.colorChart
  },
 
});
</script>
