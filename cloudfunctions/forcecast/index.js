// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  var record = [];
  db.collection('forcecast')
    .where({
      date: _.eq(new Date(new Date().toLocaleDateString()).getTime())
    })
    .get({
      success: async res => {
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
            let url = `https://free-api.heweather.net/s6/weather/forecast?location=${element.location}&key=7f98aea2d6eb4bfda6cc1b801cafe492`;
            await rp(url)
              .then(function(re) {
                if (element.dnCode == '1') {
                  code = re.data.HeWeather6[0].daily_forecast[0].cond_code_d;
                } else if (element.dnCode == '2') {
                  code = re.data.HeWeather6[0].daily_forecast[0].cond_code_n;
                }

                location[element.location] = code;
              })
              .catch(function(err) {});
            // wx.request({
            //   url: `https://free-api.heweather.net/s6/weather/now?location=${element.location}&key=7f98aea2d6eb4bfda6cc1b801cafe492`,
            //   success: re => {
            //     code = re.data.HeWeather6[0].now.cond_code;
            //     location[element.location] = code;
            //   },
            //   fail: err => {}
            // });
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

          await db
            .collection('forcecast')
            .doc(element._id)
            .update({
              data: {
                status: result ? 1 : 2
              },
              success: a => {},
              fail: e => {}
            });
          if (result) {
            try {
              const [userRecord] = (
                await db
                  .collection('user')
                  .where({
                    openId: OPENID
                  })
                  .get()
              ).data;
              console.log('查到的用户信息', userRecord);
              if (!userRecord) {
                return {
                  code: 1,
                  message: '用户不存在'
                };
              } else {
                await db
                  .collection('user')
                  .doc(userRecord._id)
                  .update({
                    data: {
                      score: _.inc(parseInt(element.score))
                    }
                  });
                await db.collection('record').add({
                  data: {
                    openId: OPENID,
                    score: parseInt(element.score),
                    source: '全民预报',
                    createTime: new Date(
                      new Date().toLocaleDateString()
                    ).getTime()
                  }
                });
              }
            } catch (e) {
              console.log(e);
              return {
                code: 500,
                message: '服务器错误'
              };
            }
          }
        }
      },
      fail: err => {
        console.log('err', err);
      }
    });
};
