/** hex转rgb */
function hexToRgb(str) {
  let hxs = str.replace("#", "").match(/../g)
  for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16)
  return hxs
}

/** rgb转hex */
function rgbToHex(a, b, c) {
  let hexs = [a.toString(16), b.toString(16), c.toString(16)]
  for (let i = 0; i < 3; i++) {
    if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`
  }
  return `#${hexs.join("")}`
}

/**
 * @description 颜色值加深
 * @param color `hex` 格式
 * @param level 色值度
 * @returns 加深后的颜色值，`hex` 格式
 */
export function darken(color: string, level: number): string {
  let rgbc = hexToRgb(color)
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level))
  return rgbToHex(rgbc[0], rgbc[1], rgbc[2])
}

/**
 * @description 颜色值变浅
 * @param color `hex` 格式
 * @param level 色值度
 * @returns 变浅后的颜色值，`hex` 格式
 */
export function lighten(color: string, level: number): string {
  let rgbc = hexToRgb(color)
  for (let i = 0; i < 3; i++)
    rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i])
  return rgbToHex(rgbc[0], rgbc[1], rgbc[2])
}