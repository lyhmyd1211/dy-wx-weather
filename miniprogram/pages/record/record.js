// miniprogram/pages/record/record.js
const app = getApp();
import { formatTime } from '../../utils/util';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  getList() {
    const openId = wx.getStorageSync('openId') || app.globalData.openId;
    const db = wx.cloud.database();
    db.collection('record')
      .where({
        openId: openId
      })
      .orderBy('createTime', 'desc')
      .get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res);
          res.data.forEach(element => {
            this.data.list.push({
              content:
                formatTime(new Date(element.createTime)) +
                '通过' +
                element.source +
                '获取积分：' +
                element.score +
                '分'
            });
          });
          this.setData(
            {
              list: this.data.list
            },
            () => {
              console.log('asdasdqqqqqqqq', this.data.list);
            }
          );
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败,请检查网络'
          });
          console.error('[数据库] [查询记录] 失败：', err);
        }
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();
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
