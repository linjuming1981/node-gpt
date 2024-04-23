<template>
  <div class="home">
    <el-button>test</el-button>
    <div>aaaaa</div>
  </div>
</template>
<script>
export default {
  data(){
    return {

    }
  },
  methods: {
    async getSheetRows(){
      let rows = await axios({
        url: '/getSheetRows',
        method: 'post',
        data: {
          filter: {}
        }
      })
      console.log(111, rows)
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