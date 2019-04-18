/**
 * 功能说明：该组件主要用于时间、联系次数表格展示
 * @props: listData(用于父组件传递给子组件的表格数据)
 */
<template>
    <!-- 时间、联系次数table组件 -->
    <div class="time-contact-table">
        <Table :columns="tableHeader" :data="listData" height="560px"></Table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // table头部
            tableHeader: [
                {
                    title: '时间(年)',
                    key: '_id'
                },
                {
                    title: '联系次数',
                    key: 'value'
                }
            ],
        }
    },
    props: {
        // 接收列表展示数据
        listData: {
            type: Array,
            default: []
        }
    }
}
</script>

