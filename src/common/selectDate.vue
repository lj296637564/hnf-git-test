/** 
 * 功能说明： 该组件用于时间的选择
 */
<template>
    <div class="select-date flex flex-start">
        <ButtonGroup>
            <Button @click="clickYearMonthBtnFn('year')" :type="yearMonthType === 'year' ? 'primary' : ''" size="small">年</Button>
            <Button @click="clickYearMonthBtnFn('month')" :type="yearMonthType === 'month' ? 'primary' : ''" size="small">月</Button>
            <Button @click="clickYearMonthBtnFn('day')" :type="yearMonthType === 'day' ? 'primary' : ''" size="small">日</Button>
        </ButtonGroup>
        <div class="m-l20 date-content">
            <DatePicker :type="selectDataType" v-model="startDate" :options="maxDate" placeholder="" style="width: 100px;"></DatePicker>
            &nbsp;-&nbsp;
            <DatePicker :type="selectDataType" v-model="endDate" :options="minDate" placeholder="" style="width: 100px;"></DatePicker>
        </div> 
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 控制年月日按钮显示的类型
            yearMonthType: 'year',
            // 控制可以选择的日期类型
            selectDataType: 'year',
            // 开始时间和截至时间
            startDate: '',
            endDate: '',
            minDate: {
                // disabledDate (date) {
                //     return date && date.valueOf() > new Date(this.startDate) - 86400000;
                // }
            },
            maxDate: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            }
        }
    },
    methods: {
        // 点击年月日按钮
        clickYearMonthBtnFn (type) {
            if (this.yearMonthType === type) {
                return;
            }
            this.yearMonthType = type;
            if (type === 'year') {
                this.selectDataType = 'year';
            } else if (type === 'month') {
                this.selectDataType = 'month';
            } else {
                this.selectDataType = 'date';
            }
        },
    },
    watch: {
        startDate () {
            let $this = this;
            this.minDate = {
                disabledDate (date) {
                    return date && date.valueOf() < new Date($this.startDate);
                }
            }   
        }
    },
    computed: {
        
    }
}
</script>
<style lang="">
    .select-date .ivu-input{
        height: 24px;
    }
    .select-date .ivu-input-icon{
        height: 24px;
        width: 24px;
        line-height: 24px;
    }
    .select-date .ivu-input{
        border: 1px solid #565656;
        color: #fff;
        background-color: #262626;
    }
    .date-content span{
        color: #515a6e;
    }
</style>