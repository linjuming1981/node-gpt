<template>
  <div class="home">
    <el-tabs v-model="page">
      <el-tab-pane label="amazon" name="amazon">
        <slot name="amazon"></slot>
      </el-tab-pane>
      <el-tab-pane label="novel" name="novel">
        <slot name="novel"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data(){
    return {
      page: 'amazon'
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