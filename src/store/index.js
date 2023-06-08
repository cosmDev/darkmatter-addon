import { createStore } from 'vuex'
import axios from 'axios' 
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc"; 
import { fromUtf8 } from "@cosmjs/encoding";
import { bech32 } from "bech32";

import * as distrib from "cosmjs-types/cosmos/distribution/v1beta1/query";
import * as bank from "cosmjs-types/cosmos/bank/v1beta1/query"; 
import * as staking from "cosmjs-types/cosmos/staking/v1beta1/query"; 
import * as mint from "cosmjs-types/cosmos/mint/v1beta1/query"; 
import getCosmosConfig from "./cosmos.config.js";

export default createStore({
  state: {
    isLogged: false,
    block: undefined,
    wallet: '',
    wallets: '',
    dataWallet: '',
    rpcClient: '',
    rpcBase: '',
    balance: 0,
    totalRewards: 0,
    chainsStats: '',
    cosmosConfig: [],
    defaultChain: '',
    defaultChainData: '',
    currentAddress: '',
    totalDelegations: 0,
    totalUnbound: 0,
    totalSupply: 0,
  },
  getters: {
  },
  mutations: {
    async updateRpcClient(state, data) {      
      state.rpcClient = data
    },    
    async updateRpcBase(state, data) {      
      state.rpcBase = data
    },
    
    async updateCosmosConfig(state, data) {      
      state.cosmosConfig = data
    },     
    async updateDefaultChain(state, data) {
      const decode = bech32.decode(state.wallet.address)
      const returnAddress = bech32.encode(data.coinLookup.addressPrefix, decode.words)
      
      state.defaultChain = data
      state.currentAddress = returnAddress
    },  
    async updateWallet(state, data) {    
      state.wallet = data 
      let bech32prefix = 'bcna'
      if (state.defaultChain) {
        console.log(state.defaultChain)
        bech32prefix = state.defaultChain.coinLookup.addressPrefix
      }  
      const decode = bech32.decode(data.address)
      const returnAddress = bech32.encode(bech32prefix, decode.words)

      state.currentAddress = returnAddress


    },
    async updateWallets(state, data) {      
      state.wallets = data
    },   
    async updateBalance(state, data) {      
      state.balance = data
    },    
    async updateTotalRewards(state, data) {      
      state.totalRewards = data
    },       
    async updateChainsStats(state, data) {      
      state.chainsStats = data
    },   
    async updateTotalDelegations(state, data) {      
      state.totalDelegations = data
    },     
    async updateTotalUnbound(state, data) {      
      state.totalUnbound = data
    },       
    async updateTotalSupply(state, data) {      
      state.totalSupply = data
    },     
        
  },
  actions: {
    async initRpc({ commit, state }) {      
       
      // const client = await Tendermint34Client.connect('https://rpc.bitcanna.io') 
      if(state.rpcClient) {
        console.log('state.rpcClient', state.rpcClient)
        state.rpcBase.disconnect();
      }

      if(typeof state.defaultChain.rpcURL  === 'undefined') {
        state.defaultChain.rpcURL = 'https://rpc.bitcanna.io'
      }  
      const client = await Tendermint34Client.connect(state.defaultChain.rpcURL) 
      const queryClient = new QueryClient(client);
      const rpcClient = createProtobufRpcClient(queryClient);
      commit('updateRpcClient', rpcClient)
      commit('updateRpcBase', client)
    },     
    async initChainsConfig({ commit }) {    
      commit('updateCosmosConfig', getCosmosConfig) 
    },  
    async updateDataWallet({ commit }) {    
       commit('updateDataWallet', '')
    },    
    async defaultWallet({ commit }) {      
        let getWallets = await chrome.storage.local.get(["accounts"])   
        commit('updateWallet', getWallets.accounts[0])
        commit('updateWallets', getWallets.accounts) 
    },     
    async changeWallet({ commit }, name) {
      let getWallets = await chrome.storage.local.get(["accounts"])
      let found = getWallets.accounts.find(element => element.name === name);        
      commit('updateWallet', found) 
    },    
    async changeChain({ commit }, id) { 
      getCosmosConfig[id].id = id  
      commit('updateDefaultChain', getCosmosConfig[id])
    },        
    async getWalletData({ commit, state }) { 
      const queryDistrib = new distrib.QueryClientImpl(state.rpcClient);
      const queryDistribResult = await queryDistrib.DelegationTotalRewards({ delegatorAddress: state.currentAddress }); 
      let returnValue = ''
      if ( queryDistribResult.total.length > 0){
        returnValue = Number(queryDistribResult.total[0].amount / 1000000000000000000000000).toFixed(2)
      } else {
        returnValue = 0
      }
 
      commit('updateTotalRewards', returnValue)      
      return returnValue

    },  
    async getBankModule({ commit, state }) {    

      const queryBank = new bank.QueryClientImpl(state.rpcClient); 
      let spendableBalances = await queryBank.SpendableBalances({ address: state.currentAddress });
      // let allBalances = await queryBank.AllBalances({ address: state.currentAddress }); 
      
      if (typeof spendableBalances.balances[0] === 'undefined') {
        spendableBalances.balances[0] = {
          amount: 0
        }
      } 
      let totalSupply = await queryBank.TotalSupply();
      
      let foundTotalSupply = totalSupply.supply.find(element => element.denom === state.defaultChain.coinLookup.chainDenom);
      console.log('totalSupply', foundTotalSupply.amount / 1000000)  
      commit('updateBalance', (spendableBalances.balances[0].amount / 1000000).toFixed(2))
      commit('updateTotalSupply', (foundTotalSupply.amount / 1000000).toFixed(2))
    },   
    async getMintModule({ /* commit, */ state }) {    

      const queryMint = new mint.QueryClientImpl(state.rpcClient); 
      console.log('queryMint', await queryMint.Params({}))
      let { inflation } = await queryMint.Inflation({}); 
      console.log('inflation', fromUtf8(inflation))
    },      
    
    async getStakingModule({ commit , state }) {    

      const queryStaking = new staking.QueryClientImpl(state.rpcClient); 
      let delegatorValidators = await queryStaking.DelegatorDelegations({ delegatorAddr: state.currentAddress }); 
      // console.log(delegatorValidators.delegationResponses) 
      let total = 0;
      for (let i of delegatorValidators.delegationResponses) {
        // console.log(i.balance.amount)
        total += Number(i.balance.amount);
      }     
      console.log(total)
 
      let allUnbound = await queryStaking.DelegatorUnbondingDelegations({ delegatorAddr: state.currentAddress }); 
      
      let totalUnbound = 0;
      if (allUnbound.unbondingResponses.length > 0) {
        
         console.log(allUnbound.unbondingResponses) 
        for (let i of allUnbound.unbondingResponses) {
          // console.log(i.balance.amount) 
          for (let j of i.entries) {
            totalUnbound += Number(j.balance)
          }
        }   
        console.log(totalUnbound) 
      } else {
        totalUnbound = 0.00
      }

      commit('updateTotalDelegations', (total / 1000000).toFixed(2)) 
      commit('updateTotalUnbound', (totalUnbound / 1000000).toFixed(2)) 
    },           
    async getChainStats({ commit, state }) {  




      const inflation = await axios('https://lcd.bitcanna.io/cosmos/mint/v1beta1/inflation') 
      const totalSupply = await axios('https://lcd.bitcanna.io/cosmos/bank/v1beta1/supply/ubcna') 
      const communityPool = await axios('https://lcd.bitcanna.io/cosmos/distribution/v1beta1/community_pool')
      

      const querystaking = new staking.QueryClientImpl(state.rpcClient); 
      let allValidators = await querystaking.Validators({ status: 'BOND_STATUS_BONDED' }); 
      let tokenBounded = 0
      for (let i = 0; i < allValidators.validators.length; i++) {
        const tokenByVal = allValidators.validators[i].tokens
        tokenBounded += Number(tokenByVal)
      }

      let finalInflation = inflation.data.inflation * 100
      let finalTotalSupply = totalSupply.data.amount.amount / 1000000
      let finalCommunityPool = communityPool.data.pool[0].amount / 1000000
      let finalBondedTokens = tokenBounded / 1000000
      
      let finalStats = {
        inflation: finalInflation,
        totalSupply: finalTotalSupply,
        bondedTokens: finalBondedTokens,
        notBondedTokens: finalTotalSupply - finalBondedTokens,
        communityPool: finalCommunityPool
      }
       
      commit('updateChainsStats', finalStats)
    },      
  },



  modules: {
  }
})
