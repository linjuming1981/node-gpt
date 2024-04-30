<template>
  <div class="home">
    <el-button @click="googleOauth">Google OAuth2</el-button>
    <el-button @click="editOauth">Edit OAuth2 Config</el-button>
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="productId" label="productId" width="180" />
      <el-table-column prop="productTitle" label="productTitle" width="300" >
        <template #default="scope">
          <a :href="scope.row.productLink" target="_blank">{{scope.row.productTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <a :href="`/preview/${scope.row.productId}`" target="_blank">Preview</a>
          <el-button link type="primary" size="small" @click="createBlogPost(scope.row)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="oauthDialogVisible"
      :title="$v14s('common.advancedLinkageSettings')"
      width="1100px"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @close="canelEditOauth()"
    >
      <el-input
        ref="oauthConfig"
        v-model="oauthConfig"
        size="default"
        type="textarea"
        autosize
      ></el-input>
      <template #footer>
        <span>
          <el-button
            size="default"
            @click="canelEditOauth()"
          >取消</el-button>
          <el-button
            type="primary"
            size="default"
            @click="doEditOauth()"
          >保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return {
      products: [],
      oauthDialogVisible: false,
      oauthConfig: '',
    }
  },
  methods: {
    async getSheetRows(){
      let res = await axios({
        url: '/getSheetRows',
        method: 'post',
        data: {
          filter: {}
        }
      })
      this.products = res.data.data
    },
    async googleOauth(){
      let res = await axios({
        url: '/googleOauth',
        method: 'post',
        data: {
          baseUrl: location.origin,
        }
      })
      let url = res.data.url
      window.location.href = url
    },
    async createBlogPost(product){
      let res = await axios({
        url: '/createBlogPost',
        method: 'post'
      })
      console.log({res})
    },
    async editOauth(){
      this.oauthDialogVisible = true
      let res = await axios({
        url: '/getOauthConf'
      })
      let config = JSON.parse(res.data.config)
      config.redirect_uris = [`${location.origin}/saveOauthToken`]
      config = JSON.stringify(config, null, 2)
      this.oauthConfig = res.config
    },
    async doEditOauth(){
      let res = await axios({
        url: '/saveOauthConf',
        method: 'post',
        data: {
          config: this.oauthConfig
        }
      })
      this.oauthDialogVisible = false
    },
    canelEditOauth(){
      this.oauthDialogVisible = false
    }
  },
  mounted(){
    this.getSheetRows();
  }
}
</script>
<style>
.home {
  color: red;
}
</style>