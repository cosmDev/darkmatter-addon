<template>
  <div>
    <v-card>
 
        <v-tabs
          v-model="tab" 
        >
          <v-tab
            v-for="item in items"
            :key="item"
            :value="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
 

    <v-window v-model="tab">
      <v-window-item
        v-for="item in items"
        :key="item"
        :value="item"
      > 
        <v-card v-if="item === 'Add wallet'" flat>
        <v-list
          lines="two"
          subheader
        > 
          <v-list-item title="Infomations" subtitle="Set the content filtering level to restrict apps that can be downloaded"></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list 
        >
        <v-list-item>
            <v-text-field
                v-model="name" 
                variant="outlined"
                :color="defaultChain.color"
                counter="6"
                label="Wallet name"
                style="min-height: 96px" 
                class="mt-6"
              ></v-text-field>
          </v-list-item>        
          <v-list-item>
            <v-btn
              block
              :color="defaultChain.color"
              @click="generateWallet"
            >
              Generate
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-textarea
              v-model="mnemonic"
              auto-grow
              variant="outlined"
              :color="defaultChain.color"
              label="Mnemonic"
              rows="4"
              class="mt-6"
            ></v-textarea>
            Address: <b>{{ addressWallet }}</b>
          </v-list-item>
          <v-list-item>
            <v-text-field
                v-model="password" 
                variant="outlined"
                :color="defaultChain.color" 
                label="Password"
                style="min-height: 96px"
                type="password"
                class="mt-6"
              ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-btn
              block
              :color="defaultChain.color"
              @click="addWallet"
            >
              Save
            </v-btn>   
          </v-list-item>         
        </v-list>     
        </v-card>
        <v-card v-if="item === 'View wallets'" flat>
          <v-list>
 
      <v-list-subheader inset>Wallets</v-list-subheader>  
      <v-list-item
        v-for="(wallet, index) in wallets"
        :key="wallet?.name"
        :title="wallet?.name"
        :subtitle="wallet?.address"
      >
        <template v-slot:prepend>
          <v-avatar :color="wallet?.color">
            <v-img
              src="https://i.imgur.com/TWCBMXG.png"
              alt="John"
            ></v-img>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn
            color="red"
            icon="mdi-delete-alert"
            variant="text"
            @click="startDeleteWallet(index)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
        </v-card>          
      </v-window-item>
    </v-window>





      </v-card>

    <v-snackbar
      v-model="snackbarDelete"
      vertical
      color="warning" 
      elevation="24"
      :timeout="2000"
    >
      <div class="text-subtitle-1 pb-2">Are you sure to delete this wallet?</div>
      <template v-slot:actions>
        <v-btn 
          variant="text"
          @click="snackbarDelete = false"
        >
          No
        </v-btn>        
        <v-btn 
          variant="text"
          @click="deleteWallet(deleteWalletId)"
        >
          Yes
        </v-btn>
      </template>
    </v-snackbar>


  <div class="text-center">
 

    <v-snackbar
      v-model="snackbar"
      vertical
      color="success" 
      elevation="24"
      :timeout="2000"
    >
      <div class="text-subtitle-1 pb-2">Wallet imported!</div>
      <template v-slot:actions>
        <v-btn 
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>


  </div>


</template>

<script>
import { mapState } from 'vuex'   
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing" 
//import cosmosConfig from '~/cosmos.config'

  export default {
    data: () => ({
      valid: false,
      name: '', 
      mnemonic: '',
      password: '',
      viewError: false,
      viewErrorMsg: '',
      listWallets: '',
      dialogDetail: false,
      addressWallet: '',
      allWallets: '',
      addressWalletError: false,
      snackbar: false,
      snackbarDelete: false,
      deleteWalletId: '',
      //cosmosConfig: cosmosConfig,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 20 || 'Name must be less than 20 characters',
      ],
      mnemonicRules: [
        v => !!v || 'Mnemonic is required',
      ],
      passRules: [
        v => !!v || 'Password is required'
      ],
      tab: null,
        items: [
          'Add wallet', 'View wallets'
        ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    }),
    computed: {
      ...mapState(['defaultChain', 'wallets'])
    },  
    watch:{
      async 'mnemonic'(newVal){
        try {
          const wallet = await DirectSecp256k1HdWallet.fromMnemonic(newVal, {
            prefix: 'cosmos'
          });
          const [firstAccount] = await wallet.getAccounts()
          console.log(firstAccount)
          this.addressWallet = firstAccount.address
        } catch (error) {
          console.log(error)
          this.addressWallet = error
        }
      }
    }, 
    async mounted () {
      /*let checkToken = await this.$store.dispatch('data/checkToken')
      if (checkToken) {
        await this.$store.dispatch('data/getAllWallets')
      }*/
      
      await this.$store.dispatch('defaultWallet')
    },
    methods: {
      async generateWallet() {
        const wallet = await DirectSecp256k1HdWallet.generate(12)
        console.log(wallet)
        this.mnemonic = wallet.mnemonic
      },      
      async addWallet() {
        try {
  
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic( this.mnemonic, {
            prefix: 'cosmos'
          } )
          const [firstAccount] = await wallet.getAccounts()  
          var finalWallet = await wallet.serialize( this.password ) 
          console.log(finalWallet)       
          // var finalWallet = await wallet.serialize( this.password )     

 
          let finalName = this.name
          let itemAccounts = await chrome.storage.local.get(["accounts"])
            console.log(itemAccounts.accounts)
            
              if (typeof itemAccounts.accounts !== 'undefined') {
                itemAccounts.accounts.push({ data: finalWallet, address: firstAccount.address, name: finalName })
                console.log(itemAccounts.accounts)
                chrome.storage.local.set({ "accounts": itemAccounts.accounts } , function(){
                    //  Data's been saved  
                });                 
              } else {
                chrome.storage.local.set({ "accounts": [{ data: finalWallet, address: firstAccount.address, name: finalName }] } , function(){
                    //  Data's been saved 
                });                
              } 

              this.name = ''
              this.mnemonic = ''
              this.password = ''  
              this.snackbar = true        
              await this.$store.dispatch('defaultWallet')
        } catch (error) {
          console.log(error)
          this.viewError = true
          this.viewErrorMsg = error
        }
      },
      startDeleteWallet( walletId ) {
        this.snackbarDelete = true
        this.deleteWalletId = walletId
      },
      async deleteWallet( walletId ) {
        try {
          let allWallets = await chrome.storage.local.get(["accounts"]) 

          //let arr = allWallets.accounts.filter(x => x !== walletId);

          for (var i = 0; i < allWallets.accounts.length; i++) {
            if (i === walletId) {
              allWallets.accounts.splice(i, 1);
              break;
            }
          }
          chrome.storage.local.set({ "accounts": allWallets.accounts });  
          await this.$store.dispatch('defaultWallet')
          this.snackbarDelete = false
        } catch (error) {
          this.viewError = true
          this.viewErrorMsg = error
        }
      },
    },
  }
</script>
