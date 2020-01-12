// 云函数入口文件
const cloud = require('wx-server-sdk');
const rp = require('request-promise');
cloud.init();
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  var record = [];
  return new Promise((pres, prej) => {
   await db.collection('forcecast')
      .where({
        date:
          new Date(new Date().toLocaleDateString()).getTime() -
          8 * 60 * 60 * 1000,
        status: 0
      })
      .get()
      .then(async res => {
        let location = {};
        let p = res.data.map(item => {
          let url = `https://free-api.heweather.net/s6/weather/forecast?location=${item.location}&key=7f98aea2d6eb4bfda6cc1b801cafe492`;
          return new Promise((resolve, reject) => {
            rp(url)
              .then( async re => {
                let datas = JSON.parse(re);
                if (item.dnCode == '1') {
                  code = datas.HeWeather6[0].daily_forecast[0].cond_code_d;
                } else if (item.dnCode == '2') {
                  code = datas.HeWeather6[0].daily_forecast[0].cond_code_n;
                }

                location[item.location] = code;
                let result = false;
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
                if (iswind(code)) {
                  result = true;
                } else if (item.type == '100') {
                  if (code == '100' || code == '102' || code == '103') {
                    result = true;
                  }
                } else if (item.type == '101') {
                  if (code == '101' || code == '103') {
                    result = true;
                  }
                } else if (item.type == '104') {
                  if (code == '104') {
                    result = true;
                  }
                } else if (item.type == '399') {
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
                } else if (item.type == '404') {
                  if (code == '404' || code == '405' || code == '406') {
                    result = true;
                  }
                } else if (item.type == '499') {
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
                  db.collection('forcecast').doc(item._id).update({
                    data: {
                      status: result ? 1 : 2
                    },
                    success: a => {
                    },
                    fail: e => {
                    }
                  });
              
                if (result) {
                  db.collection('user')
                    .where({
                      openId: item.openId
                    })
                    .update({
                      data: {
                        score: _.inc(parseInt(item.score))
                      }
                    });
                  db.collection('record').add({
                    data: {
                      _openid: item.openId,
                      openId: item.openId,
                      score: parseInt(item.score),
                      source: '全民预报',
                      createTime: new Date().getTime() - 8 * 60 * 60 * 1000
                    }
                  });
                }
                resolve({ id: item._id, result, });
              })
              .catch(function(err) {
                reject(err);
              });
          });
        });
        Promise.all(p)
          .then(res => {
            pres(res);
          })
          .catch(err => {
            prej(err);
          });
      });
  });
};
