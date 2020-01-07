// miniprogram/pages/login/login.js
const app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onGetUserInfo: function(e) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res);
          app.globalData.openId = res.result.openId;
          if (!res.result.name) {
            wx.getUserInfo({
              success: infoRes => {
                console.log('object', infoRes);
                wx.cloud.callFunction({
                  name: 'updateUser',
                  data: {
                    name: infoRes.userInfo.nickName,
                    score: 0,
                    avatarUrl: infoRes.userInfo.avatarUrl
                  },
                  success: updateRes => {
                    wx.setStorage({
                      key: 'name',
                      data: updateRes.result.name
                    });
                    wx.setStorage({
                      key: 'avatarUrl',
                      data: updateRes.result.avatarUrl
                    });
                    wx.setStorage({
                      key: 'score',
                      data: '0'
                    });
                   wx.switchTab({
                     url: '/pages/home/home',
                     success: (result)=>{
                       
                     },
                     fail: ()=>{},
                     complete: ()=>{}
                   });
                  },
                  fail: err => {
                    console.error('[云函数] [login] 调用失败', err);
                  }
                });
              },
              fail(err) {
                console.log(err);
              }
            });
          } else {
            wx.setStorage({
              key: 'name',
              data: res.result.name
            });
            wx.setStorage({
              key: 'avatarUrl',
              data: res.result.avatarUrl
            });
            wx.setStorage({
              key: 'score',
              data: res.result.score
            });
            wx.switchTab({
              url: '/pages/home/home',
              success: (result)=>{
                
              },
              fail: ()=>{},
              complete: ()=>{}
            });
          }
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err);
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('name')) {
      wx.switchTab({
        url: '/pages/home/home',
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})