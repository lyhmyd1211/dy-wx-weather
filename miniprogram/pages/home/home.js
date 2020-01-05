import * as echarts from '../../ec-canvas/echarts';
import '../../ec-canvas/echarts-liquidfill.min';
let chart = null;

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
    list: [
      {
        name: 'wuhen',
        score: '300',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'moyi',
        score: '200',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'wuhen',
        score: '300',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'moyi',
        score: '200',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'wuhen',
        score: '300',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'moyi',
        score: '200',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'wuhen',
        score: '300',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'moyi',
        score: '200',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'wuhen',
        score: '300',
        avatar: '../../images/user-unlogin.png'
      },
      {
        name: 'moyi',
        score: '200',
        avatar: '../../images/user-unlogin.png'
      }
    ],
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
  onReady() {
    setTimeout(function() {
      // 获取 chart 实例的方式
      console.log(chart);
    }, 2000);

    // this.login();
  }
});
