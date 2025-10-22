/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkvue_antd_pro"] = self["webpackChunkvue_antd_pro"] || []).push([["lang-zh-CN"],{

/***/ "./node_modules/ant-design-vue/es/calendar/locale/zh_CN.js":
/*!*****************************************************************!*\
  !*** ./node_modules/ant-design-vue/es/calendar/locale/zh_CN.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _date_picker_locale_zh_CN__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../date-picker/locale/zh_CN */ \"./node_modules/ant-design-vue/es/date-picker/locale/zh_CN.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_date_picker_locale_zh_CN__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack://vue-antd-pro/./node_modules/ant-design-vue/es/calendar/locale/zh_CN.js?\n}");

/***/ }),

/***/ "./node_modules/ant-design-vue/es/date-picker/locale/zh_CN.js":
/*!********************************************************************!*\
  !*** ./node_modules/ant-design-vue/es/date-picker/locale/zh_CN.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/extends */ \"./node_modules/babel-runtime/helpers/extends.js\");\n/* harmony import */ var _vc_calendar_src_locale_zh_CN__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../vc-calendar/src/locale/zh_CN */ \"./node_modules/ant-design-vue/es/vc-calendar/src/locale/zh_CN.js\");\n/* harmony import */ var _time_picker_locale_zh_CN__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../time-picker/locale/zh_CN */ \"./node_modules/ant-design-vue/es/time-picker/locale/zh_CN.js\");\n\n\n\n\nvar locale = {\n  lang: (0,babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n    placeholder: '请选择日期',\n    rangePlaceholder: ['开始日期', '结束日期']\n  }, _vc_calendar_src_locale_zh_CN__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n  timePickerLocale: (0,babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, _time_picker_locale_zh_CN__WEBPACK_IMPORTED_MODULE_2__[\"default\"])\n};\n\n// should add whitespace between char in Button\nlocale.lang.ok = '确 定';\n\n// All settings at:\n// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (locale);\n\n//# sourceURL=webpack://vue-antd-pro/./node_modules/ant-design-vue/es/date-picker/locale/zh_CN.js?\n}");

/***/ }),

/***/ "./node_modules/ant-design-vue/es/locale-provider/zh_CN.js":
/*!*****************************************************************!*\
  !*** ./node_modules/ant-design-vue/es/locale-provider/zh_CN.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _locale_zh_CN__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../locale/zh_CN */ \"./node_modules/ant-design-vue/es/locale/zh_CN.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_locale_zh_CN__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack://vue-antd-pro/./node_modules/ant-design-vue/es/locale-provider/zh_CN.js?\n}");

/***/ }),

/***/ "./node_modules/ant-design-vue/es/locale/zh_CN.js":
/*!********************************************************!*\
  !*** ./node_modules/ant-design-vue/es/locale/zh_CN.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _vc_pagination_locale_zh_CN__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vc-pagination/locale/zh_CN */ \"./node_modules/ant-design-vue/es/vc-pagination/locale/zh_CN.js\");\n/* harmony import */ var _date_picker_locale_zh_CN__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../date-picker/locale/zh_CN */ \"./node_modules/ant-design-vue/es/date-picker/locale/zh_CN.js\");\n/* harmony import */ var _time_picker_locale_zh_CN__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../time-picker/locale/zh_CN */ \"./node_modules/ant-design-vue/es/time-picker/locale/zh_CN.js\");\n/* harmony import */ var _calendar_locale_zh_CN__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../calendar/locale/zh_CN */ \"./node_modules/ant-design-vue/es/calendar/locale/zh_CN.js\");\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  locale: 'zh-cn',\n  Pagination: _vc_pagination_locale_zh_CN__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  DatePicker: _date_picker_locale_zh_CN__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  TimePicker: _time_picker_locale_zh_CN__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  Calendar: _calendar_locale_zh_CN__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  // locales for all comoponents\n  global: {\n    placeholder: '请选择'\n  },\n  Table: {\n    filterTitle: '筛选',\n    filterConfirm: '确定',\n    filterReset: '重置',\n    selectAll: '全选当页',\n    selectInvert: '反选当页',\n    sortTitle: '排序',\n    expand: '展开行',\n    collapse: '关闭行'\n  },\n  Modal: {\n    okText: '确定',\n    cancelText: '取消',\n    justOkText: '知道了'\n  },\n  Popconfirm: {\n    cancelText: '取消',\n    okText: '确定'\n  },\n  Transfer: {\n    searchPlaceholder: '请输入搜索内容',\n    itemUnit: '项',\n    itemsUnit: '项'\n  },\n  Upload: {\n    uploading: '文件上传中',\n    removeFile: '删除文件',\n    uploadError: '上传错误',\n    previewFile: '预览文件',\n    downloadFile: '下载文件'\n  },\n  Empty: {\n    description: '暂无数据'\n  },\n  Icon: {\n    icon: '图标'\n  },\n  Text: {\n    edit: '编辑',\n    copy: '复制',\n    copied: '复制成功',\n    expand: '展开'\n  },\n  PageHeader: {\n    back: '返回'\n  }\n});\n\n//# sourceURL=webpack://vue-antd-pro/./node_modules/ant-design-vue/es/locale/zh_CN.js?\n}");

/***/ }),

/***/ "./node_modules/ant-design-vue/es/time-picker/locale/zh_CN.js":
/*!********************************************************************!*\
  !*** ./node_modules/ant-design-vue/es/time-picker/locale/zh_CN.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\nvar locale = {\n  placeholder: '请选择时间'\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (locale);\n\n//# sourceURL=webpack://vue-antd-pro/./node_modules/ant-design-vue/es/time-picker/locale/zh_CN.js?\n}");

/***/ }),

/***/ "./node_modules/ant-design-vue/es/vc-calendar/src/locale/zh_CN.js":
/*!************************************************************************!*\
  !*** ./node_modules/ant-design-vue/es/vc-calendar/src/locale/zh_CN.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  today: '今天',\n  now: '此刻',\n  backToToday: '返回今天',\n  ok: '确定',\n  timeSelect: '选择时间',\n  dateSelect: '选择日期',\n  weekSelect: '选择周',\n  clear: '清除',\n  month: '月',\n  year: '年',\n  previousMonth: '上个月 (翻页上键)',\n  nextMonth: '下个月 (翻页下键)',\n  monthSelect: '选择月份',\n  yearSelect: '选择年份',\n  decadeSelect: '选择年代',\n  yearFormat: 'YYYY年',\n  dayFormat: 'D日',\n  dateFormat: 'YYYY年M月D日',\n  dateTimeFormat: 'YYYY年M月D日 HH时mm分ss秒',\n  previousYear: '上一年 (Control键加左方向键)',\n  nextYear: '下一年 (Control键加右方向键)',\n  previousDecade: '上一年代',\n  nextDecade: '下一年代',\n  previousCentury: '上一世纪',\n  nextCentury: '下一世纪'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./node_modules/ant-design-vue/es/vc-calendar/src/locale/zh_CN.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN.js":
/*!***********************************!*\
  !*** ./src/locales/lang/zh-CN.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ \"./node_modules/@babel/runtime/helpers/esm/objectSpread2.js\");\n/* harmony import */ var ant_design_vue_es_locale_provider_zh_CN__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ant-design-vue/es/locale-provider/zh_CN */ \"./node_modules/ant-design-vue/es/locale-provider/zh_CN.js\");\n/* harmony import */ var moment_locale_zh_cn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment/locale/zh-cn */ \"?1747\");\n/* harmony import */ var moment_locale_zh_cn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment_locale_zh_cn__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _zh_CN_global__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./zh-CN/global */ \"./src/locales/lang/zh-CN/global.js\");\n/* harmony import */ var _zh_CN_menu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./zh-CN/menu */ \"./src/locales/lang/zh-CN/menu.js\");\n/* harmony import */ var _zh_CN_setting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./zh-CN/setting */ \"./src/locales/lang/zh-CN/setting.js\");\n/* harmony import */ var _zh_CN_user__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./zh-CN/user */ \"./src/locales/lang/zh-CN/user.js\");\n/* harmony import */ var _zh_CN_dashboard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./zh-CN/dashboard */ \"./src/locales/lang/zh-CN/dashboard.js\");\n/* harmony import */ var _zh_CN_form__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./zh-CN/form */ \"./src/locales/lang/zh-CN/form.js\");\n/* harmony import */ var _zh_CN_result__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./zh-CN/result */ \"./src/locales/lang/zh-CN/result.js\");\n/* harmony import */ var _zh_CN_account__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./zh-CN/account */ \"./src/locales/lang/zh-CN/account.js\");\n\n\n\n\n\n\n\n\n\n\n\nvar components = {\n  antLocale: ant_design_vue_es_locale_provider_zh_CN__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  momentName: 'zh-cn',\n  momentLocale: (moment_locale_zh_cn__WEBPACK_IMPORTED_MODULE_2___default())\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = ((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n  message: '-',\n  'layouts.usermenu.dialog.title': '信息',\n  'layouts.usermenu.dialog.content': '您确定要注销吗？',\n  'layouts.userLayout.title': 'Ant Design 是西湖区最具影响力的 Web 设计规范'\n}, components), _zh_CN_global__WEBPACK_IMPORTED_MODULE_3__[\"default\"]), _zh_CN_menu__WEBPACK_IMPORTED_MODULE_4__[\"default\"]), _zh_CN_setting__WEBPACK_IMPORTED_MODULE_5__[\"default\"]), _zh_CN_user__WEBPACK_IMPORTED_MODULE_6__[\"default\"]), _zh_CN_dashboard__WEBPACK_IMPORTED_MODULE_7__[\"default\"]), _zh_CN_form__WEBPACK_IMPORTED_MODULE_8__[\"default\"]), _zh_CN_result__WEBPACK_IMPORTED_MODULE_9__[\"default\"]), _zh_CN_account__WEBPACK_IMPORTED_MODULE_10__[\"default\"]));\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/account.js":
/*!*******************************************!*\
  !*** ./src/locales/lang/zh-CN/account.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ \"./node_modules/@babel/runtime/helpers/esm/objectSpread2.js\");\n/* harmony import */ var _account_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./account/settings */ \"./src/locales/lang/zh-CN/account/settings.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, _account_settings__WEBPACK_IMPORTED_MODULE_1__[\"default\"]));\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/account.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/account/settings.js":
/*!****************************************************!*\
  !*** ./src/locales/lang/zh-CN/account/settings.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  'account.settings.menuMap.basic': '基本设置',\n  'account.settings.menuMap.security': '安全设置',\n  'account.settings.menuMap.custom': '个性化',\n  'account.settings.menuMap.binding': '账号绑定',\n  'account.settings.menuMap.notification': '新消息通知',\n  'account.settings.basic.avatar': '头像',\n  'account.settings.basic.change-avatar': '更换头像',\n  'account.settings.basic.email': '邮箱',\n  'account.settings.basic.email-message': '请输入您的邮箱!',\n  'account.settings.basic.nickname': '昵称',\n  'account.settings.basic.nickname-message': '请输入您的昵称!',\n  'account.settings.basic.profile': '个人简介',\n  'account.settings.basic.profile-message': '请输入个人简介!',\n  'account.settings.basic.profile-placeholder': '个人简介',\n  'account.settings.basic.country': '国家/地区',\n  'account.settings.basic.country-message': '请输入您的国家或地区!',\n  'account.settings.basic.geographic': '所在省市',\n  'account.settings.basic.geographic-message': '请输入您的所在省市!',\n  'account.settings.basic.address': '街道地址',\n  'account.settings.basic.address-message': '请输入您的街道地址!',\n  'account.settings.basic.phone': '联系电话',\n  'account.settings.basic.phone-message': '请输入您的联系电话!',\n  'account.settings.basic.update': '更新基本信息',\n  'account.settings.basic.update.success': '更新基本信息成功',\n  'account.settings.security.strong': '强',\n  'account.settings.security.medium': '中',\n  'account.settings.security.weak': '弱',\n  'account.settings.security.password': '账户密码',\n  'account.settings.security.password-description': '当前密码强度：',\n  'account.settings.security.phone': '密保手机',\n  'account.settings.security.phone-description': '已绑定手机：',\n  'account.settings.security.question': '密保问题',\n  'account.settings.security.question-description': '未设置密保问题，密保问题可有效保护账户安全',\n  'account.settings.security.email': '备用邮箱',\n  'account.settings.security.email-description': '已绑定邮箱：',\n  'account.settings.security.mfa': 'MFA 设备',\n  'account.settings.security.mfa-description': '未绑定 MFA 设备，绑定后，可以进行二次确认',\n  'account.settings.security.modify': '修改',\n  'account.settings.security.set': '设置',\n  'account.settings.security.bind': '绑定',\n  'account.settings.binding.taobao': '绑定淘宝',\n  'account.settings.binding.taobao-description': '当前未绑定淘宝账号',\n  'account.settings.binding.alipay': '绑定支付宝',\n  'account.settings.binding.alipay-description': '当前未绑定支付宝账号',\n  'account.settings.binding.dingding': '绑定钉钉',\n  'account.settings.binding.dingding-description': '当前未绑定钉钉账号',\n  'account.settings.binding.bind': '绑定',\n  'account.settings.notification.password': '账户密码',\n  'account.settings.notification.password-description': '其他用户的消息将以站内信的形式通知',\n  'account.settings.notification.messages': '系统消息',\n  'account.settings.notification.messages-description': '系统消息将以站内信的形式通知',\n  'account.settings.notification.todo': '待办任务',\n  'account.settings.notification.todo-description': '待办任务将以站内信的形式通知',\n  'account.settings.settings.open': '开',\n  'account.settings.settings.close': '关'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/account/settings.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/dashboard.js":
/*!*********************************************!*\
  !*** ./src/locales/lang/zh-CN/dashboard.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ \"./node_modules/@babel/runtime/helpers/esm/objectSpread2.js\");\n/* harmony import */ var _dashboard_analysis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard/analysis */ \"./src/locales/lang/zh-CN/dashboard/analysis.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, _dashboard_analysis__WEBPACK_IMPORTED_MODULE_1__[\"default\"]));\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/dashboard.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/dashboard/analysis.js":
/*!******************************************************!*\
  !*** ./src/locales/lang/zh-CN/dashboard/analysis.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  'dashboard.analysis.test': '工专路 {no} 号店',\n  'dashboard.analysis.introduce': '指标说明',\n  'dashboard.analysis.total-sales': '总销售额',\n  'dashboard.analysis.day-sales': '日均销售额￥',\n  'dashboard.analysis.visits': '访问量',\n  'dashboard.analysis.visits-trend': '访问量趋势',\n  'dashboard.analysis.visits-ranking': '门店访问量排名',\n  'dashboard.analysis.day-visits': '日访问量',\n  'dashboard.analysis.week': '周同比',\n  'dashboard.analysis.day': '日同比',\n  'dashboard.analysis.payments': '支付笔数',\n  'dashboard.analysis.conversion-rate': '转化率',\n  'dashboard.analysis.operational-effect': '运营活动效果',\n  'dashboard.analysis.sales-trend': '销售趋势',\n  'dashboard.analysis.sales-ranking': '门店销售额排名',\n  'dashboard.analysis.all-year': '全年',\n  'dashboard.analysis.all-month': '本月',\n  'dashboard.analysis.all-week': '本周',\n  'dashboard.analysis.all-day': '今日',\n  'dashboard.analysis.search-users': '搜索用户数',\n  'dashboard.analysis.per-capita-search': '人均搜索次数',\n  'dashboard.analysis.online-top-search': '线上热门搜索',\n  'dashboard.analysis.the-proportion-of-sales': '销售额类别占比',\n  'dashboard.analysis.dropdown-option-one': '操作一',\n  'dashboard.analysis.dropdown-option-two': '操作二',\n  'dashboard.analysis.channel.all': '全部渠道',\n  'dashboard.analysis.channel.online': '线上',\n  'dashboard.analysis.channel.stores': '门店',\n  'dashboard.analysis.sales': '销售额',\n  'dashboard.analysis.traffic': '客流量',\n  'dashboard.analysis.table.rank': '排名',\n  'dashboard.analysis.table.search-keyword': '搜索关键词',\n  'dashboard.analysis.table.users': '用户数',\n  'dashboard.analysis.table.weekly-range': '周涨幅'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/dashboard/analysis.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/form.js":
/*!****************************************!*\
  !*** ./src/locales/lang/zh-CN/form.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ \"./node_modules/@babel/runtime/helpers/esm/objectSpread2.js\");\n/* harmony import */ var _form_basicForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form/basicForm */ \"./src/locales/lang/zh-CN/form/basicForm.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, _form_basicForm__WEBPACK_IMPORTED_MODULE_1__[\"default\"]));\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/form.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/form/basicForm.js":
/*!**************************************************!*\
  !*** ./src/locales/lang/zh-CN/form/basicForm.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  'form.basic-form.basic.title': '基础表单',\n  'form.basic-form.basic.description': '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',\n  'form.basic-form.title.label': '标题',\n  'form.basic-form.title.placeholder': '给目标起个名字',\n  'form.basic-form.title.required': '请输入标题',\n  'form.basic-form.date.label': '起止日期',\n  'form.basic-form.placeholder.start': '开始日期',\n  'form.basic-form.placeholder.end': '结束日期',\n  'form.basic-form.date.required': '请选择起止日期',\n  'form.basic-form.goal.label': '目标描述',\n  'form.basic-form.goal.placeholder': '请输入你的阶段性工作目标',\n  'form.basic-form.goal.required': '请输入目标描述',\n  'form.basic-form.standard.label': '衡量标准',\n  'form.basic-form.standard.placeholder': '请输入衡量标准',\n  'form.basic-form.standard.required': '请输入衡量标准',\n  'form.basic-form.client.label': '客户',\n  'form.basic-form.client.required': '请描述你服务的客户',\n  'form.basic-form.label.tooltip': '目标的服务对象',\n  'form.basic-form.client.placeholder': '请描述你服务的客户，内部客户直接 @姓名／工号',\n  'form.basic-form.invites.label': '邀评人',\n  'form.basic-form.invites.placeholder': '请直接 @姓名／工号，最多可邀请 5 人',\n  'form.basic-form.weight.label': '权重',\n  'form.basic-form.weight.placeholder': '请输入',\n  'form.basic-form.public.label': '目标公开',\n  'form.basic-form.label.help': '客户、邀评人默认被分享',\n  'form.basic-form.radio.public': '公开',\n  'form.basic-form.radio.partially-public': '部分公开',\n  'form.basic-form.radio.private': '不公开',\n  'form.basic-form.publicUsers.placeholder': '公开给',\n  'form.basic-form.option.A': '同事一',\n  'form.basic-form.option.B': '同事二',\n  'form.basic-form.option.C': '同事三',\n  'form.basic-form.email.required': '请输入邮箱地址！',\n  'form.basic-form.email.wrong-format': '邮箱地址格式错误！',\n  'form.basic-form.userName.required': '请输入用户名!',\n  'form.basic-form.password.required': '请输入密码！',\n  'form.basic-form.password.twice': '两次输入的密码不匹配!',\n  'form.basic-form.strength.msg': '请至少输入 6 个字符。请不要使用容易被猜到的密码。',\n  'form.basic-form.strength.strong': '强度：强',\n  'form.basic-form.strength.medium': '强度：中',\n  'form.basic-form.strength.short': '强度：太短',\n  'form.basic-form.confirm-password.required': '请确认密码！',\n  'form.basic-form.phone-number.required': '请输入手机号！',\n  'form.basic-form.phone-number.wrong-format': '手机号格式错误！',\n  'form.basic-form.verification-code.required': '请输入验证码！',\n  'form.basic-form.form.get-captcha': '获取验证码',\n  'form.basic-form.captcha.second': '秒',\n  'form.basic-form.form.optional': '（选填）',\n  'form.basic-form.form.submit': '提交',\n  'form.basic-form.form.save': '保存',\n  'form.basic-form.email.placeholder': '邮箱',\n  'form.basic-form.password.placeholder': '至少6位密码，区分大小写',\n  'form.basic-form.confirm-password.placeholder': '确认密码',\n  'form.basic-form.phone-number.placeholder': '手机号',\n  'form.basic-form.verification-code.placeholder': '验证码'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/form/basicForm.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/global.js":
/*!******************************************!*\
  !*** ./src/locales/lang/zh-CN/global.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  submit: '提交',\n  save: '保存',\n  'submit.ok': '提交成功',\n  'save.ok': '保存成功'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/global.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/menu.js":
/*!****************************************!*\
  !*** ./src/locales/lang/zh-CN/menu.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  'menu.welcome': '欢迎',\n  'menu.home': '主页',\n  'menu.dashboard': '仪表盘',\n  'menu.dashboard.analysis': '分析页',\n  'menu.dashboard.monitor': '监控页',\n  'menu.dashboard.workplace': '工作台',\n  'menu.form': '表单页',\n  'menu.form.basic-form': '基础表单',\n  'menu.form.step-form': '分步表单',\n  'menu.form.step-form.info': '分步表单（填写转账信息）',\n  'menu.form.step-form.confirm': '分步表单（确认转账信息）',\n  'menu.form.step-form.result': '分步表单（完成）',\n  'menu.form.advanced-form': '高级表单',\n  'menu.list': '列表页',\n  'menu.list.table-list': '查询表格',\n  'menu.list.basic-list': '标准列表',\n  'menu.list.card-list': '卡片列表',\n  'menu.list.search-list': '搜索列表',\n  'menu.list.search-list.articles': '搜索列表（文章）',\n  'menu.list.search-list.projects': '搜索列表（项目）',\n  'menu.list.search-list.applications': '搜索列表（应用）',\n  'menu.profile': '详情页',\n  'menu.profile.basic': '基础详情页',\n  'menu.profile.advanced': '高级详情页',\n  'menu.result': '结果页',\n  'menu.result.success': '成功页',\n  'menu.result.fail': '失败页',\n  'menu.exception': '异常页',\n  'menu.exception.not-permission': '403',\n  'menu.exception.not-find': '404',\n  'menu.exception.server-error': '500',\n  'menu.exception.trigger': '触发错误',\n  'menu.account': '个人页',\n  'menu.account.center': '个人中心',\n  'menu.account.settings': '个人设置',\n  'menu.account.trigger': '触发报错',\n  'menu.account.logout': '退出登录'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/menu.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/result.js":
/*!******************************************!*\
  !*** ./src/locales/lang/zh-CN/result.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ \"./node_modules/@babel/runtime/helpers/esm/objectSpread2.js\");\n/* harmony import */ var _result_success__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./result/success */ \"./src/locales/lang/zh-CN/result/success.js\");\n/* harmony import */ var _result_fail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./result/fail */ \"./src/locales/lang/zh-CN/result/fail.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,F_appMode_loan_manage_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, _result_success__WEBPACK_IMPORTED_MODULE_1__[\"default\"]), _result_fail__WEBPACK_IMPORTED_MODULE_2__[\"default\"]));\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/result.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/result/fail.js":
/*!***********************************************!*\
  !*** ./src/locales/lang/zh-CN/result/fail.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  'result.fail.error.title': '提交失败',\n  'result.fail.error.description': '请核对并修改以下信息后，再重新提交。',\n  'result.fail.error.hint-title': '您提交的内容有如下错误：',\n  'result.fail.error.hint-text1': '您的账户已被冻结',\n  'result.fail.error.hint-btn1': '立即解冻',\n  'result.fail.error.hint-text2': '您的账户还不具备申请资格',\n  'result.fail.error.hint-btn2': '立即升级',\n  'result.fail.error.btn-text': '返回修改'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/result/fail.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/result/success.js":
/*!**************************************************!*\
  !*** ./src/locales/lang/zh-CN/result/success.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  'result.success.title': '提交成功',\n  'result.success.description': '提交结果页用于反馈一系列操作任务的处理结果， 如果仅是简单操作，使用 Message 全局提示反馈即可。 本文字区域可以展示简单的补充说明，如果有类似展示 “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。',\n  'result.success.operate-title': '项目名称',\n  'result.success.operate-id': '项目 ID',\n  'result.success.principal': '负责人',\n  'result.success.operate-time': '生效时间',\n  'result.success.step1-title': '创建项目',\n  'result.success.step1-operator': '曲丽丽',\n  'result.success.step2-title': '部门初审',\n  'result.success.step2-operator': '周毛毛',\n  'result.success.step2-extra': '催一下',\n  'result.success.step3-title': '财务复核',\n  'result.success.step4-title': '完成',\n  'result.success.btn-return': '返回列表',\n  'result.success.btn-project': '查看项目',\n  'result.success.btn-print': '打印'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/result/success.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/setting.js":
/*!*******************************************!*\
  !*** ./src/locales/lang/zh-CN/setting.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  'app.setting.pagestyle': '整体风格设置',\n  'app.setting.pagestyle.light': '亮色菜单风格',\n  'app.setting.pagestyle.dark': '暗色菜单风格',\n  'app.setting.pagestyle.realdark': '暗黑模式',\n  'app.setting.themecolor': '主题色',\n  'app.setting.navigationmode': '导航模式',\n  'app.setting.content-width': '内容区域宽度',\n  'app.setting.fixedheader': '固定 Header',\n  'app.setting.fixedsidebar': '固定侧边栏',\n  'app.setting.sidemenu': '侧边菜单布局',\n  'app.setting.topmenu': '顶部菜单布局',\n  'app.setting.content-width.fixed': 'Fixed',\n  'app.setting.content-width.fluid': 'Fluid',\n  'app.setting.othersettings': '其他设置',\n  'app.setting.weakmode': '色弱模式',\n  'app.setting.copy': '拷贝设置',\n  'app.setting.loading': '加载主题中',\n  'app.setting.copyinfo': '拷贝设置成功 src/config/defaultSettings.js',\n  'app.setting.production.hint': '配置栏只在开发环境用于预览，生产环境不会展现，请拷贝后手动修改配置文件',\n  'app.setting.themecolor.daybreak': '拂晓蓝',\n  'app.setting.themecolor.dust': '薄暮',\n  'app.setting.themecolor.volcano': '火山',\n  'app.setting.themecolor.sunset': '日暮',\n  'app.setting.themecolor.cyan': '明青',\n  'app.setting.themecolor.green': '极光绿',\n  'app.setting.themecolor.geekblue': '极客蓝',\n  'app.setting.themecolor.purple': '酱紫'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/setting.js?\n}");

/***/ }),

/***/ "./src/locales/lang/zh-CN/user.js":
/*!****************************************!*\
  !*** ./src/locales/lang/zh-CN/user.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  'user.login.userName': '用户名',\n  'user.login.password': '密码',\n  'user.login.username.placeholder': '请输入用户名',\n  'user.login.password.placeholder': '请输入密码',\n  'user.login.message-invalid-credentials': '账户或密码错误（admin/ant.design）',\n  'user.login.message-invalid-verification-code': '验证码错误',\n  'user.login.tab-login-credentials': '账户密码登录',\n  'user.login.tab-login-mobile': '手机号登录',\n  'user.login.mobile.placeholder': '手机号',\n  'user.login.mobile.verification-code.placeholder': '验证码',\n  'user.login.remember-me': '自动登录',\n  'user.login.forgot-password': '忘记密码',\n  'user.login.sign-in-with': '其他登录方式',\n  'user.login.signup': '注册账户',\n  'user.login.login': '登录',\n  'user.register.register': '注册',\n  'user.register.email.placeholder': '邮箱',\n  'user.register.password.placeholder': '请至少输入 6 个字符。请不要使用容易被猜到的密码。',\n  'user.register.password.popover-message': '请至少输入 6 个字符。请不要使用容易被猜到的密码。',\n  'user.register.confirm-password.placeholder': '确认密码',\n  'user.register.get-verification-code': '获取验证码',\n  'user.register.sign-in': '使用已有账户登录',\n  'user.register-result.msg': '你的账户：{email} 注册成功',\n  'user.register-result.activation-email': '激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。',\n  'user.register-result.back-home': '返回首页',\n  'user.register-result.view-mailbox': '查看邮箱',\n  'user.email.required': '请输入邮箱地址！',\n  'user.email.wrong-format': '邮箱地址格式错误！',\n  'user.userName.required': '请输入帐户名或邮箱地址',\n  'user.password.required': '请输入密码！',\n  'user.password.twice.msg': '两次输入的密码不匹配!',\n  'user.password.strength.msg': '密码强度不够 ',\n  'user.password.strength.strong': '强度：强',\n  'user.password.strength.medium': '强度：中',\n  'user.password.strength.low': '强度：低',\n  'user.password.strength.short': '强度：太短',\n  'user.confirm-password.required': '请确认密码！',\n  'user.phone-number.required': '请输入正确的手机号',\n  'user.phone-number.wrong-format': '手机号格式错误！',\n  'user.verification-code.required': '请输入验证码！'\n});\n\n//# sourceURL=webpack://vue-antd-pro/./src/locales/lang/zh-CN/user.js?\n}");

/***/ }),

/***/ "?1747":
/*!*************************************!*\
  !*** moment/locale/zh-cn (ignored) ***!
  \*************************************/
/***/ (function() {

eval("{/* (ignored) */\n\n//# sourceURL=webpack://vue-antd-pro/moment/locale/zh-cn_(ignored)?\n}");

/***/ })

}]);