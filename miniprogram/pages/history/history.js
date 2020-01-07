// miniprogram/pages/history/history.js
const app = getApp();
import { getCurrentDate, formatTime } from '../../utils/util';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    queryResult: [],
    date: '',
    distance: ''
  },

  gethistory() {
    const db = wx.cloud.database();
    db.collection('forcecast')
      .where({
        openId: app.globalData.openid
      })
      .orderBy('date', 'desc')
      .get({
        success: res => {
          let re = res.data.map(item => {
            item.dateLabel = formatTime(new Date(item.date), 'cn');
            if (item.status == 0) {
              item.distance =
                (item.date - getCurrentDate()) / 24 / 60 / 60 / 1000;
            }
          });
          this.setData({
            queryResult: res.data
          });
          console.log('[数据库] [查询记录] 成功: ', res);
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
  onLoad: function(options) {
    this.gethistory();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
