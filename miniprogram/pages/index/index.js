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
                      userInfo: res.result
                    });
                    wx.setStorage({
                      key: 'name',
                      data: updateRes.result.name
                    });
                    wx.setStorage({
                      key: 'avatarUrl',
                      data: updateRes.result.avatarUrl
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
