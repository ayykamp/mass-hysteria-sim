import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import CheckBoxOn from '../icons/CheckBoxOn'
import CheckBoxOff from '../icons/CheckBoxOff'

import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  icons: {
    'checkboxOn': {
      component: CheckBoxOn,
      props: {
        name: 'checkboxOn'
      }
    },
    'checkboxOff': {
      component: CheckBoxOff, 
      props: {
        name: 'checkboxOff'
      }
    }
  }
})