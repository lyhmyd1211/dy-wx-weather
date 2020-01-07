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
        data: [0.2, 0.2],
        color: ['#b243d4', '#b243d4'],
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#eee',
            shadowBlur: 20,
            shadowColor: 'rgba(255, 0, 0, 1)'
          }
        },
        label: {
          position: ['50%', '50%'],
          formatter: () => {
            return '积分数';
          },
          fontSize: 24,
          color: '#000'
        },
        itemStyle: {
          opacity: 0.6
        },
        backgroundStyle: {
          borderWidth: 0,
          borderColor: 'rgba(255,255,255,0)',
          color: 'rgba(255,255,255,0)'
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
    score: '0',
    ec: {
      onInit: initChart // 3、将数据放入到里面
    }
  },
  queryScore(call) {
    const db = wx.cloud.database();
    // 查询当前用户所有的 user
    console.log('app.globalData.openId', app.globalData.openId);
    db.collection('user')
      .where({
        openId: app.globalData.openId
      })
      .get({
        success: res => {
          console.log('[数据库] [score] 成功: ', res);
          this.setData(
            {
              score: res.data[0].score
            },
            () => {
              call();
            }
          );
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询分数失败，检查网络配置'
          });
          console.error('[数据库] [查询记录] 失败：', err);
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
  onLoad() {},
  onReady() {
    this.queryScore(() => {
      chart.setOption({
        series: [
          {
            radius: '80%',
            type: 'liquidFill',
            data: [0.2, 0.2],
            color: ['#b243d4', '#b243d4'],
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 2,
                borderColor: '#eee',
                shadowBlur: 20,
                shadowColor: 'rgba(255, 0, 0, 1)'
              }
            },
            label: {
              position: ['50%', '50%'],
              formatter: () => {
                return '积分数\n' + this.data.score;
              },
              fontSize: 24,
              color: '#000'
            },
            itemStyle: {
              opacity: 0.6
            },
            backgroundStyle: {
              borderWidth: 0,
              borderColor: 'rgba(255,255,255,0)',
              color: 'rgba(255,255,255,0)'
            },
            emphasis: {
              show: false
            }
          }
        ]
      });
    });
  }
});
