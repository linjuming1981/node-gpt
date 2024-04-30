<template>
  <div class="home">
    <el-button @click="googleOauth">google OAuth2</el-button>
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
  </div>
</template>
<script>
export default {
  data(){
    return {
      products: []
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
        method: 'get'
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