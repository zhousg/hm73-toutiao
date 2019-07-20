<template>
  <div class="article-container">
    <el-card>
      <div slot="header">
        <my-bread>{{articleId?'修改文章':'发布文章'}}</my-bread>
      </div>
      <el-form :model="articleForm" label-width="100px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="articleForm.cover.type" @change="changeType">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div v-if="articleForm.cover.type === 1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type === 3">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
            <my-image v-model="articleForm.cover.images[1]"></my-image>
            <my-image v-model="articleForm.cover.images[2]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="!articleId">
          <el-button type="primary" @click="publish(false)">发表</el-button>
          <el-button @click="publish(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="success" @click="edit(false)">修改</el-button>
          <el-button @click="edit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: { quillEditor },
  data () {
    return {
      // 文章ID
      articleId: null,
      // 请求体数据
      articleForm: {
        title: '',
        content: '',
        cover: {
          type: 1,
          // 单图  三图
          images: []
        },
        channel_id: null
      },
      // 编辑器配置对象
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }]
          ]
        }
      }
    }
  },
  created () {
    // 问题：修改的地址过来 点击发布文章  组件不更新
    // 什么时候执行 组件的初始化之后调用
    this.articleId = this.$route.query.id
    // 获取文章数据
    this.articleId && this.getArticle(this.articleId)
    // if (this.articleId) {
    //   this.getArticle(this.articleId)
    // }
  },
  watch: {
    $route () {
      // 把编辑状态改成发布状态
      // 表单内容重置  把ID重置
      this.articleId = null
      // 不能重置为 null {}  因为：null.title 报错  {}.cover.type 报错
      this.articleForm = {
        title: '',
        content: '',
        cover: {
          type: 1,
          // 单图  三图
          images: []
        },
        channel_id: null
      }
    }
  },
  methods: {
    async getArticle (id) {
      const { data: { data } } = await this.$http.get('articles/' + id)
      this.articleForm = data
    },
    changeType () {
      // 重置图片数组
      this.articleForm.cover.images = []
    },
    async publish (draft) {
      // ...省略校验
      // draft  发布 false  草稿 true
      // 将来数据要地址栏？后传参的方式
      // this.$http({data:请全体,params:query数据地址栏数据})
      await this.$http.post('articles?draft=' + draft, this.articleForm)
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },
    async edit (draft) {
      await this.$http.put(`articles/${this.articleId}?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '修改草稿成功' : '修改成功')
      this.$router.push('/article')
    }
  }
}
</script>

<style scoped lang='less'>
// 在组件暴露的标签 会加上一个属于当前组件的唯一标签 data-v-xxx
// 而没在组件暴露的标签 也就其他组的标签 没有加上的唯一标识
// style scoped 意思：当前组件下生效
// .el-card ====> .el-card[data-v-xxx] 这是生成后的选择器
// .el-card__header ====> .el-card__header[data-v-xxx]  这是生成后的选择器
// 在全局定义：.el-card__header 选择器生效

// .el-card{
//   background: red;
// }
// .el-card__header{
//   background: white;
// }
</style>
