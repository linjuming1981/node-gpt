const fs = require('fs')

class Novel {
  constructor(){}

  splitBookToChapters(file){
    let cont = fs.readFileSync(file).toString()
  }
}