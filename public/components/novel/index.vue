<template>
  <div class="novel">
    <div class="top">
      <el-button type="primary" @click="getSheetRows(true)">刷新列表</el-button> 
    </div>
    <div class="body">
      <el-table :data="novels" style="width: 100%" :row-class-name="getRowClsName">
        <el-table-column prop="productId" label="productId" width="100" />
        <el-table-column prop="cnTitle" label="cnTitle" width="180" />
        <el-table-column prop="enTitle" label="enTitle" width="180" />
        <el-table-column prop="postedToBlogger" label="postedToBlogger" width="100" />
        <el-table-column prop="imgUrl" label="imgUrl" width="100">
          <template #default="scope">
            <div class="imgUrl">
              <div v-if="scope.row.imgUrl">
                <el-tooltip>
                  <template #content>
                    <img class="bigImg" :src="scope.row.imgUrl" />
                  </template>
                  <img :src="scope.row.imgUrl" />
                </el-tooltip>
              </div>
              <div v-else>
                <el-button link type="primary" size="small" @click="createImgUrl(scope.row)">生成</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="160">
          <template #default="scope">
            <div class="action">
              <a class="preview" :href="`/novelPreview/${scope.row.productId}`" target="previewFrame" @click="isPreview=true">预览</a>
              <el-button link type="primary" size="small" @click="createBlogPost(scope.row)">发blogger</el-button>
              <el-button link type="primary" size="small" @click="createTwitterPost(scope.row)">发twitter</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="preview" v-show="isPreview">
        <span class="close" @click="isPreview=false">X</span>
        <iframe id="previewFrame" name="previewFrame"></iframe>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      novels: [],
      isPreview: false,
    }
  },
  mounted(){
    this.getSheetRows();
  },
  methods: {
    async getSheetRows(refresh=false){
      let novelsInStorage = window.localStorage.getItem('novels');
      if (refresh === false && novelsInStorage) {
        this.novels = JSON.parse(novelsInStorage);
        console.log(this.novels)
      } else {
        let res = await axios({
          url: '/getNovelRows',
          method: 'post',
          data: {
            // filter: {postedToBlogger: '0', enTitle: 'NOT_EMPTY'}, 
            filter: {imgPrompt: 'NOT_EMPTY'},
            count: 50,
          }
        })
        this.novels = res.data.data;
        window.localStorage.setItem('novels', JSON.stringify(this.novels));
        console.log(this.novels)
      }
    },

    async createBlogPost(novel){
      let res = await axios({
        url: '/createNovelBlogPost',
        method: 'post',
        data: {
          product: novel
        }
      })
      novel.postedToBlogger = '1'
      novel.imgUrl = res.data.ret.url
    },

    // 生成预览图片
    async createImgUrl(product){
      let res = await axios({
        url: '/createNovelChapterImg',
        method: 'post',
        data: {
          product
        }
      })
      product.imgUrl = res.data.imgUrl
    },

    async createTwitterPost(product){
      const res = await axios({
        url: '/postNovelToTwitter',
        method: 'post',
        data: {
          product
        }
      })
    }

  }
}
</script>
<style scoped>
.novel {
}
.top{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.action{
  display: flex;
  align-items: center;
}
.action .preview, .action .json{ 
  font-size: 12px;
  margin-right: 10px;
}
.highlight-row{
  background-color: lightblue;
}
.body{
  display: flex;
}
.body .preview{
  position: relative;
}
.preview .close{
    cursor: pointer;
    color: #fff;
    background-color: #374956;
    position: absolute;
    left: 50%;
    top: -15px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 100%;
    text-align: center;
    font-size: 16px;
}
.body #previewFrame {
    width: 50vw;
    height: 2000px;
    padding: 5px;
    background-color: #fff;
    border: 1px solid #d5dce2;
}
.imgUrl{
  position: relative;
}
.imgUrl img{
  width: 50px;
  height: 50px;
}
.bigImg{
  width: 500px;
  height: 500px;
}
</style>