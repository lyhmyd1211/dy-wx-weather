//index.js
const app = getApp();

Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    loginVis: false,
    update: false
  },
  getyun() {
    const db = wx.cloud.database();
    const _ = db.command;
    var record = db
      .collection('forcecast')
      .where({
        date: _.eq(
          new Date(new Date().toLocaleDateString()).getTime() +
            2 * 24 * 60 * 60 * 1000
        )
      })
      .get({
        success: res => {
          function iswind(code) {
            if (
              code == '200' ||
              code == '201' ||
              code == '202' ||
              code == '203' ||
              code == '204' ||
              code == '205' ||
              code == '206' ||
              code == '207' ||
              code == '208' ||
              code == '209' ||
              code == '210' ||
              code == '211' ||
              code == '212' ||
              code == '213' ||
              code == '500' ||
              code == '501' ||
              code == '502' ||
              code == '503' ||
              code == '504' ||
              code == '507' ||
              code == '508' ||
              code == '509' ||
              code == '510' ||
              code == '511' ||
              code == '512' ||
              code == '513' ||
              code == '514' ||
              code == '515' ||
              code == '900' ||
              (code == '901') | (code == '999')
            ) {
              return true;
            }
            return false;
          }
          let location = {};
          for (let index = 0; index < res.data.length; index++) {
            let code = '';
            const element = res.data[index];
            if (location[element.location]) {
              code = location[element.location];
            } else {
              wx.request({
                url: `https://free-api.heweather.net/s6/weather/now?location=${element.location}&key=7f98aea2d6eb4bfda6cc1b801cafe492`,
                success: re => {
                  code = re.data.HeWeather6[0].now.cond_code;
                  location[element.location] = code;
                },
                fail: err => {}
              });
            }
            let result = false;
            if (iswind(code)) {
              result = true;
            } else if (element.type == '100') {
              if (code == '100' || code == '102' || code == '103') {
                result = true;
              }
            } else if (element.type == '101') {
              if (code == '101' || code == '103') {
                result = true;
              }
            } else if (element.type == '104') {
              if (code == '101' || code == '103') {
                result = true;
              }
            } else if (element.type == '399') {
              if (
                code == '399' ||
                code == '300' ||
                code == '301' ||
                code == '302' ||
                code == '303' ||
                code == '304' ||
                code == '305' ||
                code == '306' ||
                code == '307' ||
                code == '308' ||
                code == '309' ||
                code == '310' ||
                code == '311' ||
                code == '312' ||
                code == '313' ||
                code == '314' ||
                code == '315' ||
                code == '316' ||
                code == '317' ||
                code == '318'
              ) {
                result = true;
              }
            } else if (element.type == '404') {
              if (code == '404' || code == '405' || code == '406') {
                result = true;
              }
            } else if (element.type == '499') {
              if (
                code == '499' ||
                code == '400' ||
                code == '401' ||
                code == '402' ||
                code == '403' ||
                code == '407' ||
                code == '408' ||
                code == '409' ||
                code == '410'
              ) {
                result = true;
              }
            }

            db.collection('forcecast')
              .doc(element._id)
              .update({
                data: {
                  status: result ? 1 : 2
                },
                success: a => {
                  console.log('chengg', a, element._id, result);
                },
                fail: e => {
                  console.log('shibai', e);
                }
              });
          }
        },
        fail: err => {
          console.log('err', err);
        }
      });
  },
  cancelL() {
    this.setData({
      loginVis: false
    });
  },
  updateL() {
    wx.getUserInfo({
      success: infoRes => {
        wx.cloud.callFunction({
          name: 'updateUser',
          data: {
            name: infoRes.userInfo.nickName,
            avatarUrl: infoRes.userInfo.avatarUrl
          },
          success: updateRes => {
            this.setData({
              userInfo: updateRes.result,
              loginVis: false,
              update: false
            });
            wx.setStorage({
              key: 'name',
              data: updateRes.result.name
            });
            wx.setStorage({
              key: 'avatarUrl',
              data: updateRes.result.avatarUrl
            });
            wx.showToast({ icon: 'none', title: '登录信息更新成功' });
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
  },
  onLoad: function() {
    this.getyun();
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib'
      });
      return;
    }
    if (wx.getStorageSync('name')) {
      this.data.userInfo.name = wx.getStorageSync('name');
      this.setData({
        userInfo: this.data.userInfo
      });
    }
    if (wx.getStorageSync('avatarUrl')) {
      this.data.userInfo.avatarUrl = wx.getStorageSync('avatarUrl');
      this.setData({
        userInfo: this.data.userInfo
      });
    }
  },

  onGetUserInfo: function(e) {
    if (wx.getStorageSync('name')) {
      this.setData({
        loginVis: true
      });
    } else {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res);
          app.globalData.openId = res.result.openId;
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
                    this.setData({
                      userInfo: updateRes.result
                    });
                    wx.setStorage({
                      key: 'name',
                      data: updateRes.result.name
                    });
                    wx.setStorage({
                      key: 'avatarUrl',
                      data: updateRes.result.avatarUrl
                    });
                    wx.setStorage({
                      key: 'score',
                      data: '0'
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
            this.setData({
              userInfo: res.result
            });
            wx.setStorage({
              key: 'name',
              data: res.result.name
            });
            wx.setStorage({
              key: 'avatarUrl',
              data: res.result.avatarUrl
            });
            wx.setStorage({
              key: 'score',
              data: res.result.score
            });
          }
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err);
        }
      });
    }
  },

  // onGetOpenid: function() {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid);
  //       app.globalData.openid = res.result.openid;
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole'
  //       });
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err);
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions'
  //       });
  //     }
  //   });
  // },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中'
        });

        const filePath = res.tempFilePaths[0];

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res);

            app.globalData.fileID = res.fileID;
            app.globalData.cloudPath = cloudPath;
            app.globalData.imagePath = filePath;

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            });
          },
          fail: e => {
            console.error('[上传文件] 失败：', e);
            wx.showToast({
              icon: 'none',
              title: '上传失败'
            });
          },
          complete: () => {
            wx.hideLoading();
          }
        });
      },
      fail: e => {
        console.error(e);
      }
    });
  }
});
