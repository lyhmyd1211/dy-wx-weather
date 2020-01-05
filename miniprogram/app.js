//app.js

App({
  onLaunch: function() {
    this.globalData = {
      StatusBar: '',
      Custom: '',
      CustomBar: ''
    };
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true
      });
    }
    if (!wx.getStorageSync('name')) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res);
          this.globalData.openid = res.result.openid;
          if (!res.result.name) {
            wx.getSetting({
              success: seRes => {
                if (seRes.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: infoRes => {
                      console.log('object', infoRes);
                      wx.cloud.callFunction({
                        name: 'updateUser',
                        data: {
                          name: infoRes.userInfo.nickName,
                          gender: infoRes.userInfo.gender,
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
                        },
                        fail: err => {
                          console.error('[云函数] [login] 调用失败', err);
                        }
                      });
                    }
                  });
                }
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
          }
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err);
        }
      });
    }

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar =
          custom.bottom + custom.top - e.statusBarHeight;
      }
    });
  }
});
