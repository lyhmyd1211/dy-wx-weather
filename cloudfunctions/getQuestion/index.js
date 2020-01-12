// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  return new Promise((resovle, reject) => {
    db.collection('question')
      .aggregate()
      .sample({
        size: 10
      })
      .end()
      .then(res => {
        resovle(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
