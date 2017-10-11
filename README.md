vue-datepicker
========
### A Beautiful Datepicker Component For Vue
* Lightweight (less than 5kb minified and gzipped)
* Only dependencies Vue
* Beautiful!

for vue2:
[https://github.com/weifeiyue/vue-datepicker-local](https://github.com/weifeiyue/vue-datepicker-local)

![image](https://github.com/weifeiyue/vue-datepicker/raw/master/screenshots/datepicker.png)

## Usage

```html
<link rel="stylesheet" href="vue.datepicker.css">
```

```html
<script type="text/javascript" src="vue.datepicker.js"></script>
```

```html
<!--base-->
<mz-datepicker></mz-datepicker>

<!--english version-->
<mz-datepicker en></mz-datepicker>

<!--disabled-->
<mz-datepicker disabled></mz-datepicker>

<!--show clear button-->
<mz-datepicker clearable></mz-datepicker>

<!--set width-->
<mz-datepicker width="186"></mz-datepicker>

<!--format display-->
<mz-datepicker format="yyyy-MM-dd"></mz-datepicker>

<!--bind modal-->
<mz-datepicker :time.sync="time"></mz-datepicker>

<!--show range-->
<mz-datepicker :start-time.sync="startTime" :end-time.sync="endTime" range></mz-datepicker>

<!--max range(unit:day)-->
<mz-datepicker :start-time.sync="startTime" :end-time.sync="endTime" range max-range="366"></mz-datepicker>

<!--onConfirm(only in rang and confirm mode)-->
<mz-datepicker :start-time.sync="startTime" :end-time.sync="endTime" range confirm :on-confirm="onConfirm"></mz-datepicker>
```
