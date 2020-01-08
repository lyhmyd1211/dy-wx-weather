// miniprogram/pages/qaHome/qaHome.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    score: 0,
    avatarUrl: '../../images/user-unlogin.png'
  },
  start() {
    wx.navigateTo({
      url: '../qa/qa'
    });
  },
  showguize() {
    this.setData({
      visible: true
    });
  },
  onClose() {
    this.setData({
      visible: false
    });
  },
  getdata() {
    const db = wx.cloud.database();
    db.collection('user')
      .where({
        openId: wx.getStorageSync('openId')
      })
      .get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res);
          this.setData({
            info: res.data[0]
          });
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          });
          console.error('[数据库] [查询记录] 失败：', err);
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.getdata();
    this.setData({
      userInfo: {
        name: wx.getStorageSync('name') || '',
        avatarUrl: wx.getStorageSync('avatarUrl') || ''
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const db = wx.cloud.database();
    db.collection('user')
      .where({
        openId: wx.getStorageSync('openId') || -1
      })
      .get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res);
          if (res.data.length == 0) {
            wx.showToast({
              icon: 'none',
              title: '当前未登录'
            });
            wx.navigateTo({
              url: '../login/login'
            });
            wx.clearStorage();
          }
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '当前未登录'
          });
          wx.navigateTo({
            url: '../login/login'
          });
          wx.clearStorage();
          console.error('[数据库] [查询记录] 失败：', err);
        }
      });
    this.getdata();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
