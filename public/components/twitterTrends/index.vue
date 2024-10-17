<template>
  <div class="twitterTrends">
    <div class="cur_tag">
      <span class="label">当前tag: </span>
      <el-input v-model="curTag" :title="curTag">
        <template #append>
          <el-button @click="getTrendTreetList(curTag)">搜索</el-button>
        </template>
      </el-input>
    </div>
    <el-table
      :data="tweetList"
      @row-click="handleRowClick"
      style="width: 100%"
      ref="table"
    >
      <el-table-column prop="id" label="id" width="180">
        <template #default="scope">
          <a :href="`https://x.com/xxx/status/${scope.row.id}`" target="_blank">{{scope.row.id}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="full_text" label="full_text" width="500"></el-table-column>
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
            <div class="img_box"><img class="bigImg" :src="scope.row.img_url" /></div>
            <div class="text_box">
              <div class="tweet_full_text">{{scope.row.full_text}}</div>
              <div class="replies">
                <p v-for="(n, i) in scope.row.replies">{{n}}</p>
              </div>
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
      curTag: '',
      tweetList: [],
    }
  },
  created(){
    this.getTrendTreetList()
  },
  methods: {
    async getTrendTreetList(tag=''){
      let res = await axios({
        url: '/getTrendTreetList',
        method: 'post',
        data: {
          tag, // 不填则随机
        }
      })
      this.tweetList = res.data.tweetList
      this.curTag = res.data.tag
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
      await this.getTweetReplies(row)
      this.$refs.table.toggleRowExpansion(row); // 切换展开/收起行  
    }
  }
}
</script>
<style scoped>
.cur_tag{
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: hsl(205deg 100% 95%);
}
.cur_tag .label{
  width:  100px;
}
.smallImg{
  width: 50px;
  height: 50px;
}
.bigImg{
  width: 400px;
  height: 400px;
}
.detail{
  display: flex;
  background-color: #edf0f3;
  padding: 20px;
}
.detail .img_box{
  flex-grow: 0;
  flex-shrink: 0;
  width: 400px;
  margin-right: 40px;
}
.detail .img_box .bigImg{}
.detail .text_box{}
.detail .text_box .tweet_full_text{
  color: #0a8f22;
  font-size: 15px;
}
.detail .text_box .replies{}
.detail .text_box .replies p{}

</style>