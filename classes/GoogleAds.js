const { GoogleAdsApi } = require('google-ads-api')
const GoogleAuthHelper = require('./GoogleAuthHelper.js')

class GoogleAds {
  constructor(){
    this.customer = null
  }

  getCustomer(){
    if(this.customer){
      return this.customer
    }
    const conf = GoogleAuthHelper.getOAuthConf()
    const {client_id, client_secret, redirect_uris} = conf
    
  }
}