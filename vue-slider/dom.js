export function addClass(el, className) {
  if (hasClass(el,className)) {
    return
  }
  // 先将 className 拆成数组，然后添加一个 新的className 在合并并赋值给 el.className
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className)
}
