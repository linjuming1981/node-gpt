
class Tool{
  insertHtml(){
    let html = `
      <div class="shell_diy">
        <style>
          .toolbar-container{
            height: 2px !important;
            min-height: 2px !important;
          }
          .toolbar-container:hover{
            height: 42px !important;
            min-height: 42px !important;
          }
        </style>
      </div>
    `
    $(html).appendTo('body')
  }

  bindHotKey(){
    document.addEventListener('keyup', e => {
      if(e.keyCode === 113){ // F2
        $('.sidesheet-container').toggleClass('sidesheet-container_org')
      }
    })
  }
}

(() => {
  let tool = new Tool()
  tool.insertHtml()
})()