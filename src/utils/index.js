/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * mixin object
 * @param {Object} object
 * @param {Object} source
 */
export function mixin(object, source) {
  Object.keys(source).forEach(key => {
    if (Object.prototype.toString.call(source[key]) === '[object Object]') {
      object[key] = object[key] || {}
      mixin(object[key], source[key])
    } else {
      object[key] = source[key]
    }
  })
  return object
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (!arguments.length || !time) {
    return null
  }
  const format = cFormat || 'y-m-d h:i:s'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/([ymdhisa])+/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number|string} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()
  const diff = (now - d) / 1000
  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 数据安全访问
 * @param  {object|Array} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {*} [argValue] [如果数据有误，返回的值，选填]
 */
export function safe(argData, argCheck, argValue) {
  var temKey = argCheck.toString().split('.')
  var temLen = temKey.length
  if (!argData) {
    return argValue
  }
  if (temLen > 1) {
    for (var i = 0; i < temLen - 1; i++) {
      if (typeof argData[temKey[i]] !== 'object') {
        return argValue
      }
      argData = argData[temKey[i]] || {}
    }
  }
  if (typeof argValue === 'undefined') {
    return argData[temKey[temLen - 1]]
  }
  return argData[temKey[temLen - 1]] || argValue
}

/**
 * 导出表格数据
 * @param  {Array[Object]} allColumns  [{label: '表头text',  value: '对应列的字段'}]
 * @param  {Array} tableData [表格数据]
 * @param  {String}} excelName [文件名]
 */
export function exportJsonToExcel({ allColumns = [], tableData, excelName = new Date().getTime() + '' }) {
  function formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }
  const columnNames = []
  const columnValues = []
  for (let i = 0; i < allColumns.length; i++) {
    const { label, value } = allColumns[i]
    columnNames.push(label)
    columnValues.push(value)
  }
  require.ensure([], () => {
    const { export_json_to_excel } = require('../vendor/Export2Excel')
    const tHeader = columnNames
    const filterVal = columnValues
    const data = formatJson(filterVal, tableData)
    export_json_to_excel(tHeader, data, excelName)
  })
}
