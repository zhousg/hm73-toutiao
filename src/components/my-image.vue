<template>
  <div class="image-container">
    <!-- 图片按钮 -->
    <div class="img-btn" @click="openDialog()">
      <!-- 父组件有数据  没有使用默认图 -->
      <img :src="value||defaultImage" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="700px">
      <!-- v-model="activeName" 是选中了tab选项卡  name属性的值 -->
      <!-- label="配置管理" 选项卡文字  el-tab-pane 内容就是对应的内容容器 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image" v-loading="loading">
          <!-- 单选框组 -->
          <div style="margin-bottom:10px">
            <el-radio-group size="small" @change="toggleImage" v-model="reqParams.collect">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
          </div>
          <!-- 图片列表 -->
          <div
            class="img-item"
            :class="{selected:selectedImageUrl===item.url}"
            @click="selected(item.url)"
            v-for="item in images"
            :key="item.id"
          >
            <img :src="item.url" />
          </div>
          <!-- 分页区域 -->
          <el-pagination
            v-if="total>reqParams.per_page"
            background
            layout="prev, pager, next"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="peger"
            :total="total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            name="image"
            :show-file-list="false"
            :on-success="handleSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultImage from '../assets/images/default.png'
export default {
  name: 'my-image',
  props: ['value'],
  data () {
    return {
      // 默认为默认图片
      // 这个位置是否可以使用本地图片地址
      // 项目是webpack打包,如果本地的资源地址,存储在数据中，是不会去打包到你项目中。
      // 主动导入图片资源 此时图片资源就是一项数据（base64的数据）
      // value: defaultImage,
      defaultImage,
      // 上传图片的头部
      headers: {
        Authorization:
          'Bearer ' +
          JSON.parse(window.sessionStorage.getItem('hm73-toutiao')).token
      },
      // 加载中
      loading: false,
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 控制选项卡选中谁
      activeName: 'image',
      // 请求素材列表的参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      total: 0,
      // 上传图片预览地址
      imageUrl: null,
      // 素材列表
      images: [],
      // 选中的图片的ID
      selectedImageUrl: null
    }
  },
  methods: {
    // 确认图片
    confirmImage () {
      if (this.activeName === 'image') {
        if (!this.selectedImageUrl) return this.$message.info('请选中封面图')
        // 使用 selectedImageUrl
        // this.value = this.selectedImageUrl
        // 通知父组件数据改变数据
        this.$emit('input', this.selectedImageUrl)
      } else {
        if (!this.imageUrl) return this.$message.info('请上传封面图')
        // 使用 imageUrl
        // this.value = this.imageUrl
        this.$emit('input', this.imageUrl)
      }
      this.dialogVisible = false
    },
    // 上传成功后预览
    handleSuccess (res) {
      this.imageUrl = res.data.url
    },
    // 打开对话框
    openDialog () {
      this.dialogVisible = true
      // 把上一次数据清空
      this.selectedImageUrl = null
      this.imageUrl = null
      this.getImages()
    },
    // 获取列表
    async getImages () {
      this.loading = true
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
      this.loading = false
    },
    // 素材列表分页
    peger (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 素材列表切换
    toggleImage () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 选中当前点击的图片
    selected (url) {
      // 给当前点击的图片 加上selected
      // :class="{selected:条件}"
      // 条件：根据当前图片的URL 去匹配遍历的时候URL  一致加 不一致不加
      this.selectedImageUrl = url
    }
  }
}
</script>

<style scoped lang='less'>
.image-container{
  width: 150px;
  height: 120px;
  margin-right: 20px;
  display: inline-block;
  margin-bottom: 20px;
}
.img-item {
  width: 150px;
  height: 120px;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 10px;
  position: relative;
  // &连接符  .img-item.selected  .img-item::before{}
  &.selected {
    &::before {
      // 一个和图片一样大小的容器  有半透明背景 打钩图标
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2) url(../assets/images/selected.png)
        no-repeat center / 60px 60px;
    }
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
    // 图片属性，让图片按照等比例缩放显示在容器内
    object-fit: contain;
  }
}
.img-btn {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
