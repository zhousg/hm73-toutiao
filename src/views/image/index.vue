<template>
  <div class="container" v-loading="loading">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div style="margin-bottom:20px">
        <!-- 按钮式单选框 -->
        <el-radio-group size="small" @change="search()" v-model="reqParams.collect">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 添加素材 -->
        <el-button size="small" @click="dialogVisible=true" style="float:right" type="success">添加素材</el-button>
      </div>
      <ul class="img-list">
        <li v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="fot" v-if="!reqParams.collect">
            <span
              @click="toggleFav(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="delImage(item.id)" class="el-icon-delete"></span>
          </div>
        </li>
      </ul>
      <el-pagination
        v-if="total>reqParams.per_page"
        background
        layout="prev, pager, next"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加素材对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :show-file-list="false"
        :headers="headers"
        name="image"
        :on-success="handleSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 分页相关
      total: 0,
      // 添加素材
      dialogVisible: false,
      // 预览的地址
      imageUrl: null,
      // 上传请求头
      headers: {
        Authorization:
          'Bearer ' +
          JSON.parse(window.sessionStorage.getItem('hm73-toutiao')).token
      },
      // 加载状态
      loading: false
    }
  },
  created () {
    // 获取素材列表
    this.getImages()
  },
  methods: {
    // 删除
    delImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete('user/images/' + id)
        // 删除成功
        this.$message.success('删除成功')
        this.getImages()
      }).catch(() => {})
    },
    // 收藏 取消收藏
    async toggleFav (item) {
      // item 包含 id  is_collected 是否收藏
      const {
        data: { data }
      } = await this.$http.put('user/images/' + item.id, {
        collect: !item.is_collected
      })
      // 成功  图标切换颜色  red类名
      this.$message.success('操作成功')
      // item.is_collected = !item.is_collected
      item.is_collected = data.collect
    },
    // 上传成功后的处理函数
    handleSuccess (res) {
      // 预览 需要地址
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      // 关闭对话框  更新列表
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getImages()
        this.imageUrl = null
      }, 1500)
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    search () {
      this.reqParams.page = 1
      this.getImages()
    },
    async getImages () {
      this.loading = true
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 获取中条数
      this.total = data.total_count
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
.img-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  li {
    width: 180px;
    height: 180px;
    float: left;
    border: 1px dashed #eee;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .fot {
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
