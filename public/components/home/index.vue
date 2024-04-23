<template>
  <div class="home">
    <el-button>test</el-button>
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="productId" label="productId" width="180" />
      <el-table-column prop="productTitile" label="productTitile" width="300" >
        <template #default="scope">
          <a :href="scope.row.productLink" target="_blank">{{scope.row.productTitile}}</a>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleClick">
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