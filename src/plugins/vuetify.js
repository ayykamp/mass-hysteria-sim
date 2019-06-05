import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import CheckBoxOn from '../icons/CheckBoxOn'
import CheckBoxOff from '../icons/CheckBoxOff'
import Cancel from '../icons/Cancel'

import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  // hack so that you don't have to include all of the material icons
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
    },
    'delete': {
      component: Cancel, 
      props: {
        name: 'delete'
      }
    }
  }
})