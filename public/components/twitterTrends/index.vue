<template>
  <div class="twitterTrends">
    <el-table
      :data="tweetList"
      @row-click="handleRowClick"
      style="width: 100%"
    >
      <el-table-column prop="id" label="id" width="180"></el-table-column>
      <el-table-column prop="full_text" label="full_text" width="300"></el-table-column>
      <el-table-column prop="img_url" label="img_url">
        <template #default="scope">
          <el-tooltip>
            <template #content>
              <img class="bigImg" :src="scope.row.img_url" />
            </template>
            <img class="smallImg" :src="scope.row.img_url" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template v-slot="scope">
          <div class="detail">
            <div><img class="bigImg" :src="scope.row.img_url" /></div>
            <div>{{scope.row.full_text}}</div>
            <div class="replies">
              <p v-for="(n, i) in scope.row.replies">{{n}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data(){
    return {
      tweetList: []
    }
  },
  methods: {
    getTweetList(){

    }, 
    handleRowClick(){

    }
  }
}
</script>
<style scoped></style>