<template>
  <v-stepper class="mt-8" v-model="e1">
    <v-stepper-header>
      <v-stepper-step
        :complete="e1 > 1"
        step="1"
        color="#0eb786"
      >
        Name of step 1
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="e1 > 2"
        step="2"
        color="#0eb786"
      >
        Name of step 2
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step color="#0eb786" :complete="valid" step="3">
        Name of step 3
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
      
      <v-chip
        v-for="(item, index) in generatedMnenomic"
        :key="index"      
        class="ma-2"
        color="success"
        outlined
      >
        {{ item }}
      </v-chip>      
      
      
      <v-slider
        v-model="numWords"
        :tick-labels="ticksLabels"
        :max="2"
        step="1"
        ticks="always"
        tick-size="4"
        class="ma-2"
        color="#0eb786"
        track-color="#0eb786"
      ></v-slider>
      
      
        <v-btn
          class="mt-12"
          color="#0eb786"
          @click="step1"
        >
          Start verification
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
      <!--{{ checkMnenomic }}-->
      
      <v-chip
        v-for="(item, index) in checkMnenomic"
        :key="item"      
        class="ma-2"
        outlined
        :color="checkMnenomicColor"
        @click="clickRemove(item, index)"
      >
      
      <v-icon x-small class="mr-1">mdi-minus-circle-outline</v-icon>
        {{ item }}
      </v-chip>        
      
      <v-divider v-if="!mnenomicVerified"></v-divider>      
      
      <v-chip
        v-for="(item, index) in shuffledMnenomic"
        :key="index"      
        class="ma-2"
        outlined
        @click="clickCheck(item, index)"
      >
      <v-icon x-small class="mr-1">mdi-plus-circle-outline</v-icon>
      
        {{ item }}
      </v-chip>   
       <br /><br />
 
        {{ generatedMnenomic }} 
        <br />
        <v-btn
          class="mt-12"
          color="#0eb786"
          :disabled="!mnenomicVerified"
          @click="step2"
        >
          Next step 
        </v-btn>
        <v-btn
          class="mt-12"
          color="#0eb786"
          @click="e1 = 3"
        >
          pass it
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
      <v-form v-model="valid">
      <v-row>
       
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
         
            <v-text-field
              v-model="walletName"
              label="Account name"
              :rules="[rules.required, rules.counter]"
              counter
              maxlength="10"            
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="3"
          >
            <v-text-field
              v-model="password"
              label="Password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              :rules="[rules.required]"
              @click:append="show1 = !show1"
            ></v-text-field>
          
        </v-col>
        
      </v-row>
      </v-form>

        <v-btn
          :disabled="!valid"
          color="#0eb786"
          @click="addWallet"
        >
          Create account
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
//import { Preferences } from '@capacitor/preferences';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { fromHex } from "@cosmjs/encoding";
// import { notifAccountAdded } from '../libs/notifications'

  export default {
    data () {
      return {
        e1: 1,
        valid: false,
        walletName: '',
        password: '',
        show1: false,
        numWords: '',
        generatedMnenomicPlain: '',
        generatedMnenomic: '',
        shuffledMnenomic: '',
        checkMnenomic: [],
        checkMnenomicColor: 'primary',
        mnenomicVerified: false,
        rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length <= 10 || 'Max 10 characters',
        },  
        ticksLabels: [
          '12 words',
          '18 words',
          '24 words',
        ],        
      }
    },
    async mounted () {


console.log(chrome.storage.local)
      
      var generateSecret = await DirectSecp256k1HdWallet.generate(12)      
      this.generatedMnenomicPlain = generateSecret.secret.data
      this.generatedMnenomic = this.generatedMnenomicPlain.split(' ')  
    },
    watch: {
      async numWords(newData) {
        console.log(newData)
        var generateSecret = ''
        switch (newData) {
          case 0:
            generateSecret = await DirectSecp256k1HdWallet.generate(12)  
            this.generatedMnenomicPlain = generateSecret.secret.data
            this.generatedMnenomic = this.generatedMnenomicPlain.split(' ')              
            break;       
          case 1:
            generateSecret = await DirectSecp256k1HdWallet.generate(18)  
            this.generatedMnenomicPlain = generateSecret.secret.data
            this.generatedMnenomic = this.generatedMnenomicPlain.split(' ')              
            break;
          case 2:
            generateSecret = await DirectSecp256k1HdWallet.generate(24)  
            this.generatedMnenomicPlain = generateSecret.secret.data
            this.generatedMnenomic = this.generatedMnenomicPlain.split(' ')              
            break;
        }
        
          
      },    
      checkMnenomic() {
        const compareArrays = (a, b) =>
          a.length === b.length &&
          a.every((element, index) => element === b[index]);      

        if (compareArrays(this.checkMnenomic, this.generatedMnenomic)) {
          this.checkMnenomicColor = 'green'
          this.mnenomicVerified = true
        } else {
          this.checkMnenomicColor = 'red' 
          this.mnenomicVerified = false
        }
      }
    },    
    methods: {    
      step1() {
        this.e1 = 2
        this.checkMnenomic = []
        let shuffled = this.generatedMnenomic
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
      
        this.shuffledMnenomic = shuffled
      },
      step2() {
        const compareArrays = (a, b) =>
          a.length === b.length &&
          a.every((element, index) => element === b[index]);      

        if (compareArrays(this.checkMnenomic, this.generatedMnenomic)) {
          this.checkMnenomicColor = 'green'
          this.e1 = 3
        } else
          this.checkMnenomicColor = 'red'
      },
      clickCheck(item) {
        this.checkMnenomicColor = 'primary'
        for( var i = 0; i < this.shuffledMnenomic.length; i++){                       
            if ( this.shuffledMnenomic[i] === item) { 
                this.checkMnenomic.push(item)
                this.shuffledMnenomic.splice(i, 1); 
                i--; 
            }
        }
        // console.log(this.shuffledMnenomic)
      }, 
      clickRemove(item) {
        this.checkMnenomicColor = 'primary'
        for( var i = 0; i < this.checkMnenomic.length; i++){                         
            if ( this.checkMnenomic[i] === item) { 
                this.shuffledMnenomic.push(item)
                this.checkMnenomic.splice(i, 1); 
                i++; 
            }
        }
        // console.log(this.shuffledMnenomic)
      }, 
      async addWallet() {
 

        try {
  
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic( this.generatedMnenomicPlain, {
            prefix: 'bcna'
          } )
          const [firstAccount] = await wallet.getAccounts()  
          
          // var finalWallet = await wallet.serialize( this.password )     

        const key = fromHex("aabb221100aabb332211aabb33221100aabb221100aabb332211aabb33221100");
        const customKdfConfiguration = {
          algorithm: "argon2id",
          params: {
            outputLength: 32,
            opsLimit: 321,
            memLimitKib: 11 * 1024,
          },
        };
        const finalWallet = await wallet.serializeWithEncryptionKey(key, customKdfConfiguration);
        console.log(finalWallet)       

 
          
          /* chrome.storage.local.set({ "accounts": { data: finalWallet, address: firstAccount.address, name: this.walletName } } , function(){
              //  Data's been saved boys and girls, go on home
          });  */
          let finalName = this.walletName
          chrome.storage.local.get(["accounts"], function(items){
            console.log(items.accounts)
            
              if (typeof items.accounts !== 'undefined') {
                items.accounts.push({ data: finalWallet, address: firstAccount.address, name: finalName })
                console.log(items.accounts)
                chrome.storage.local.set({ "accounts": items.accounts } , function(){
                    //  Data's been saved boys and girls, go on home
                });                 
              } else {
                chrome.storage.local.set({ "accounts": [{ data: finalWallet, address: firstAccount.address, name: finalName }] } , function(){
                    //  Data's been saved boys and girls, go on home
                });                
              }
                
          });   

          
          
          

          /* await Preferences.set({
            key: this.walletName,
            value: JSON.stringify({ data: finalWallet, address: firstAccount.address, name: this.walletName })
          });        
          const list = await Preferences.keys(); */
         //notifAccountAdded(this.$toast, 'Account added')  
          // await this.$store.dispatch('wallets/getAllWallets')
        } catch (error) {
          console.log(error)
          this.viewError = true
          this.viewErrorMsg = error
        }
      },      
    },
  }
</script>
