<template>
  <div class="select-margin-top">
    <div class="left-part">
      <ItemSelect
        :items="items" title="Select Input" @selected="inputSelectedRed"
        :nav-keys="keys.red" :active-color="colors.red.main">
      </ItemSelect>
    </div>
    <div class="right-part">
      <ItemSelect
        :items="items" title="Select Input" @selected="inputSelectedBlue"
        :nav-keys="keys.blue" :active-color="colors.blue.main">
      </ItemSelect>
    </div>
  </div>
</template>

<script>
import ItemSelect from '@/components/ItemSelect.vue'
import Globals from '@/classes/Globals.js'

export default {
  name: 'CreateAgentSelectInput',
  props: {
    redAgent: Object,
    blueAgent: Object
  },
  components: {
    ItemSelect
  },
  data () {
    return {
      items: Globals.inputOptions
    }
  },
  mounted () {
  },
  methods: {
    inputSelectedRed (index) {
      console.log('Selected input for redAgent: ', this.items[index])
      this.redAgent.sensorChoice = this.items[index].value
      this.redAgent.part = { sensors: this.items[index].sensors }
      // add fixed actuators:
      this.redAgent.part.actuators = Globals.standardActuators

      this.$emit('red-agent-input-selected')
    },
    inputSelectedBlue (index) {
      console.log('Selected input for blueAgent: ', this.items[index])
      this.blueAgent.sensorChoice = this.items[index].value
      this.blueAgent.part = { sensors: this.items[index].sensors }
      // add fixed actuators:
      this.blueAgent.part.actuators = Globals.standardActuators
      this.$emit('blue-agent-input-selected')
    }
  },
  computed: {
    keys () {
      return Globals.keys
    },
    colors () {
      return Globals.colors
    }
  }
}
</script>

<style scoped>
.select-margin-top {
  position: relative;
  margin-top: 50px;
}
</style>
