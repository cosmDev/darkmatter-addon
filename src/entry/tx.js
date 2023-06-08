import { createApp } from 'vue'
import App from '../view/tx/App.vue'
//import router from '../router'
import store from '../store'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/lib/util/colors'; 

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        primary: colors.lightBlue,
        secondary: colors.grey.darken1,
        accent: colors.pink.darken1,
        error: colors.red.accent3,
        background: colors.indigo.lighten5,
        info: colors.teal.darken1,
      },
      dark: {
        primary: "#10163a",
        background: "#000000",
        info: colors.teal.lighten1,
      },
    },
  },
})


createApp(App).use(vuetify).use(store).mount('#app')
