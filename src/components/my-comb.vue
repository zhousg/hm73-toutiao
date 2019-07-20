<template>
  <div class='container'>B---{{bData}}</div>
</template>

<script>
import eventBus from '@/eventBus'
export default {
  name: 'my-comb',
  data () {
    return {
      bData: ''
    }
  },
  created () {
    eventBus.$on('getData', (data) => {
      this.bData = data
    })
  }
}
</script>

<style scoped lang='less'></style>
