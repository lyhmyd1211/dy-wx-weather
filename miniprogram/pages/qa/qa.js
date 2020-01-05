// miniprogram/pages/qa/qa.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    finish: false,
    isnext: false,
    isChoose: false,
    current: 0,
    curData: {},
    curChoose: -1,
    score: 0,
    timer: '',
    time: 20,
    percent: 10,
    aTitle: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    list: [
      {
        q:
          '到2020年，建立较为完善的人工影响天气工作体系，基础研究和应用技术研发取得重要成果，基础保障能力显著提升，协调指挥和安全监管水平得到增强，人工增雨（雪）作业年增加降水( B )以上，人工防雹保护面积由目前的47万平方公里增加到54万平方公里以上，服务经济社会发展的效益明显提高。',
        qId: '1',
        correct: '2',
        a: [
          {
            aId: '1',
            atext:
              '我猜选A我猜选A我猜选A我猜选A我猜选A我猜选A我猜选A我猜选A我猜选A我猜选A我猜选A我猜选A我猜选A'
          },
          {
            aId: '2',
            atext:
              '我猜选B我猜选B我猜选B我猜选B我猜选B我猜选B我猜选B我猜选B我猜选B我猜选B我猜选B'
          },
          { aId: '3', atext: '我猜选C我猜选C我猜选C我猜选C我猜选D我猜选D' },
          {
            aId: '4',
            atext: '我猜选D我猜选D我猜选D我猜选D我猜选D我猜选D我猜选D'
          }
        ]
      },
      {
        q: 'aaaaaaaaaaaaaaaaaaaa',
        qId: '1',
        correct: '2',
        a: [
          {
            aId: '1',
            atext:
              '这次选A这次选A这次选A这次选A这次选A这次选A这次选A这次选A这次选A'
          },
          {
            aId: '2',
            atext:
              '这次选B这次选B这次选B这次选B这次选B这次选B这次选B这次选B这次选B'
          },
          {
            aId: '3',
            atext:
              '这次选C这次选C这次选C这次选C这次选C这次选C这次选C这次选C这次选C'
          },
          {
            aId: '4',
            atext:
              '这次选D这次选D这次选D这次选D这次选D这次选D这次选D这次选D这次选D'
          }
        ]
      }
    ]
  },
  choose(e) {
    if (!this.data.isChoose) {
      this.setData(
        {
          isChoose: true,
          curChoose: e.currentTarget.dataset.id,
          score:
            e.currentTarget.dataset.id === this.data.curData.correct
              ? this.data.score + 10
              : this.data.score
        },
        () => {
          this.next();
        }
      );
    }
  },
  back() {
    this.setData(
      {
        finish: false
      },
      () => {
        wx.switchTab({
          url: '../game/game'
        });
      }
    );
  },

  next() {
    clearInterval(this.data.timer);
    clearTimeout(this.data.aTimer);

    this.data.timer = setInterval(() => {
      if (this.data.time == 1 || this.data.isChoose) {
        clearInterval(this.data.timer);
        this.data.aTimer = setTimeout(() => {
          if (this.data.current !== this.data.list.length - 1) {
            this.setData(
              {
                curData: this.data.list[this.data.current + 1],
                current: this.data.current + 1,
                isChoose: false,
                time: 20,
                percent: 10,
                isnext: true
              },
              () => {
                this.next();
              }
            );
          } else {
            console.log('zong', this.data.score);
            this.setData({
              finish: true
            });
          }
        }, 500);
      } else {
        this.setData({
          isnext: false,
          time: this.data.time - 1,
          percent: this.data.percent + 5
        });
      }

      console.log('sss', this.data.percent, this.data.isnext);
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(
      {
        curData: this.data.list[this.data.current]
      },
      () => {
        this.next();
      }
    );
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
