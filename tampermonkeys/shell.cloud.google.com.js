
class Tool{
  insertHtml(){
    let html = `
      <div class="shell_diy">
        <style>
          standalone-header{
            background-color: #303030;
            position: absolute;
            left: 0;
            z-index: 2;
            top: 416px;
            padding-left: 5px;
            height: 48px;
          }
          standalone-header .toolbar-container{
            display: none!important;
          }
          standalone-header:hover .toolbar-container{
            display: flex!important;
          }
          cloudshell-editor-controls{
            display: none;
          }
          standalone-header .gmat-headline-6{
            display: none;
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