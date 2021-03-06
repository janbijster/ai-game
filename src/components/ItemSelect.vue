<template>
  <div>
    <div class="subtitle color-accent select-subtitle">{{ title }}</div>
    <div v-for="(item, index) in items" :key="index" :style="itemStyle(index)" class="item" v-on:keydown="keyPress" >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
import Sounds from '@/classes/Sounds.js'

export default {
  name: 'ItemSelect',
  props: {
    activeColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.5)'
    },
    selectedColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.2)'
    },
    title: {
      type: String,
      default: 'Select'
    },
    navKeys: {
      type: Object,
      default: function () { return { up: 'ArrowUp', down: 'ArrowDown', enter: 'Enter', gamepad: 0 } }
    },
    items: Array
  },
  mounted () {
    // for keys:
    window.addEventListener('keydown', this.keyPress)
    // for gamepad:
    this.$store.commit('setGamepadAxesCallback', {
      gamepadIndex: this.navKeys.gamepad,
      callback: this.gamepadAxes
    })
    this.$store.commit('setGamepadCallback', {
      gamepadIndex: this.navKeys.gamepad,
      buttonIndex: 0,
      callback: this.selectItem
    })
  },
  data () {
    return {
      selectIndex: 0,
      hasChosen: false
    }
  },
  methods: {
    gamepadAxes (input) {
      if (input[1] > 0) {
        this.previousItem()
      } else if (input[1] < 0) {
        this.nextItem()
      }
    },
    keyPress: function (event) {
      if (!this.hasChosen) {
        if ('up' in this.navKeys && this.navKeys.up === event.key) {
          this.previousItem()
        }
        if ('down' in this.navKeys && this.navKeys.down === event.key) {
          this.nextItem()
        }
        if ('enter' in this.navKeys && this.navKeys.enter === event.key) {
          this.selectItem()
        }
      }
    },
    previousItem () {
      Sounds.PlaySound('bleep6')
      if (this.selectIndex > 0) {
        this.selectIndex--
      }
    },
    nextItem () {
      Sounds.PlaySound('bleep5')
      if (this.selectIndex < this.items.length - 1) {
        this.selectIndex++
      }
    },
    selectItem () {
      Sounds.PlaySound('bleep1')
      this.hasChosen = true
      this.$emit('selected', this.selectIndex)
    },
    itemStyle (index) {
      let color
      let backgroundColor
      if (index === this.selectIndex) {
        color = '#fff'
        if (this.hasChosen) {
          backgroundColor = this.selectedColor
        } else {
          backgroundColor = this.activeColor
        }
      } else {
        backgroundColor = 'rgba(0,0,0,0)'
      }
      return {
        color: color,
        backgroundColor: backgroundColor
      }
    }
  }
}
</script>

<style scoped>
.select-subtitle {
  padding: 5px 10px 25px;
}
.item {
  padding: 5px 10px;
}
</style>
