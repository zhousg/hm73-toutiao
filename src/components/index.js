import MyBread from '@/components/my-bread.vue'
import MyChannel from '@/components/my-channel.vue'
import MyImage from '@/components/my-image.vue'
import MyComa from '@/components/my-coma.vue'
import MyComb from '@/components/my-comb.vue'
// 封装成插件的形式 Vue.use(插件) 执行插件的配置对象中install函数 且传入Vue对象
export default {
  install (Vue) {
    // 注册所有组件在Vue下
    Vue.component(MyBread.name, MyBread)
    Vue.component(MyChannel.name, MyChannel)
    Vue.component(MyImage.name, MyImage)
    // 测试使用
    Vue.component(MyComa.name, MyComa)
    Vue.component(MyComb.name, MyComb)
    // ... 注册即可
  }
}
