// 加密函数
export function encrypt(code: any): string {
  if(!code) return ''
  var c=String.fromCharCode(code.charCodeAt(0)+code.length);
  for(var i=1;i<code.length;i++){
    c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
  }
  return(escape(c));
}

// 解密函数
export function decrypt(code: any): string {
  if(!code) return ''
  code = unescape(code);
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);
    for(var i=1;i<code.length;i++){
      c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
    }
  return c;
}