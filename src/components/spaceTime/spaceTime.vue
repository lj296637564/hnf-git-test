<template>
    <!-- 时空轨迹page -->
    <div class="space-time">
        <!-- 条件搜索栏 -->
        <div class="flex flex-start">
           <time-range></time-range> 
           <div class="m-l10">
               <span class="color-51">反查时间：前后</span>
               <input type="number" value="2" min="1" style="width: 50px;">
               <select id="hourAndDay" @change="hourAndDayChange" style="vertical-align: middle;">
                   <option value="小时">小时</option>
                   <option value="天">天</option>
               </select>
           </div>
        </div>
        <!-- 数据展示页 -->
        <Row class-name="content-box">
            <Col span="6" class="h100p">
                <div class="color-white font-16 p-l20">当前区域{{regionListData.length}}条数据</div>
                <div class="content-left custom-scroll p-t15">
                    <ul class="p-l10 w300">
                        <li :class="{'active': regionListIndex===index}" @click="clickRegionListFn(index)" class="p-tb105" v-for="(item, index) in regionListData" :key="index">
                            <p class="color-51 p-t5">
                                开始时间&nbsp;&nbsp;<span class="color-b1">{{item.format}}</span>&nbsp;
                                <span @click="clickTimeCheckFn(item)" class="color-47 hide cursor-pointer">时间反查</span> 
                            </p>
                            <p class="color-51 p-t5">
                                轨迹时间&nbsp;&nbsp;<span class="color-b1">{{item.lon}},{{item.lat}}</span> 
                            </p>
                            <p class="color-51 p-t5">
                                持续时间&nbsp;&nbsp;<span class="color-b1">{{item.Duration}}秒</span> 
                            </p>
                        </li>
                    </ul>
                </div>
            </Col>
            <Col span="18" class="h100p">
                <div class="content-right h100p">
                    <div id="container" class=" h100p"></div> 
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
import common from '@/common/js/common';
import timeRange from "@/common/timeRange";
import { error } from "util";
export default {
  components: {
    timeRange
  },
  data() {
    return {
      // 选中的时间类型
      selectDateType: '小时',
      // 区域列表数据
      regionListData: [
        {
          Duration: "583",
          IMEI: "128296735564762",
          MAC: "c8:f2:30:76:1d:37",
          Stime: 1544778172000,
          lat: 30.6271668324547,
          lon: 104.068432660003,
          source: "1"
        },
        {
          Duration: "2",
          IMEI: "128296735564762",
          MAC: "c8:f2:30:76:1d:37",
          Stime: 1544751775000,
          lat: 30.630623515142,
          lon: 104.064452660452,
          source: "1"
        },
        {
          Duration: "58",
          IMEI: "128296735564762",
          MAC: "c8:f2:30:76:1d:37",
          Stime: 1544689326000,
          lat: 30.62716082922,
          lon: 104.068432657007,
          source: "1"
        }
      ],
    //   存储地图上marker数据以便执行动画
        markerList: [],
        // 存储点击区域列表的之前的下标
        regionListIndex: null,
        // 存储地图实例
        $map: {}

    };
  },
  methods: {
    // 小时和天切换
    hourAndDayChange () {
      this.selectDateType = document.getElementById('hourAndDay').value;
      if (this.regionListIndex !== null) {
        this.openInfo(this.$map, this.regionListData[this.regionListIndex]);
      }
    },
    //   点击区域列表
    clickRegionListFn (index) {
        if (this.regionListIndex === 0 || this.regionListIndex) {
            this.markerList[this.regionListIndex].setAnimation();
        }
        this.regionListIndex = index;
        this.markerList[index].setAnimation(BMAP_ANIMATION_BOUNCE);
    },
    // 点击时间反查
    clickTimeCheckFn (item) {
        this.openInfo(this.$map, item);
    },
    // 初始化地图
    mapInit() {
      this.markerList = [];
      this.$map = new BMap.Map("container");
      // 创建地图实例
      let point = new BMap.Point(
        this.regionListData[0].lon,
        this.regionListData[0].lat
      );
      // 创建点坐标
      this.$map.centerAndZoom(point, 15);
      // 初始化地图，设置中心点坐标和地图级别
      this.$map.enableScrollWheelZoom(true); // 开启鼠标滚动缩放
      this.$map.addControl(new BMap.NavigationControl());
      this.$map.addControl(new BMap.ScaleControl());
      this.$map.addControl(new BMap.OverviewMapControl());
      // 添加地图标注
      //   var marker = new BMap.Marker(point); // 创建标注
      //   map.addOverlay(marker);

      // 添加地图标注
      this.regionListData.forEach((item, index) => {
        // 创建坐标点
        let marker = new BMap.Marker(new BMap.Point(item.lon, item.lat));
        // 添加并渲染坐标点
        this.$map.addOverlay(marker);
        this.addClickHandler(this.$map, item, marker, index);
        this.markerList.push(marker);
      });
    },
    // 给标注点添加点击事件
    addClickHandler(map, content, marker, index) {
      marker.addEventListener("click", e => {
        this.regionListIndex = index;
        this.openInfo(map, content, e);
      });
    },
    // 打开信息窗口
    openInfo(map, content, e) {
      let opts = {
        width: 250, // 信息窗口宽度
        height: 260, // 信息窗口高度
        // title: "信息窗口", // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
      };
      //  自定义信息窗口
      let newInfoWindow = `
            <div class="new-info-window">
                <p class="color-51 p-t5">
                    开始时间&nbsp;&nbsp;<span class="color-b1">${content.format}</span>&nbsp;
                    <span class="color-47 hide cursor-pointer">时间反查</span> 
                </p>
                <p class="color-51 no-warp p-t5">
                    轨迹时间&nbsp;&nbsp;<span class="color-b1">${content.lon},${content.lat}</span> 
                </p>
                <p class="color-51 p-t5">
                    持续时间&nbsp;&nbsp;<span class="color-b1">${content.Duration}秒</span> 
                </p>
                <p class="color-red">时间反查（前后2${this.selectDateType==="小时"?"小时":"天"}）事件</p>
                <p>电话通联&emsp;5</p>
                <p>短信通联&emsp;5</p>
                <p>QQ通联&emsp;5</p>
            </div>
        `;
      let point = new BMap.Point(content.lon, content.lat);
      let infoWindow = new BMap.InfoWindow(newInfoWindow, opts); // 创建信息窗口对象
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    },
    // 获取区域列表数据
    getListFn() {
      common.$HttpPost('/countbyUsernumber', {
        usernumber: "513245196805040342",
        timeSelectType: 0,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: ""
      }).then(res => {
          console.log(res);
          res.data.forEach(item => {
            item.format = common.formatDate('yyyy-MM-dd hh:mm:ss', item.Stime) + ' ' + common.formatDate('', item.Stime);
          });
          this.regionListData = res.data;
          this.mapInit();
        })
        .catch(err => {
          console.log(err);
        });  
    }
  },
  mounted() {
    // this.mapInit();
  },
  created() {
    this.getListFn();
  }
};
</script>
<style scoped lang="less">
.space-time {
  height: calc(100% - 55px);
  .content-box {
    height: calc(100% - 32px);
  }
  // 区域数据列表样式
  .content-left {
    height: calc(100% - 24px);
    overflow-y: scroll;
    li {
      background: rgba(43, 43, 43, 1);
      border-radius: 10px;
      &.active{
        border: 2px solid #477cf9;
      }
      &:hover {
        border: 2px solid #477cf9;
        .hide {
          display: inline;
        }
      }
    }
  }
  .w300 {
    width: 300px;
  }
}
</style>

