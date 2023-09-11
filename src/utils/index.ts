function isNode(): boolean {
  // tslint:disable-next-line:triple-equals
  // @ts-ignore
  return typeof global === 'object';
}

function timeout(time = 30) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

/**
 * 防抖动
 *
 * @export
 * @param {*} fn 方法
 * @param {*} wait 多少毫秒不调用后执行一次
 * @returns
 */
function debounce (func, wait) {
  let timeout
  return function () {
    const context = this
    const args = [...arguments]
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * 节流
 *
 * @export
 * @param {*} func 方法
 * @param {*} delay 每隔多少毫秒执行一次
 * @returns
 */
function throttle (func, delay) {
  var timer = null
  return function () {
    var context = this
    const args = [...arguments]
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args)
        timer = null
      }, delay)
    }
  }
}


export {
  isNode,
  timeout,
  debounce,
  throttle
};
