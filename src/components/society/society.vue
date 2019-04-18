<template>
    <!-- 社会关系组件 -->
    <div class="society p-t5 flex align-start" style="height: calc(100% - 55px)">
        <div class="col-left h100p">
            <!-- 筛选栏 -->
            <Row>
                <Col span="8">
                    <ButtonGroup>
                        <Button @click="clickBtnFn(true)" :type="btnSelect ? 'primary' : ''">通联分析</Button>
                        <Button @click="clickBtnFn(false)" :type="!btnSelect ? 'primary' : ''">群分析</Button>
                    </ButtonGroup>
                </Col>
                <Col span="16" class="flex space-between no-warp" :class="{'flex-end': !btnSelect}">
                    <div v-if="btnSelect" class="flex">
                        <span class="color-b1">通联类型：</span>
                        <Checkbox
                            :indeterminate="indeterminate"
                            :value="checkAll"
                            @click.prevent.native="handleCheckAll">全选</Checkbox>
                        <CheckboxGroup class="m-l5" v-model="checkAllGroup" @on-change="checkAllGroupChange">
                            <Checkbox label="电话"></Checkbox>
                            <Checkbox label="短信"></Checkbox>
                            <Checkbox label="微信"></Checkbox>
                            <Checkbox label="QQ"></Checkbox>
                        </CheckboxGroup>
                    </div>
                    <div v-if="btnSelect">
                        <span class="m-r10 color-b1">亲密度</span>
                        <Select v-model="intimacyId" style="width:140px">
                            <Option v-for="item in intimacyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            <Row>
                                <Col span="9">
                                    <InputNumber class="w60" :max="1000" :min="0" v-model="minNumber"></InputNumber>
                                </Col>
                                <Col span="9">
                                    &nbsp;&nbsp;—&nbsp;&nbsp;
                                    <InputNumber class="w60" :max="1000" :min="0" v-model="maxNumber"></InputNumber>
                                </Col>
                            </Row>
                        </Select>
                    </div>
                    <!-- 群分析筛选栏 -->
                    <div v-if="!btnSelect" class="m-r10">
                        <span class="m-r10 color-b1">群类型</span>
                        <Select v-model="groupTypeId" style="width:140px">
                            <Option v-for="item in groupTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div v-if="!btnSelect" class="m-r10">
                        <span class="m-r10 color-b1">参与度</span>
                        <Select v-model="intimacyId" style="width:140px">
                            <Option v-for="item in intimacyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            <Row>
                                <Col span="9">
                                    <InputNumber class="w60" :max="1000" :min="0" v-model="minNumber"></InputNumber>
                                </Col>
                                <Col span="9">
                                    &nbsp;&nbsp;—&nbsp;&nbsp;
                                    <InputNumber class="w60" :max="1000" :min="0" v-model="maxNumber"></InputNumber>
                                </Col>
                            </Row>
                        </Select>
                    </div>

                    <div class="m-r10">
                        <time-range></time-range>
                    </div>
                    <Input v-if="btnSelect" suffix="ios-search"  placeholder="请输入查看内容" style="width: 180px" />
                </Col>
                
            </Row>
            <!-- table表格 -->
            <div class="m-t20 color-b1 custom-scroll" style="height: calc(100% - 130px);overflow-y: auto;">
                <Table @on-row-click="clickListFn" v-if="count!==0" highlight-row :columns="tableInfo.header" :data="tableInfo.data"></Table>
                <div class="h-780 flex flex-dc" v-else>
                    <img src="../../assets/img/none.png"/>
                    <p class="font-16 font-bold m-t5 color-90">没有数据</p>
                </div> 
            </div>
            <!-- page -->
            <Page @on-change="selectPageFn" :total="count" :current="pageParams.pageIndex" :page-size="pageParams.pageSize" show-total show-elevator />
        </div>
        <div class="col-right p-lr2010">
            <!-- 时间选择 -->
            <div>
                <p v-if="btnSelect" class="font-16 color-white">通联频次变化</p>
                <p v-else class="font-16 color-white">活跃度频次</p>
                <div class="flex space-between">
                    <ButtonGroup v-if="!btnSelect">
                        <Button @click="clickActivityBtnFn('personal')" :type="activityType === 'personal' ? 'primary' : ''" size="small">个人活跃度</Button>
                        <Button @click="clickActivityBtnFn('group')" :type="activityType === 'group' ? 'primary' : ''" size="small">群活跃度</Button>
                    </ButtonGroup>
                    <selectDate></selectDate>
                </div>
            </div>
            <!-- 折线图 -->
            <div id="echarts" class="line-chart">

            </div>
            <p v-if="!btnSelect" class="font-16 color-white">活跃度频次数据详情</p>
            <div>
                <time-contact-table 
                    v-if="listData.length!==0"
                    :listData="listData"></time-contact-table>
                <div v-else class="h-560 flex flex-dc">
                    <img src="../../assets/img/none.png"/>
                    <p class="font-16 font-bold m-t5 color-90">没有数据</p>
                </div> 
            </div>
        </div>
    </div>
</template>
<script>
import common from "@/common/js/common.js";
import timeRange from "../../common/timeRange";
import selectDate from "@/common/selectDate";
import timeContactTable from "@/common/timeContactTable";
import { error } from "util";
import { constants } from "zlib";
export default {
  components: {
    timeRange,
    selectDate,
    timeContactTable
  },
  data() {
    return {
      // 控制活跃度按钮显示的类型
      activityType: "personal",
      // 控制按钮选中状态
      btnSelect: true,
      indeterminate: false,
      checkAll: true,
      checkAllGroup: ["电话", "短信", "微信", "QQ"],
      // 亲密度id和列表
      intimacyId: 0,
      intimacyList: [
        {
          label: "全部",
          value: 1
        },
        {
          label: "排名前10",
          value: 2
        },
        {
          label: "排名前15",
          value: 3
        }
      ],
      // 时间范围id和列表
      timeRangeId: 0,
      timeRangeList: [
        {
          label: "全部",
          value: 1
        },
        {
          label: "排名前10",
          value: 2
        },
        {
          label: "排名前15",
          value: 3
        },
        {
          label: "全部",
          value: 1
        },
        {
          label: "排名前10",
          value: 2
        },
        {
          label: "排名前15",
          value: 3
        }
      ],
      // 群类型Id和列表
      groupTypeId: 0,
      groupTypeList: [
        {
          label: "全部",
          value: 1
        },
        {
          label: "排名前10",
          value: 2
        },
        {
          label: "排名前15",
          value: 3
        }
      ],
      minNumber: 0,
      maxNumber: 0,
      // 表单信息
      tableInfo: {
        // 展示的表头和展示数据
        header: [],
        data: [
          {
            rank: 1,
            nickname: "小明",
            type: "QQ",
            fuin: "342342423",
            uin: "1442433242",
            count: 4,
            troop: "565646464",
            selfcount: 4,
            allcount: 54,
            _highlight: true
          },
          {
            rank: 2,
            nickname: "小明",
            type: "QQ",
            fuin: "342342423",
            uin: "1442433242",
            count: 4,
            troop: "565646464",
            selfcount: 4,
            allcount: 54
          },
          {
            rank: 3,
            nickname: "小明",
            type: "QQ",
            fuin: "342342423",
            uin: "1442433242",
            count: 4,
            troop: "565646464",
            selfcount: 4,
            allcount: 54
          }
        ],
        // 通联分析header
        communicationsHeader: [
          {
            title: "亲密度排行",
            key: "rank"
          },
          {
            title: "通联对象",
            key: "nickname",
            ellipsis: true,
            tooltip: true
          },
          {
            title: "通联类型",
            key: "type"
          },
          {
            title: "手机号/虚拟账号",
            key: "fuin",
            ellipsis: true,
            tooltip: true
          },
          {
            title: "本人账号",
            key: "uin",
            ellipsis: true,
            tooltip: true
          },
          {
            title: "联系次数",
            key: "count"
          },
          {
            title: "操作",
            render(h, params) {
              return h(
                "span",
                {
                  style: {
                    color: "blue"
                  }
                },
                "详情"
              );
            }
          }
        ],
        // 群分析
        groupHeader: [
          {
            title: "参与度排行",
            key: "rank"
          },
          {
            title: "群名称",
            key: "nickname",
            ellipsis: true,
            tooltip: true
          },
          {
            title: "群类型",
            key: "type"
          },
          {
            title: "群账号",
            key: "troop",
            ellipsis: true,
            tooltip: true
          },
          {
            title: "参与次数",
            key: "selfcount"
          },
          {
            title: "群消息数",
            key: "allcount"
          },
          {
            title: "操作",
            render(h, params) {
              return h(
                "span",
                {
                  style: {
                    color: "blue"
                  }
                },
                "查看记录"
              );
            }
          }
        ]
      },
      // 分页数据
      pageParams: {
        pageSize: 15,
        pageIndex: 1
      },
      // 列表总数
      count: 3,
      // 时间联系次数数据
      listData: [],
      // 存储点击当前行的数据
      heightData: {}
    };
  },
  methods: {
    // 点击分析按钮
    clickBtnFn(tr) {
      if (this.btnSelect === tr) {
        return;
      }
      this.btnSelect = tr;
      this.pageParams.pageIndex = 1;
      if (tr) {
        this.tableInfo.header = this.tableInfo.communicationsHeader;
      } else {
        this.tableInfo.header = this.tableInfo.groupHeader;
      }
      this.getListDataFn();
    },

    // 点击活跃度
    clickActivityBtnFn(type) {
      if (this.activityType === type) {
        return;
      }
      this.activityType = type;
      this.getContactNumberFn(this.heightData);
      if (type === "personal") {
      } else {
      }
    },
    // 点击全选按钮
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = ["电话", "短信", "微信", "QQ"];
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === 4) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },

    // 点击列表事件
    clickListFn(params) {
      this.heightData = params;
      this.getContactNumberFn(params);
    },
    // 选择分页页面
    selectPageFn(page) {
      this.pageParams.pageIndex = page;
      this.getListDataFn();
    },
    // 初始化echarts
    echartsInit(xArray = [], yArray = []) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("echarts"));

      // 指定图表的配置项和数据
      var option = {
        // 设置鼠标悬浮提示样式
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line"
          }
        },
        // 设置x轴数据展示及样式
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            color: "white"
          },
          data: xArray
        },
        // 设置y轴数据展示及样式
        yAxis: {
          type: "value",
          axisLabel: {
            color: "white"
          }
        },
        // 设置表格中展示的数据及样式
        series: [
          {
            data: yArray,
            type: "line"
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    // 获取列表数据
    getListDataFn() {
      let form = {
        searchContant: "",
        usernumber: "513245196805040342",
        typeSelect: "",
        selects: [4, 2, 3, 5, 6],
        contactType: "",
        startContactNumber: "",
        endContactNumber: "",
        timeSelectType: 0,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        pageNo: this.pageParams.pageIndex,
        pageSize: this.pageParams.pageSize
      };
      // 判断当前点击
      let url = this.btnSelect
        ? "/deviceInfo/findDeviceAllContactInfo"
        : "/deviceInfo/findDeviceAllTroopInfo";
      common
        .$HttpPost(url, form)
        .then(res => {
          console.log(res);
          console.log(JSON.stringify(res));
          if (+res.state === 0) {
            // 默认选中第一行
            res.data.data[0]._highlight = true;
            // 获取第一次的通联次数
            this.getContactNumberFn(res.data.data[0]);
            this.count = +res.data.total;
            this.tableInfo.data = res.data.data;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 获取联系次数
    getContactNumberFn(data) {
      let url = this.btnSelect
        ? "/personAnalysis/findContactTrendChange"
        : "/personAnalysis/findOneActivityTrendChange";
      let contact = {};
      if (this.btnSelect) {
        contact = {
          deviceUnique: data.device,
          contactType: data.type,
          fUin: data.fuin,
          meUin: data.uin,
          selectType: 0,
          startDate: "",
          endDate: ""
        };
      } else {
        contact = {
          troopUin: data.troop,
          troopType: data.type,
          activityType: this.activityType === "personal" ? 1 : 2,
          meUin: data.uin,
          selectType: 0,
          startDate: "",
          endDate: ""
        };
      }
      common
        .$HttpPost(url, contact)
        .then(res => {
          console.log(res);
          if (+res.state === 0) {
            let xArray = res.data.map(item => {
              return item._id;
            });
            let yArray = res.data.map(item => {
              return item.value;
            });
            this.listData = res.data;
            this.echartsInit(xArray, yArray);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  created() {
    this.tableInfo.header = this.tableInfo.communicationsHeader;
    this.getListDataFn();
    // this.getContactNumberFn();
  },
  mounted() {
    // this.echartsInit();
  }
};
</script>
<style scoped lang="less">
.ivu-checkbox-wrapper {
  margin-right: 0;
}
</style>