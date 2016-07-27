/*!
 * vue-datepicker v0.1.2
 * https://github.com/weifeiyue/vue-datepicker
 * (c) 2016 weifeiyue
 * Released under the MIT License.
 */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['vue'], factory);
    } else if (typeof exports === 'object') {
        factory(require('vue'));
    } else {
        factory(Vue);
    }
}(function(Vue) {
    Vue.component('mz-datepicker', {
        template: '<div class="mz-datepicker" :style="{width:width+\'px\'}">' +
            '<input :value="value" readonly :disabled="disabled" :class="{focus:show}" @click="click" @mousedown="$event.preventDefault()"/><a v-if="clearable&&value" @click.stop="clear"></a><i @click="click"></i>' +
            '<div class="mz-datepicker-popup" :class="{\'mz-datepicker-popup-left\':left}" v-if="show" transition="mz-datepicker-popup" tabindex="-1" @blur="show = false" @mousedown="$event.preventDefault()" @keyup.up="changeMonth(-1,1)" @keyup.down="changeMonth(1,1)" @keyup.left="changeYear(-1,1)" @keyup.right="changeYear(1,1)" v-el:popup>' +
            '<div class="mz-calendar-top" v-if="range&&!en">' +
                '<template v-for="item in ranges">' +
                    '<i v-if="$index"></i><a v-text="item.name" @click="selectRange(item)"></a>' +
                '</template>' +
            '</div>' +
            '<div :class="{\'mz-calendar-range\':range}">' +
                '<template v-for="no in count">' +
                    '<div class="mz-calendar">' +
                        '<div class="mz-calendar-header">' +
                            '<a class="mz-calendar-prev-year" :title="prevYearTitle" @click="changeYear(-1,no+1)">«</a>' +
                            '<a class="mz-calendar-prev-month" :title="prevMonthTitle" @click="changeMonth(-1,no+1)">‹</a>' +
                            '<a v-if="!en" class="mz-calendar-year-select" :title="selectYearTitle" @click="showYear(no+1)">{{this[\'now\'+(no+1)].getFullYear()+(en?"":"年")}}</a>' +
                            '<a v-if="!en" class="mz-calendar-month-select" :title="selectMonthTitle" @click="showMonth(no+1)">{{months[this[\'now\'+(no+1)].getMonth()]}}</a>' +
                            '<a v-if="en" class="mz-calendar-month-select" :title="selectMonthTitle" @click="showMonth(no+1)">{{months[this[\'now\'+(no+1)].getMonth()]}}</a>' +
                            '<a v-if="en" class="mz-calendar-year-select" :title="selectYearTitle" @click="showYear(no+1)">{{this[\'now\'+(no+1)].getFullYear()+(en?"":"年")}}</a>' +
                            '<a class="mz-calendar-next-month" :title="nextMonthTitle" @click="changeMonth(1,no+1)">›</a>' +
                            '<a class="mz-calendar-next-year" :title="nextYearTitle" @click="changeYear(1,no+1)">»</a>' +
                        '</div>' +
                        '<table cellspacing="0" cellpadding="0">' +
                        '<tr><th v-for="day in days" v-text="day"></th></tr>' +
                        '<tr v-if="this[\'date\'+(no+1)]" v-for="i in 6"><td v-for="j in 7" v-text="this[\'date\'+(no+1)][i * 7 + j].text" :title="this[\'date\'+(no+1)][i * 7 + j].title" :class="this[\'date\'+(no+1)][i * 7 + j].status" @click="select(this[\'date\'+(no+1)][i * 7 + j], no+1)"></td></tr>' +
                        '</table>' +
                        '<div class="mz-calendar-year-panel" transition="mz-calendar-panel" v-if="this[\'showYear\'+(no+1)]"><a class="mz-calendar-year-panel-prev" @click="changeYearRange(no+1,-1)"></a><a class="mz-calendar-year-panel-year" v-for="item in this[\'years\'+(no+1)]" :class="item.status" @click="selectYear(item,no+1)">{{item.year+(en?"":"年")}}</a><a class="mz-calendar-year-panel-next" @click="changeYearRange(no+1,1)"></a></div>' +
                        '<div class="mz-calendar-month-panel" transition="mz-calendar-panel" v-if="this[\'showMonth\'+(no+1)]"><a v-for="item in this[\'months\'+(no+1)]" class="mz-calendar-month-panel-month" :class="item.status" @click="selectMonth(item,no+1)">{{months[item.month-1].substr(0,3)}}</a></div>' +
                    '</div>' +
                    '<div class="mz-calendar-separator" v-if="range&&no===0"><span>{{toTitle}}</span></div>' +
                '</template>' +
            '</div>' +
            '<div class="mz-calendar-bottom" v-if="range"><a class="mz-calendar-btn ok" @click="ok">{{okTitle}}</a></div>' +
            '</div>' +
            '</div>',
        props: {
            //是否显示范围
            range: {
                type: Boolean,
                default: false
            },
            //显示宽度
            width: {
                default: 214
            },
            //输入的时间
            time: {
                twoWay: true
            },
            //输入的开始时间
            startTime: {
                twoWay: true
            },
            //输入的结束时间
            endTime: {
                twoWay: true
            },
            //选择最大范围限制,以天为单位（只有range为true的时候才起作用）
            maxRange: {
                coerce: function(val) {
                    return +val;
                }
            },
            //是否可以清除
            clearable: {
                type: Boolean,
                default: false
            },
            //显示格式
            format: {
                type: String,
                default: 'yyyy-MM-dd'
            },
            //禁用
            disabled: {
                type: Boolean,
                default: false
            },
            //是否需要点击确认
            confirm: {
                type: Boolean,
                default: false
            },
            //英文显示
            en: {
                type: Boolean,
                default: false
            },
            //点击确认触发事件
            onConfirm: Function
        },
        data: function() {
            return {
                show: false,
                showYear1: false,
                showYear2: false,
                showMonth1: false,
                showMonth2: false,
                prevYearTitle: this.en ? 'last year' : '上一年',
                prevMonthTitle: this.en ? 'last month' : '上个月',
                selectYearTitle: this.en ? 'select year' : '选择年份',
                selectMonthTitle: this.en ? 'select month' : '选择月份',
                nextMonthTitle: this.en ? 'next month' : '下个月',
                nextYearTitle: this.en ? 'next year' : '下一年',
                toTitle: this.en ? 'TO' : '至',
                okTitle: this.en ? 'OK' : '确定',
                left: false,
                ranges: [], //选择范围
                days: this.en ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] : ['一', '二', '三', '四', '五', '六', '日'],
                months: this.en ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                years1: [],
                years2: [],
                months1: [],
                months2: [],
                date1: null,
                date2: null,
                time1: this.parse(this.startTime, false) || this.parse(this.time, false),
                time2: this.parse(this.endTime, true),
                now1: this.parse(new Date(), false),
                now2: this.parse(new Date(), true),
                count: this.range ? 2 : 1 //日历数量
            };
        },
        computed: {
            value: function() {
                if (this.range) {
                    if (this.startTime && this.endTime) {
                        return this.stringify(this.parse(this.startTime, false)) + ' ~ ' + this.stringify(this.parse(this.endTime, false));
                    } else {
                        return '';
                    }
                } else {
                    return this.stringify(this.parse(this.time, false));
                }
            }
        },
        watch: {
            show: function(val) {
                this.hidePanel();
                val && this.$els.popup.focus();
            },
            now1: function() {
                this.updateAll();
            },
            now2: function() {
                this.updateAll();
            }
        },
        methods: {
            //转换输入的时间
            parse: function(time, isLast) {
                if (time) {
                    var tmpTime = new Date(time);
                    if (isLast === undefined) {
                        return tmpTime;
                    } else if (isLast) {
                        return new Date(tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate(), 23, 59, 59, 999);
                    } else {
                        return new Date(tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate());
                    }
                }
                return null;
            },
            //初始化时间范围
            initRanges: function() {
                var time = new Date(),
                    ranges = [];
                ranges.push({
                    name: '今天',
                    start: this.parse(time, false),
                    end: this.parse(time, true)
                });
                time.setDate(time.getDate() - 1);
                ranges.push({
                    name: '昨天',
                    start: this.parse(time, false),
                    end: this.parse(time, true)
                });
                time = new Date();
                time.setDate(time.getDate() - 6);
                ranges.push({
                    name: '最近7天',
                    start: this.parse(time, false),
                    end: this.parse(new Date(), true)
                });
                time = new Date();
                time.setMonth(time.getMonth() + 1, 0);
                ranges.push({
                    name: '本月',
                    start: new Date(time.getFullYear(), time.getMonth(), 1),
                    end: this.parse(time, true)
                });
                time = new Date();
                time.setMonth(time.getMonth(), 0);
                ranges.push({
                    name: '上个月',
                    start: new Date(time.getFullYear(), time.getMonth(), 1),
                    end: this.parse(time, true)
                });
                time = new Date();
                time.setDate(time.getDate() - 29);
                ranges.push({
                    name: '最近一个月',
                    start: this.parse(time, false),
                    end: this.parse(new Date(), true)
                });
                time = new Date();
                time.setDate(time.getDate() - 365);
                ranges.push({
                    name: '最近一年',
                    start: this.parse(time, false),
                    end: this.parse(new Date(), true)
                });
                this.ranges = ranges;
            },
            //更新所有的日历
            updateAll: function() {
                this.update(new Date(this.now1), 1);
                this.range && this.update(new Date(this.now2), 2);
            },
            //点击时间输入框的时候触发
            click: function() {
                var self = this;
                self.time1 = self.parse(self.startTime) || self.parse(self.time);
                self.now1 = self.parse(self.startTime) || new Date();
                if (self.range) {
                    self.initRanges();
                    self.time2 = self.parse(self.endTime);
                    self.now2 = self.parse(self.endTime) || new Date();
                }
                var rect = this.$el.getBoundingClientRect(),
                    right = document.documentElement.clientWidth - rect.left;
                (right < (self.range ? 441 : 214) && right < rect.left) ? (self.left = true) : (self.left = false);
                self.show = !self.show;
            },
            //选择时间
            select: function(item, no) {
                var self = this;
                self.hidePanel();
                if (item.status.indexOf('mz-calendar-disabled') !== -1) {
                    return;
                }
                self['now' + no] = new Date(item.time);
                self['time' + no] = new Date(item.time);
                if (!self.range) {
                    self.time = self.getOutTime(item.time);
                    self.show = false;
                } else if (!self.confirm) {
                    self[no === 1 ? 'startTime' : 'endTime'] = self.getOutTime(item.time);
                }
            },
            //确认
            ok: function() {
                var self = this;
                self.show = false;
                if (self.range && self.confirm) {
                    self.startTime = self.getOutTime(self.time1);
                    self.endTime = self.getOutTime(self.time2);
                    self.onConfirm && self.onConfirm(self.startTime, self.endTime);
                }
            },
            //选择范围
            selectRange: function(item) {
                var self = this;
                self.now1 = new Date(item.start);
                self.now2 = new Date(item.end);
                self.time1 = new Date(item.start);
                self.time2 = new Date(item.end);
                self.startTime = self.getOutTime(item.start);
                self.endTime = self.getOutTime(item.end);
                self.hidePanel();
            },
            //根据输出类型，获取输出的时间
            getOutTime: function(time) {
                var type = this.time ? typeof(this.time) : typeof(this.startTime);
                if (type === 'number') {
                    return time.getTime();
                } else if (type === 'object') {
                    return new Date(time);
                } else {
                    return this.stringify(time);
                }
            },
            //更新时间
            update: function(time, no) {
                var i, tmpTime, curFirstDay, lastDay, curDay, day, arr = [];
                time.setDate(0); //切换到上个月最后一天
                curFirstDay = time.getDay(); //星期几
                lastDay = time.getDate(); //上个月的最后一天
                for (i = curFirstDay; i > 0; i--) {
                    day = lastDay - i + 1;
                    tmpTime = new Date(time.getFullYear(), time.getMonth(), day);
                    tmpTime = this.parse(tmpTime, no === 2);
                    arr.push({
                        status: this.getTimeStatus(tmpTime, no) || 'mz-calendar-lastmonth',
                        title: this.stringify(tmpTime),
                        text: day,
                        time: tmpTime
                    });
                }
                time.setMonth(time.getMonth() + 2, 0); //切换到当前月的最后一天
                curDay = time.getDate(); //当前月的最后一天
                time.setDate(1);
                for (i = 1; i <= curDay; i++) {
                    tmpTime = new Date(time.getFullYear(), time.getMonth(), i);
                    tmpTime = this.parse(tmpTime, no === 2);
                    arr.push({
                        status: this.getTimeStatus(tmpTime, no),
                        title: this.stringify(tmpTime),
                        text: i,
                        time: tmpTime
                    });
                }
                //下个月的前几天
                for (i = 1; arr.length < 42; i++) {
                    tmpTime = new Date(time.getFullYear(), time.getMonth() + 1, i);
                    tmpTime = this.parse(tmpTime, no === 2);
                    arr.push({
                        status: this.getTimeStatus(tmpTime, no) || 'mz-calendar-nextmonth',
                        title: this.stringify(tmpTime),
                        text: i,
                        time: tmpTime
                    });
                }
                this['date' + no] = arr;
            },
            //获取时间状态
            getTimeStatus: function(time, no, format) {
                var status = '',
                    curTime = new Date(),
                    selTime = this['time' + no],
                    tmpTimeVal = this.stringify(time, format || 'yyyy-MM-dd'), //需要查询状态的时间字符串值
                    curTimeVal = this.stringify(curTime, format || 'yyyy-MM-dd'), //当前时间字符串值
                    selTimeVal = this.stringify(selTime, format || 'yyyy-MM-dd'); //选中时间字符串值
                if (tmpTimeVal === selTimeVal) {
                    status = 'mz-calendar-selected';
                } else if (tmpTimeVal === curTimeVal) {
                    status = 'mz-calendar-today';
                }
                if (this.time1 && this.time2 && time >= this.time1 && time <= this.time2) {
                    status += ' mz-calendar-inrange';
                }
                if (no == 1 && this.time2) {
                    var minTime = new Date(this.time2);
                    if (this.maxRange) {
                        minTime.setDate(minTime.getDate() - this.maxRange);
                        if (format === 'yyyy') {
                            minTime = new Date(minTime.getFullYear(), 0, 1);
                        }
                        if (format === 'yyyy-MM') {
                            minTime = new Date(minTime.getFullYear(), 0, 1);
                        }
                        if (time < minTime || time > this.time2) {
                            status += ' mz-calendar-disabled';
                        }
                    } else if (time > this.time2) {
                        status += ' mz-calendar-disabled';
                    }
                    if (time > this.time2) {
                        status += ' mz-calendar-disabled';
                    }
                }
                if (no == 2 && this.time1) {
                    var maxTime = new Date(this.time1);
                    if (this.maxRange) {
                        maxTime.setDate(maxTime.getDate() + this.maxRange);
                        if (format === 'yyyy') {
                            maxTime = new Date(maxTime.getFullYear(), 11, 1);
                        }
                        if (format === 'yyyy-MM') {
                            maxTime = new Date(maxTime.getFullYear(), maxTime.getMonth() + 1, 1);
                        }
                        if (time > maxTime || time < this.time1) {
                            status += ' mz-calendar-disabled';
                        }
                    } else if (time < this.time1) {
                        status += ' mz-calendar-disabled';
                    }
                }
                return status;
            },
            //将Date转化为指定格式的String
            stringify: function(time, format) {
                if (!time) {
                    return '';
                }
                format = format || this.format;
                var year = time.getFullYear(), //年份
                    month = time.getMonth() + 1, //月份
                    day = time.getDate(), //日
                    hours24 = time.getHours(), //小时
                    hours = hours24 % 12 === 0 ? 12 : hours24 % 12,
                    minutes = time.getMinutes(), //分
                    seconds = time.getSeconds(), //秒
                    milliseconds = time.getMilliseconds(); //毫秒
                var map = {
                    yyyy: year,
                    MM: ('0' + month).slice(-2),
                    M: month,
                    dd: ('0' + day).slice(-2),
                    d: day,
                    HH: ('0' + hours24).slice(-2),
                    H: hours24,
                    hh: ('0' + hours).slice(-2),
                    h: hours,
                    mm: ('0' + minutes).slice(-2),
                    m: minutes,
                    ss: ('0' + seconds).slice(-2),
                    s: seconds,
                    S: milliseconds
                };
                return format.replace(/y+|M+|d+|H+|h+|m+|s+|S+/g, function(str) {
                    return map[str];
                });
            },
            //显示年份选择器
            showYear: function(no) {
                var name = 'showYear' + no;
                this.hidePanel(name);
                this[name] = !this[name];
                var time = new Date(this['now' + no] || new Date()),
                    num = Math.floor(time.getFullYear() % 10), //获取当前时间个位数
                    arr = [];
                time.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                time.setFullYear(time.getFullYear() - num);
                while (arr.length < 10) {
                    no === 2 && time.setMonth(time.getMonth() + 1, 0);
                    arr.push({
                        year: time.getFullYear(),
                        status: this.getTimeStatus(time, no, 'yyyy'),
                    });
                    time.setDate(1);
                    time.setFullYear(time.getFullYear() + 1);
                }
                this['years' + no] = arr;
            },
            //显示月份选择器
            showMonth: function(no) {
                var name = 'showMonth' + no;
                this.hidePanel(name);
                this[name] = !this[name];
                var time = new Date(this['now' + no] || new Date()),
                    arr = [];
                while (arr.length < 12) {
                    time.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                    time.setMonth(arr.length);
                    no === 2 && time.setMonth(time.getMonth() + 1, 0);
                    arr.push({
                        month: arr.length + 1,
                        status: this.getTimeStatus(time, no, 'yyyy-MM'),
                    });
                }
                this['months' + no] = arr;
            },
            //切换年份选择器
            changeYearRange: function(no, flag) {
                var arr = this['years' + no],
                    time = new Date(this['time' + no] || new Date());
                for (var i in arr) {
                    var item = arr[i],
                        year = item.year + 10 * flag;
                    time.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                    time.setFullYear(year);
                    no === 2 && time.setMonth(time.getMonth() + 1, 0);
                    item.year = year;
                    item.status = this.getTimeStatus(time, no);
                }
            },
            //改变年份
            changeYear: function(flag, no) {
                var now = this['now' + no];
                now.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                now.setFullYear(now.getFullYear() + flag);
                no === 2 && now.setMonth(now.getMonth() + 1, 0);
                this['now' + no] = new Date(now);
                this.hidePanel();
            },
            //改变月份
            changeMonth: function(flag, no) {
                var now = this['now' + no];
                now.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                now.setMonth(now.getMonth() + flag);
                no === 2 && now.setMonth(now.getMonth() + 1, 0);
                this['now' + no] = new Date(now);
                this.hidePanel();
            },
            //选择年份
            selectYear: function(item, no) {
                if (item.status.indexOf('mz-calendar-disabled') !== -1) {
                    return;
                }
                var now = this['now' + no];
                now.setFullYear(item.year);
                this['now' + no] = new Date(now);
                this.hidePanel();
            },
            //选择月份
            selectMonth: function(item, no) {
                if (item.status.indexOf('mz-calendar-disabled') !== -1) {
                    return;
                }
                var now = this['now' + no];
                now.setMonth(item.month - 1);
                this['now' + no] = new Date(now);
                this.hidePanel();
            },
            //隐藏所有面板
            hidePanel: function(name) {
                ['showYear1', 'showYear2', 'showMonth1', 'showMonth2'].map(function(item) {
                    if (item !== name) {
                        this[item] = false;
                    }
                }.bind(this));
            },
            //清除时间
            clear: function() {
                var self = this;
                self.time1 = self.time2 = self.startTime = self.endTime = self.time = null;
                self.now1 = new Date();
                self.now2 = new Date();
            }
        }
    });
}));