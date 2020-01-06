import * as echarts from '../../ec-canvas/echarts';
import '../../ec-canvas/echarts-liquidfill.min';
let chart = null;
const app = getApp();
// 2、进行初始化数据
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    series: [
      {
        radius: '80%',
        type: 'liquidFill',
        data: [0.2],
        outline: {
          show: false
        },
        label: {
          position: ['50%', '50%'],
          formatter: function() {
            return '60';
          },
          fontSize: 24,
          color: '#D94854'
        },
        itemStyle: {
          opacity: 0.6
        },
        emphasis: {
          show: false
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function(res) {
    return {
      title: 'ECharts',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    };
  },
  data: {
    defaultAva: '../../images/user-unlogin.png',
    list: [],
    ec: {
      onInit: initChart // 3、将数据放入到里面
    }
  },

  login() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res);
        app.globalData.openid = res.result.openid;
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err);
      }
    });
  },

  queryRank: function() {
    const db = wx.cloud.database();
    // 查询当前用户所有的 user
    db.collection('user')
      .orderBy('score', 'desc')
      .get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res);
          this.setData({
            list: res.data
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
  onShow: function(options) {
    this.queryRank();
  },
  onReady() {
    setTimeout(function() {
      // 获取 chart 实例的方式
    }, 2000);

    // this.login();
  }
});
