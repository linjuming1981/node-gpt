
class Tool{
  insertHtml(){
    let html = `
      <div class="shell_diy">
        <style>
          standalone-header{
            height: 0px;
            min-height: 0px;
            padding-top: 5px;
            background-color: #007acc;
            overflow: hidden;
          }
          standalone-header:hover{
            height: 48px !important;
            min-height: 48px !important;
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