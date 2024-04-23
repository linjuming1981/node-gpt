<template>
  <div class="home">
    <el-button>test</el-button>
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="productId" label="productId" width="180" />
      <el-table-column prop="productTitle" label="productTitle" width="300" >
        <template #default="scope">
          <a :href="scope.row.productLink" target="_blank">{{scope.row.productTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="preview(scope.row)">
            Detail
          </el-button>
          <el-button link type="primary" size="small">Edit</el-button>
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
    async preview(product){
      let res = await axios({
        url: `/preview?id=${product.productId}`,
      })
      console.log(1212, res)
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