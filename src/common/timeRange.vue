<template>
    <!-- 时间范围选择组件 -->
    <div class="time-range pos-re">
        <div>
            <span class="m-r10 color-b1">时间范围</span>
            <Input @on-focus="rangeSelectShow=!rangeSelectShow" v-model="timeRangeName" placeholder="" style="width: 108px" />
        </div>
        <div v-if="rangeSelectShow" class="pos-ab t36-l60">
            <div class="time-range-box">
                <div class="flex flex-nowrap align-start">
                    <ul class="time-range-list">
                        <li :class="{'active': item.timeRangeName === timeRangeName}" @click="timeRangeFn(item)" v-for="(item, index) in timeRangeList" :key="index" class="color-9 cursor-pointer">{{item.timeRangeName}}</li>
                    </ul>
                    <div v-if="timeRangeInputShow" class="p-tr20">
                        <DatePicker :type="selectDataType" v-model="startDate" :options="maxDate" placeholder="开始时间" style="width: 100px;"></DatePicker>
                        <span class="color-9">&nbsp;-&nbsp;</span>
                        <DatePicker :type="selectDataType" v-model="endDate" :options="minDate" placeholder="结束时间" style="width: 100px;"></DatePicker>
                    </div>
                    <div v-if="userDefinedTimeShow" class="p-tr20">
                        <DatePicker :type="selectDataType" v-model="endDate" :options="minDate" confirm placeholder="结束时间" style="width: 100px;"></DatePicker>
                        <p class="p-t15">已选择：</p>
                        <p class="p-t15"></p>
                    </div>
                </div>
                
                <div v-if="timeRangeInputShow||userDefinedTimeShow" class="time-interval-box">
                    <div class="m-b10">
                        <Checkbox v-model="openTimeRange">
                            <span class="color-9">开启时段选择</span>
                        </Checkbox>
                    </div>
                    <div v-if="openTimeRange">
                        <TimePicker v-model="timeIntervalStart" format="HH:mm" placeholder="开始时间" style="width: 100px"></TimePicker>
                        &nbsp;-&nbsp;
                        <TimePicker v-model="timeIntervalEnd" format="HH:mm" placeholder="结束时间" style="width: 100px"></TimePicker>
                    </div>
                </div>
            </div>
            
            <div v-if="timeRangeInputShow||userDefinedTimeShow" class="text-end time-range-button-box">
                <Button type="primary">确定</Button>
                <Button>取消</Button>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 选中的时间范围值
            timeRangeName: '',
            // 时间范围列表
            timeRangeList: [
                {
                    timeRangeId: 1,
                    timeRangeName: '全部'
                },
                {
                    timeRangeId: 2,
                    timeRangeName: '一周内'
                },
                {
                    timeRangeId: 3,
                    timeRangeName: '一月内'
                },
                {
                    timeRangeId: 4,
                    timeRangeName: '半年内'
                },
                {
                    timeRangeId: 5,
                    timeRangeName: '一年内'
                },
                {
                    timeRangeId: 6,
                    timeRangeName: '按时间范围'
                },
                {
                    timeRangeId: 7,
                    timeRangeName: '自定义时间'
                }
            ],
            // 控制时段选择开关
            openTimeRange: false,
            // 开始时间、结束时间
            startDate: '',
            endDate: '',
            // 时段开始和结束时间
            timeIntervalStart: '',
            timeIntervalEnd: '',
            // 最早和最晚时间
            minDate: {
                // disabledDate (date) {
                //     return date && date.valueOf() < Date.now();
                // }
            },
            maxDate: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 控制时间范围输入框显隐
            timeRangeInputShow: false,
            // 控制自定义时间输入框显影
            userDefinedTimeShow: false,
            // 控制范围选择框显影
            rangeSelectShow: false

        }
    },
    methods: {
        // 时间范围选框获取焦点
        timeRangeFocusFn () {
            
        }, 
        // 时间范围点击
        timeRangeFn (item) {
            this.timeRangeName = item.timeRangeName;
            if (+item.timeRangeId === 6) {
                this.timeRangeInputShow = true;
                this.userDefinedTimeShow = false;
            } else if ( +item.timeRangeId === 7) {
                this.timeRangeInputShow = false;
                this.userDefinedTimeShow = true;
            } else {
                this.rangeSelectShow = false;
                this.timeRangeInputShow = false;
                this.userDefinedTimeShow = false;
            }
        }
    },
    watch: {
        // timeIntervalStart () {
        //     let $this = this;
        //     this.maxTime = {
        //         disabledDate (date) {
        //             return date && date.valueOf() > Date.now();
        //         }
        //     }
        // }
        startDate () {
            let $this = this;
            this.minDate = {
                disabledDate (date) {
                    return date && date.valueOf() < new Date($this.startDate);
                }
            }   
        }
    }
}
</script>
<style scoped>
    .time-range-box{
        border: 1px solid #262626;
        -webkit-box-shadow: 0 0 3px #e4e4e4;
        box-shadow: 0 0 3px #e4e4e4;
        background: #262626;
    }
    .time-range-button-box{
        height: 50px;
        line-height: 49px;
        padding-right: 20px;
        text-align: right;
        background-color: #262626;
        border: 1px solid #e4e4e4;
        -webkit-box-shadow: 0 0 3px #e4e4e4;
        box-shadow: 0 0 3px #e4e4e4;
        border-top: 0;
    }
    .time-interval-box{
        margin-left: 20px;
        padding: 20px 0 10px;
        border-top: 1px solid #e4e4e4;
        color: #999;
    }
    .time-range-list{
        width: 150px;
    }
    .time-range-list li{
        padding: 5px 0 5px 20px;
    }
    .time-range-list .active{
        color:#3842be !important;
        border-left: 2px solid #3842be;
    }
    .t36-l60{
        top: 36px;
        left: 60px;
        z-index: 9;
    }
</style>

