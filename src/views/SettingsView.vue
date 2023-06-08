<template>
 
  <v-card class="mt-8 pa-4" width="700" min-height="220">
    <v-card-text>
      <v-row>
        <v-col md="8">           
          <v-list-item-title>Dev mode</v-list-item-title>
          <v-list-item-subtitle>
            Enable dev mode 
          </v-list-item-subtitle>               
        </v-col>
        <v-col md="4">    
          <v-switch></v-switch>        
        </v-col>
      </v-row>  
      <v-row>
        <v-col md="8">           
          <v-list-item-title>Delete data</v-list-item-title>
          <v-list-item-subtitle>
            Delete all data
          </v-list-item-subtitle>               
        </v-col>
        <v-col md="4">           
          <v-btn
            color="error"
            @click="deleteData"
          >
            Delete
          </v-btn>
        </v-col>
      </v-row> 
    </v-card-text>
  </v-card>     

</template>
<script>

export default {
  name: 'App',
  data: () => ({
 
  }),
  methods: {  
    async deleteData() {
      console.log(chrome.storage.local)
      
      chrome.storage.local.remove(["accounts"]);                 
      chrome.storage.local.get(/* String or Array */["accounts"], function(items){
        console.log(items)
      });           
    },
  },

}   
</script>      
<style type="text/css">
  html {
    overflow-y: hidden;
  }
</style>
