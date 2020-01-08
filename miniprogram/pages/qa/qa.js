// miniprogram/pages/qa/qa.js
const app = getApp();
import ti from './ti';
import { getRandom } from '../../utils/util';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginVis: false,
    unLogin: true,
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
    list: []
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
          url: '../qaHome/qaHome'
        });
      }
    );
  },

  setScore: async (score, callback) => {
    const db = wx.cloud.database();
    const _ = db.command;
    const [userRecord] = (
      await db
        .collection('user')
        .where({
          openId: wx.getStorageSync('openId') || app.globalData.openId
        })
        .get()
    ).data;

    await db
      .collection('user')
      .doc(userRecord._id)
      .update({
        data: {
          score: _.inc(parseInt(score))
        },
        success: res => {
          console.log('[数据库] [更新记录] 成功：', res);
          wx.showToast({
            icon: 'none',
            title: `挣了${score}积分，真开心!`
          });
        },
        fail: err => {
          console.error('[数据库] [更新记录] 失败：', err);
        }
      });
    await db.collection('record').add({
      data: {
        openId: wx.getStorageSync('openId') || app.globalData.openId,
        score: parseInt(score),
        source: '知识问答',
        createTime: new Date().getTime()
      },
      success: res => {
        console.log('[数据库] [新增] 成功：', res);
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err);
      }
    });
    if (callback) {
      await callback();
    }
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
            clearInterval(this.data.timer);
            clearTimeout(this.data.aTimer);
            this.setData(
              {
                finish: true,
                unLogin: false
              },
              () => {
                if (this.data.score != 0) {
                  this.setScore(this.data.score);
                }
              }
            );
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
    let tmp = [];
    for (let index = 0; index < 10; index++) {
      tmp.push(ti[getRandom(0, ti.length - 1)]);
    }
    this.setData(
      {
        list: tmp
      },
      () => {
        this.setData(
          {
            curData: this.data.list[this.data.current]
          },
          () => {
            this.next();
          }
        );
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
  onShow: () => {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: () => {
    // clearInterval(this.data.timer);
    // clearTimeout(this.data.aTimer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: () => {
    // clearInterval(this.data.timer);
    // clearTimeout(this.data.aTimer);
  },

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
