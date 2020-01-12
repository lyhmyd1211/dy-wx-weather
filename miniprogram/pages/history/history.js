// miniprogram/pages/history/history.js
const app = getApp();
const db = wx.cloud.database();
import { getCurrentDate, formatTime } from '../../utils/util';
import { $wuxDialog } from '../../lib/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    queryResult: [],
    date: '',
    distance: '',
    right: [
      {
        text: '删除',
        style: 'background-color: #e64340; color: white'
      }
    ],
    left: [
      {
        text: '更改',
        style: 'background-color: #108ee9; color: white'
      }
    ]
  },

  onClick(e) {
    console.log(e.detail);
    let that = this;
    if (e.detail.type == 'right') {
      $wuxDialog('#wux-dialog-del').confirm({
        resetOnClose: true,
        closable: true,
        title: '删除提示',
        content: '删除后将不会获得积分奖励，确定要删除此条预报？',
        onConfirm(r) {
          db.collection('forcecast')
            .doc(e.detail.data._id)
            .remove()
            .then(res => {
              wx.showToast({
                icon: 'none',
                title: '删除成功'
              });
              that.gethistory();
            });
        },
        onCancel(e) {}
      });
    } else if (e.detail.type == 'left') {
      if (e.detail.data.updateCount == 3) {
        $wuxDialog('#wux-dialog-del').alert({
          resetOnClose: true,
          title: '提示',
          content: '已到达修改上限！每条预报信息最多修改三次'
        });
      } else if (e.detail.data.status == 0) {
        $wuxDialog('#wux-dialog-del').confirm({
          resetOnClose: true,
          closable: true,
          title: '更改提示',
          content: '每条预报信息最多修改三次，确定去修改？',
          onConfirm(r) {
            wx.navigateTo({
              url: `../beginForceCast/begin?itemData=${JSON.stringify(
                e.detail.data
              )}`
            });
          },
          onCancel(e) {}
        });
      }
    }
  },
  gethistory() {
    db.collection('forcecast')
      .where({
        openId: wx.getStorageSync('openId') || app.globalData.openId
      })
      .orderBy('date', 'desc')
      .get({
        success: res => {
          let re = res.data.map(item => {
            item.dateLabel = formatTime(new Date(item.date), 'cn');
            if (item.status == 0) {
              item.distance =
                (item.date - getCurrentDate()) / 24 / 60 / 60 / 1000;
            }
          });
          this.setData({
            queryResult: res.data
          });
          console.log('[数据库] [查询记录] 成功: ', res);
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.gethistory();
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
