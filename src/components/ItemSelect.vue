<template>
  <div>
    <div class="subtitle color-accent select-subtitle">{{ title }}</div>
    <div v-for="(item, index) in items" :key="index" :style="itemStyle(index)" class="item" v-on:keydown="keyPress" >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
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
      default: function () { return { up: 'ArrowUp', down: 'ArrowDown', enter: 'Enter' } }
    },
    items: Array
  },
  mounted () {
    window.addEventListener('keydown', this.keyPress)
  },
  data () {
    return {
      selectIndex: 0,
      hasChosen: false
    }
  },
  methods: {
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
      if (this.selectIndex > 0) {
        this.selectIndex--
      }
    },
    nextItem () {
      if (this.selectIndex < this.items.length - 1) {
        this.selectIndex++
      }
    },
    selectItem () {
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
