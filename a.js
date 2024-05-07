const { GoogleAdsApi } = require('google-ads-api')

// 替换以下信息为你的配置
const client = new GoogleAdsApi({
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    developer_token: 'YOUR_DEVELOPER_TOKEN',
})

const customerId = 'YOUR_CUSTOMER_ID' // Google Ads客户ID

// 错误处理略过，具体请参考API文档
const main = async () => {
    const customer = client.Customer({
        customer_id: customerId,
        refresh_token: 'YOUR_REFRESH_TOKEN', 
    })

    const query = `
        SELECT
            keyword_plan_forecast_monthly_impressions,
            keyword_plan_forecast_monthly_clicks,
            keyword_plan_forecast_average_cpc,
            keyword_idea_text
        FROM
            keyword_plan_idea
        WHERE
            keyword_idea_text = 'example keyword'
    `

    const response = await customer.query(query)
    console.log(response)
}

main()