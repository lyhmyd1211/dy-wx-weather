const formatTime = (date, type) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  if (type == 'cn') {
    return (
      [year, month, day].map(formatNumber)[0] +
      '年' +
      [year, month, day].map(formatNumber)[1] +
      '月' +
      [year, month, day].map(formatNumber)[2] +
      '日'
    );
  } else {
    return (
      [year, month, day].map(formatNumber)[0] +
      '年' +
      [year, month, day].map(formatNumber)[1] +
      '月' +
      [year, month, day].map(formatNumber)[2] +
      '日' +
      ' ' +
      [hour, minute].map(formatNumber).join(':')
    );
  }
};

const getCurrentDate = () => {
  return new Date(new Date().toLocaleDateString()).getTime();
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

module.exports = {
  formatTime: formatTime,
  getCurrentDate
};
