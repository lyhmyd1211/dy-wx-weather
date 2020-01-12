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
  myForcecast() {
    wx.navigateTo({
      url: '../history/history'
    });
  },
  myRecord() {
    wx.navigateTo({
      url: '../record/record'
    });
  },
  cancelL() {
    this.setData({
      loginVis: false
    });
  },
  test() {},
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
  onLoad: function() {},

  login() {
    wx.navigateTo({
      url: '../login/login'
    });
  },
  onShow() {
    this.setData({
      userInfo: {
        name: wx.getStorageSync('name'),
        avatarUrl: wx.getStorageSync('avatarUrl')
      }
    });
    // const db = wx.cloud.database();
    // db.collection('user')
    //   .where({
    //     openId: wx.getStorageSync('openId') || -1
    //   })
    //   .get({
    //     success: res => {
    //       console.log('[数据库] [查询记录] 成功: ', res);
    //       if (res.data.length == 0) {
    //         wx.showToast({
    //           icon: 'none',
    //           title: '当前未登录'
    //         });
    //         wx.navigateTo({
    //           url: '../login/login'
    //         });
    //         wx.clearStorage();
    //       }
    //     },
    //     fail: err => {
    //       wx.showToast({
    //         icon: 'none',
    //         title: '当前未登录'
    //       });
    //       wx.navigateTo({
    //         url: '../login/login'
    //       });
    //       wx.clearStorage();
    //       console.error('[数据库] [查询记录] 失败：', err);
    //     }
    //   });
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
