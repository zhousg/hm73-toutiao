<template>
  <div class='container'>A <button @click="fn">传B数据</button></div>
</template>

<script>
import eventBus from '@/eventBus'
export default {
  name: 'my-coma',
  data () {
    return {
      aData: 'A组件数据'
    }
  },
  methods: {
    fn () {
      eventBus.$emit('getData', this.aData)
    }
  }
}
</script>

<style scoped lang='less'></style>
