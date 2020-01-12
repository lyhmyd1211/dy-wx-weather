// miniprogram/pages/qa/qa.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timeOver: false,
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
    bTimer: '',
    time: 20,
    percent: 10,
    aTitle: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    list: [],
    isTer: false,
    islimit: true
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

  async setScore(score, callback) {
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
    console.log('userRecord', userRecord);
    if (userRecord.todayScore >= 200) {
      this.setData({
        islimit: true
      });
      wx.showToast({
        icon: 'none',
        title: `积分已达上限`
      });
    } else {
      await db
        .collection('user')
        .doc(userRecord._id)
        .update({
          data: {
            score: _.inc(parseInt(score)),
            todayScore: _.inc(parseInt(score))
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
    }
  },

  next() {
    clearInterval(this.data.timer);
    clearInterval(this.data.aTimer);
    this.data.timer = setInterval(() => {
      this.setData({
        timeOver: this.data.time <= 2
      });
      if (this.data.time == 1 || this.data.isChoose) {
        clearInterval(this.data.timer);
        clearTimeout(this.data.bTimer);
        this.data.aTimer = setTimeout(() => {
          if (this.data.current !== this.data.list.length - 1) {
            this.setData(
              {
                timeOver: false,
                isTer: false,
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
                isTer: false,
                finish: true,
                unLogin: false
              },
              () => {
                if (this.data.score != 0 && this.data.isLogin) {
                  this.setScore(this.data.score);
                }
              }
            );
          }
        }, 500);
      } else {
        this.setData(
          {
            isTer: this.data.time <= 4,
            isnext: false,
            time: this.data.time - 1,
            percent: this.data.percent + 5
          },
          () => {
            clearTimeout(this.data.bTimer);
            this.data.bTimer = setTimeout(() => {
              this.setData({
                isTer: false
              });
            }, 300);
          }
        );
      }
    }, 1000);
  },

  login() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res);
        app.globalData.openId = res.result.openId;
        wx.setStorage({
          key: 'openId',
          data: res.result.openId
        });
        if (!res.result.name) {
          wx.getUserInfo({
            success: infoRes => {
              console.log('object', infoRes);
              wx.cloud.callFunction({
                name: 'updateUser',
                data: {
                  name: infoRes.userInfo.nickName,
                  score: 0,
                  avatarUrl: infoRes.userInfo.avatarUrl
                },
                success: updateRes => {
                  wx.setStorage({
                    key: 'name',
                    data: updateRes.result.name
                  });
                  wx.setStorage({
                    key: 'avatarUrl',
                    data: updateRes.result.avatarUrl
                  });
                  this.setScore(this.data.score, () => {
                    wx.switchTab({
                      url: '/pages/qaHome/qaHome',
                      success: result => {},
                      fail: () => {},
                      complete: () => {}
                    });
                  });
                },
                fail: err => {
                  console.error('[云函数] [login] 调用失败', err);
                }
              });
            },
            fail(err) {
              console.log(err);
            }
          });
        } else {
          wx.setStorage({
            key: 'name',
            data: res.result.name
          });
          wx.setStorage({
            key: 'avatarUrl',
            data: res.result.avatarUrl
          });
          this.setScore(this.data.score, () => {
            wx.switchTab({
              url: '/pages/qaHome/qaHome',
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          });
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud
      .callFunction({
        name: 'getQuestion'
      })
      .then(res => {
        console.log('object', res);
        this.setData(
          {
            list: res.result.list
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
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isLogin: !!wx.getStorageSync('openId')
    });
  },

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
