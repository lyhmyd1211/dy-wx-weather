// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var record = db.collection('forcecast').where({
    targetDate: _.eq(new Date(new Date().getFullYear() - 1900,new Date().getMonth(),new Date().getDate()).getTime())
    
  }).get().data
  let url = 'https://free-api.heweather.net/s6/weather/daily_forecast?location=&key=7f98aea2d6eb4bfda6cc1b801cafe492';
  await rp(url)
    .then(function (res) {
    })
    .catch(function (err) {
    });

  
}