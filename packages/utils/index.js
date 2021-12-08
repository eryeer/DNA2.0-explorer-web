import Big from "big.js";

export const erasure = (params) => {
  const ret = {};
  for (let key of Object.keys(params)) {
    const val = params[key];
    if (Array.isArray(val)) {
      if (val.length !== 0) {
        ret[key] = val;
      }
    } else {
      if (typeof val === "string") {
        if (val.trim() !== "") {
          ret[key] = val.trim();
        }
      } else {
        if (val !== null) {
          ret[key] = val;
        }
      }
    }
  }
  return ret;
};

export const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const filterDate = (val, fmt = "yyyy-MM-dd hh:mm:ss") => {
  if (!val) return "";
  if (val < 1e11) {
    val *= 1e3;
  }
  const date = new Date(val);
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

export const filterCount = (val, minimumFractionDigits = 0) => {
  if (val == void 0) return "";

  return new Big(val)
    .toNumber()
    .toLocaleString("en-US", { minimumFractionDigits });
};

export const filterPercentage = (val, suffix = "%") => {
  if (!val) return "-";
  val = Number(val);
  return (val * 100).toFixed(2) + suffix;
};

export const filterWordCount = (val, LIMIT_NUM = 24) => {
  const PAD_STR = "...";

  if (val.length <= LIMIT_NUM) {
    return val;
  }
  return val.slice(PAD_STR.length - LIMIT_NUM).padStart(LIMIT_NUM, PAD_STR);
};

export const filterDigitUppercase = (n) => {
  const fraction = ["角", "分"];
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"],
  ];
  const head = n < 0 ? "欠" : "";
  n = Math.abs(n);
  var s = "";
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(shiftRight(n, 1 + i)) % 10] + fraction[i]).replace(
      /零./,
      ""
    );
  }
  s = s || "整";
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = "";
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(shiftLeft(n, 1));
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, "元")
      .replace(/(零.)+/g, "零")
      .replace(/^整$/, "零元整")
  );
};

export const filterEmpty = (val) => {
  return val ? val : "";
};

// 向右移位
function shiftRight(number, digit) {
  digit = parseInt(digit, 10);
  var value = number.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + digit : digit));
}
// 向左移位
function shiftLeft(number, digit) {
  digit = parseInt(digit, 10);
  var value = number.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] - digit : -digit));
}

export const padStart = (val) => {
  return String(val).padStart(2, "0");
};

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export const isNumeric = (val) => {
  return !isNaN(val) && !isNaN(parseFloat(val));
};

export const filterByteSize = (bytes) => {
  if (bytes == void 0) return "";
  if (bytes === 0) return "0 Byte";
  let k = 1024;

  let sizes = ["Byte", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let i = Math.floor(Math.log(bytes) / Math.log(k));
  var num = bytes / Math.pow(k, i);
  return num.toFixed(2) + " " + sizes[i];
};

export const isHexString = (str) => {
  if (str.startsWith("0x")) {
    str = str.slice(2);
  }
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(str) && str.length % 2 === 0;
};
