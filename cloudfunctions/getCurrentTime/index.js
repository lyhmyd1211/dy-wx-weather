// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const currentTime = new Date();
  const cnCurTime =
    new Date(new Date().toLocaleDateString()).getTime() - 8 * 60 * 60 * 1000;
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    currentTime,
    cnCurTime
  };
};
