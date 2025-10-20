// src/utils/date.js
export function formatDate (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''

  const d = new Date(date)
  const pad = n => (n < 10 ? '0' + n : n)

  const map = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds())
  }

  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match])
}
