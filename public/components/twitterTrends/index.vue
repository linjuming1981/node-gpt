<template>
  <div class="twitterTrends">
    <el-table
      :data="tweetList"
      @row-click="handleRowClick"
      style="width: 100%"
      ref="table"
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
    async getTrendTreetList(){
      let res = await axios({
        url: '/getTrendTreetList',
        method: 'post',
        data: {
          tag: '' // 不填则随机
        }
      })
      this.tweetList = res.data.tweetList
    }, 

    async getTweetReplies(tweetItem){
      let res = await axios({
        url: '/getTweetReplies',
        method: 'post',
        data: {
          tweetId: tweetItem.id
        }
      })
      tweetItem.replies = res.data.replies
    },

    async handleRowClick(row) {
      await this.getTweetReplies(row.id)
      this.$refs.table.toggleRowExpansion(row); // 切换展开/收起行
    }
  }
}
</script>
<style scoped></style>