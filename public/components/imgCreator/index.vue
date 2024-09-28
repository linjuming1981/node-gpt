<template>
  <div class="imgCreator">
    <div class="preview_line">
      <img :src="imgUrl" />
    </div>
    <div class="prompt_line">
      <span>prompt:</span>
      <el-input type="textarea" v-model="imgPrompt"></el-input>
      <el-button type="primary" @click="createImg">生成</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      imgUrl: '',
      imgPrompt: '',
    }
  },
  methods: {
    async createImg(){
      if(!this.imgPrompt){
        return;
      }
      const res = await axios({
        url: '/createImgByPrompt',
        method: 'post',
        data: {
          imgPrompt: this.imgPrompt
        }
      })
      this.imgUrl = `${res.imgUrl}?t=${Date.now()}`
    }
  }
}
</script>
<style scoped>
.imgCreator{}
.preview_line{}
.prompt_line{
  display: flex;
}
</style>
