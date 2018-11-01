<template>
  <div class="fill-parent-absolute">
    <div class="subtitle vertical-center">Creating new agents...</div>
  </div>
</template>

<script>

export default {
  name: 'CreateAgentStart',
  mounted () {
    setTimeout(this.next, 1000)
  },
  methods: {
    next () {
      this.$router.push({ name: 'createAgentSelectInput' })
    }
  }
}
</script>
