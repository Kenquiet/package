export function Ajax(method,url,async,data) {
  // 1. 创建 ajax 核心对象，兼容 IE6、7
  let xhr = null;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  }else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP")
  }

// 发送请求
// method: GET 或者 POST， url: 请求地址， async: true（异步）或 false（同步）
//xhr.open(method,url,async)
// 下面是POST 请求
  if (method === 'GET') {
    xhr.open(method,url,async);
    xhr.send();
  }else {
    xhr.open(method,url,async);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send(data);  //post请求参数放在send里面，即请求体
  }

// 响应处理也分为同步和异步
  if (async === false) {
    const data = xhr.responseText;
    return
  }else {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.state === 200) {
        const data = xhr.responseText;
      }
    }
  }
  xhr.send();
}
