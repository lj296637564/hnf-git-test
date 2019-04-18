<template>
    <div class="index p-lr15">
        <!-- tag导航栏 -->
        <tags
            @checkoutFn="checkoutTagFn"
        ></tags>
        <!-- 社会关系page -->
        <society v-if="showPageType==='society'"></society>
        <!-- 经济分析page -->
        <economics v-else-if="showPageType==='economics'"></economics>   
        <!-- 时空轨迹 -->
        <space-time v-else-if="showPageType==='spaceTime'"></space-time>
        <!--<Tabs :animated="false">
            <TabPane label="社会关系">
                <society></society> 
            </TabPane>
            <TabPane label="经济分析">标签二的内容</TabPane>
            <TabPane label="时空轨迹">标签三的内容</TabPane>
        </Tabs>-->
    </div>
</template>
<script>
import tags from '@/common/tags';
import society from './society/society';
import economics from './economics/economics';
import spaceTime from './spaceTime/spaceTime';
export default {
    components: {
        tags,
        society,
        economics,
        spaceTime
    },
    data() {
        return {
            showPageType: 'society'
        }
    },
    methods: {
        // 切换标签事件
        checkoutTagFn (item) {
            console.log(item);
            if (+item.tagId === 1) {
                this.showPageType = 'society';
            } else if (+item.tagId === 2) {
                this.showPageType = 'economics';
            } else {
                this.showPageType = 'spaceTime';
            }
        }   
    }
}
</script>
<style lang="less">
    .index{
        background: rgb(38, 38, 38);
        height: 100%;
    }
</style>