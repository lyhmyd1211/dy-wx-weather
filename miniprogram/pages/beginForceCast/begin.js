// miniprogram/pages/beginForceCast/begin.js
const bmap = require('../../utils/libs/bmap-wx.min.js');
const app = getApp();
import { getCurrentDate, formatTime } from '../../utils/util';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    area: '',
    status: '晴',
    statusCode: '100',
    visible: false,
    selectTime: getCurrentDate() + 24 * 60 * 60 * 1000,
    displayValue: formatTime(
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      'cn'
    ),
    curDate: getCurrentDate(),
    statusOptions: [
      {
        index: 'A.',
        label: '晴',
        value: '100',
        des: ''
      },
      {
        index: 'B.',
        label: '多云',
        value: '101',
        des: ''
      },
      {
        index: 'C.',
        label: '阴',
        value: '104',
        des: ''
      },
      {
        index: 'D.',
        label: '雨',
        value: '399',
        des: ''
      },
      {
        index: 'E.',
        label: '雨夹雪',
        value: '100',
        des: ''
      },
      {
        index: 'F.',
        label: '雪',
        value: '100',
        des: ''
      }
    ]
  },

  onOpen() {
    this.setData({ visible: true });
  },
  onClose() {
    this.setData({ visible: false });
  },
  onConfirm(e) {
    this.setData({
      selectTime: e.detail.date,
      displayValue: e.detail.displayValue.join('')
    });
  },
  onConfirm1(e) {
    this.setData({
      status: e.detail.label,
      statusCode: e.detail.value[0]
    });
  },
  _getlocation() {
    let that = this;
    // 新建百度地图对象
    let BMap = new bmap.BMapWX({
      ak: 'evPSi8T3yPlRpuZHwD8G2ST0OAa3jVek'
    });
    let fail = function(data) {
      console.log(data);
    };
    let success = function(data) {
      console.log('bbb', data);
      that.setData({
        area:
          data.originalData.result.addressComponent.city +
          '·' +
          data.originalData.result.addressComponent.district,
        location:
          data.originalData.result.location.lng +
          ',' +
          data.originalData.result.location.lat
      });
    };
    // 发起regeocoding检索请求
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getlocation();
  },

  onSubmit() {
    const db = wx.cloud.database();
    db.collection('forcecast').add({
      data: {
        location: this.data.location,
        area: this.data.area,
        statusLabel: this.data.status,
        date: this.data.selectTime,
        type: this.data.statusCode,
        openId: app.globalData.openId,
        createDate: getCurrentDate(),
        status: 0
      },
      success: res => {
        console.log('[数据库] [新增] 成功: ', res);
        wx.showToast({
          icon: 'none',
          title: '提交成功'
        });
        wx.navigateTo({
          url: '../history/history'
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '提交失败，请检查网络'
        });
        console.error('[数据库] [查询记录] 失败：', err);
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
