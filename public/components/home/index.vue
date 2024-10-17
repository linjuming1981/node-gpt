<template>
  <div class="home">
    <el-tabs v-model="page">
      <!-- <el-tab-pane label="amazon" name="amazon">
        <slot name="amazon"></slot>
      </el-tab-pane> -->
      <el-tab-pane label="novel" name="novel">
        <div v-if="page === 'novel'">
          <slot name="novel"></slot>
        </div>
      </el-tab-pane>
      <el-tab-pane label="imgCreator" name="imgCreator">
        <div v-if="page === 'imgCreator'">
           <slot name="imgCreator"></slot>
        </div>
      </el-tab-pane>
      <el-tab-pane label="twitterTrends" name="twitterTrends">
        <div v-if="page === 'twitterTrends'">
          <slot name="twitterTrends"></slot>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data(){
    return {
      page: 'twitterTrends'
    }
  },
  methods: {
  },
  mounted(){
  }
}
</script>
<style>
.home {
}
</style>