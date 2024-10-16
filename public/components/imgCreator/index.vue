<template>
  <div class="imgCreator">
    <div class="preview_line">
      <img :src="imgUrl" />
    </div>
    <div class="prompt_line">
      <span>prompt:</span>
      <el-input class="imgPrompt" type="textarea" v-model="imgPrompt"></el-input>
      <span>options:</span>
      <el-input class="options" type="textarea" v-model="optionsStr"></el-input>
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
      optionsStr: `{"num_inference_steps": 4, "guidance_scale": 7.5}`
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
          imgPrompt: this.imgPrompt,
          options: JSON.parse(this.optionsStr),
        }
      })
      this.imgUrl = `${res.data.imgUrl}?t=${Date.now()}`
    }
  }
}
</script>
<style scoped>
.imgCreator{}
.preview_line{}
.preview_line img{width: 750px;}
.prompt_line{
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  align-items: flex-end;
  background-color: #edf0f3;
  border-top: 1px solid #bdbdbd;
}
.imgPrompt{
  margin: 0 20px 0 20px;
}
</style>
