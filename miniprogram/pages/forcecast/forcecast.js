// miniprogram/pages/forcecast/forcecast.js
const bmap = require('../../utils/libs/bmap-wx.min.js');
import { formatTime } from '../../utils/util';
Page({
  /**
   * 页面的初始数据
   */
  data: {},
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
      that.setData(
        {
          location1: data.originalData.result.addressComponent.city,
          location2: data.originalData.result.addressComponent.district,
          location:
            data.originalData.result.location.lng +
            ',' +
            data.originalData.result.location.lat
        },
        () => {
          that.getWeatherData();
        }
      );
    };
    // 发起regeocoding检索请求
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },
  _getWeather() {
    let that = this;
    // 新建百度地图对象
    let BMap = new bmap.BMapWX({
      ak: 'evPSi8T3yPlRpuZHwD8G2ST0OAa3jVek'
    });
    let fail = function(data) {
      console.log(data);
    };
    let success = function(data) {
      console.log('asss', data);
      var pic = data.originalData.results[0].weather_data[0].dayPictureUrl;
      var weatherData = data.currentWeather[0];
      weatherData.curD = weatherData.date.split('(实时：')[0];
      weatherData.curT = weatherData.date
        .split('(实时：')[1]
        .replace(')', '')
        .replace('℃', '');
      that.setData({
        weatherData,
        pic
      });
    };
    // 发起regeocoding检索请求
    BMap.weather({
      fail: fail,
      success: success
    });
  },
  _getCurrentTime() {
    wx.cloud.callFunction({
      name: 'getCurrentTime',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.currentTime);
        this.setData({
          currentTime: formatTime(new Date(res.result.currentTime))
        });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err);
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions'
        });
      }
    });
  },

  getWeatherData() {
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now',
      data: {
        location: this.data.location,
        key: '7f98aea2d6eb4bfda6cc1b801cafe492'
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {},
      complete: function(res) {}
    });
  },

  begin() {
    wx.navigateTo({
      url: '../beginForceCast/begin'
    });
  },

  history() {
    wx.navigateTo({
      url: '../history/history'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getCurrentTime();
    this._getlocation();
    this._getWeather();
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
