<template>
  <div class="home">
    <div class="top">
      <el-button type="primary" @click="googleOauth">Google OAuth2</el-button>
      <el-button type="primary" @click="editOauth">Edit OAuth2 Config</el-button>
      <a href="https://console.cloud.google.com/apis/credentials/oauthclient/149527344053-q46e8ltcj9rmfbivu757qru678cgcsb6.apps.googleusercontent.com?project=test-link-sheet" target="_blank">Oauth2</a>
      <el-button type="primary" @click="test">调试4</el-button>
    </div>
    <div class="body">
      <el-table :data="products" style="width: 100%" :row-class-name="getRowClsName">
        <el-table-column prop="productId" label="productId" width="180" />
        <el-table-column prop="productTitle" label="productTitle" width="300" >
          <template #default="scope">
            <a :href="scope.row.productLink" target="_blank">{{scope.row.productTitle}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="postedToBlogger" label="已发布" width="100" />
        <el-table-column fixed="right" label="Operations" width="160">
          <template #default="scope">
            <div class="action">
              <a class="preview" :href="`/preview/${scope.row.productId}`" target="previewFrame" @click="isPreview=true">预览</a>
              <a class="json" :href="`/json/${scope.row.productId}`" target="_blank">json</a>
              <el-button link type="primary" size="small" @click="createBlogPost(scope.row)">发帖</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="preview">
        <el-icon
          @click="isPreview=false"
        ><CircleClose /></el-icon>
        <iframe id="previewFrame" name="previewFrame"></iframe>
      </div>
    </div>
    <el-dialog
      v-model="oauthDialogVisible"
      title="编辑Oauth2"
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
            type="primary"
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
      isPreview: false,
    }
  },
  methods: {
    async test(){
      let res = await axios({
        url: '/getSheetRows',
        method: 'post',
        data: {
          filter: {aiResult:''},
          update: {aiResult: 'creating'},
          count: 3,
        }
      })
      this.products = res.data.data
    },

    async getSheetRows(){
      let res = await axios({
        url: '/getSheetRows',
        method: 'post',
        data: {
          filter: {postedToBlogger: '0'}
        }
      })
      this.products = res.data.data.filter(n => n.aiResult)
      console.log(this.products)
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
        method: 'post',
        data: {
          product
        }
      })
      product.postedToBlogger = '1'
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
      this.oauthConfig = config
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
    },

    async updateRow(){ // 调试，暂时没用
      let res = await axios({
        url: '/updateRow',
        method: 'post',
        data: {
          product: {productId: 'kkkk'}
        }
      })
      console.log({res})
    },

    getRowClsName(row, rowIndex){
      if (row.postedToBlogger === '1') {
        return 'highlight-row';
      }
      return '';
    }

  },
  mounted(){
    this.getSheetRows();
  }
}
</script>
<style>
.home {
}
.top{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.top a{
  margin-left: 20px;
  color: #45940a;
}
.action{
  display: flex;
  align-items: center;
}
.action .preview, .action .json{ 
  font-size: 12px;
  margin-right: 10px;
}
.highlight-row{
  background-color: lightblue;
}
.body{
  display: flex;
}
.body #previewFrame {
    width: 50vw;
    height: 2000px;
    padding: 5px;
    background-color: #fff;
    border: 1px solid #d5dce2;
}
</style>