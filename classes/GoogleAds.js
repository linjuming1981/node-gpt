// https://ads.google.com/aw/apicenter?ocid=6566300093&ascid=6566300093&uscid=6566300093&__c=5583143957&euid=1003573194&__u=5885811706&cmpnInfo=%7B%228%22%3A%22a6ec43f1-e695-4620-a5f3-5cd4ae736ae1%22%7D
// 开发者令牌 xVdIHYEyuBur3x4KlrcYjA
// 创建 mcc账号 https://www.youtube.com/watch?v=60w_pGGVk98

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
    const {client_id, client_secret, tokens } = conf
    
    const client = new GoogleAdsApi({
      client_id,
      client_secret,
      developer_token: 'xVdIHYEyuBur3x4KlrcYjA',
    })

    const customer = client.Customer({
      customer_id: '584-184-7482',
      refresh_token: tokens.refresh_token, 
    })

    this.customer = customer
    return customer
  }

  async queryKeywords(keyword){
    const query = `
      SELECT
        keyword_plan_forecast_monthly_impressions,
        keyword_plan_forecast_monthly_clicks,
        keyword_plan_forecast_average_cpc,
        keyword_idea_text
      FROM
        keyword_plan_idea
      WHERE
        keyword_idea_text = '${keyword}'
    `

    const customer = this.getCustomer()
    const response = await customer.query(query)
    console.log('keywords', response)
    return response
  }
}

module.exports = GoogleAds;


// -------------- 调试  
if(module === require.main){
  (async () => {
    console.log(11)
    const googleAds = new GoogleAds()
    googleAds.queryKeywords('green tea')
  })()
}