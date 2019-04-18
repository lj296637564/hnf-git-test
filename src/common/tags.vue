/** 
 * 功能说明： 该组件用于导航标签切换
 * event
 * @checkoutFn：切换tag的点击事件
 */
 <template>
     <div class="change-tag">
         <div class="flex content">
            <div @click="clickTagFn(item, index)" :class="{'active': checkedTagIndex === index}" v-for="(item, index) in tagList" :key="index" class="text-center cursor-pointer color-51 p-lr15">
                <p>{{item.tagName}}</p>
                <i :class="{'active': checkedTagIndex === index}"></i>
            </div>
            <span class="transverse-line"></span>
         </div>
     </div>
 </template>
 <script>
 export default {
    data() {
        return {
            // 标签列表
            tagList: [
                {
                    tagName: '社会关系',
                    tagId: 1,
                },
                {
                    tagName: '经济分析',
                    tagId: 2,
                },
                {
                    tagName: '时空轨迹',
                    tagId: 3,
                }
            ],
            // 选中的标签
            checkedTagIndex: 0
        }
    },
    methods: {
        // 点击tag
        clickTagFn (item, index) {
            if (this.checkedTagIndex === index) {
                return;
            }
            this.checkedTagIndex = index;
            this.$emit('checkoutFn', item);
        }
    }, 
 }
 </script>
 <style scoped lang="">
    i{
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        position: relative;
        z-index: 9;
        width: 8px;
        height: 8px;
    }
    .change-tag .content{
        border: 1px solid #000;
        width: 240px;
        height: 55px;
        position: relative;
        margin: 0 auto;
    }
    .transverse-line{
        position: absolute;
        display: block;
        top: 35px;
        width: 100%;
        height: 1px;
        background-color: #ccc;
        
    }
    .active{
        color: #3842be;
        border-color: #3842be;
    }
 </style>