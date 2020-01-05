import * as echarts from '../../ec-canvas/echarts';
import   '../../ec-canvas/echarts-liquidfill.min'
let chart = null;

// 2、进行初始化数据
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    series: [{
      type: 'liquidFill',
      data: [0.6]
  }]
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
    ec: {
      onInit: initChart // 3、将数据放入到里面
    }
  },

  onReady() {
    setTimeout(function() {
      // 获取 chart 实例的方式
      console.log(chart);
    }, 2000);
  }
});
