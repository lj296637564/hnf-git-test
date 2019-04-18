<template>
    <!-- 经济分析page -->
    <div class="economics p-t5 flex align-start" style="height: calc(100% - 55px)">
        <div class="economics-left h100p">
            <!-- 筛选栏 -->
            <Row>
                <Col span="8">
                    <ButtonGroup>
                        <Button @click="clickBtnFn(true)" :type="btnSelect ? 'primary' : ''">交易概况</Button>
                        <Button @click="clickBtnFn(false)" :type="!btnSelect ? 'primary' : ''">资金流水</Button>
                    </ButtonGroup>
                </Col>
                <Col span="16" class="flex flex-start no-warp">
                    <div v-if="btnSelect" class="m-r10">
                        <span class="m-r10 color-b1">账号</span>
                        <Select v-model="accountId" style="width:140px">
                            <Option v-for="item in accountList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
    
                    <div class="m-r10">
                        <time-range></time-range>
                    </div>
                    <div v-if="!btnSelect" class="m-r10">
                        <span class="m-r10 color-b1">账号</span>
                        <Select v-model="accountId" style="width:140px">
                            <Option v-for="item in accountList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>                
                </Col>
            </Row>
            <!-- table表格 -->
            <div class="m-t20 custom-scroll color-b1" style="height: calc(100% - 120px);overflow-y: auto;">
                <Table @on-row-click="clickListFn" highlight-row v-if="count!==0" :columns="tableInfo.header" :data="tableInfo.data"></Table>
                <div v-else class="h-780 flex flex-dc">
                    <img src="../../assets/img/none.png"/>
                    <p class="font-16 font-bold m-t5 color-90">没有数据</p>
                </div> 
            </div>
            <!-- page -->
            <Page @on-change="selectPageFn" :total="count" :current="pageParams.pageIndex" :page-size="pageParams.pageSize" show-total show-elevator />
        </div>
        <div class="economics-right p-lr2010">
            <div v-if="btnSelect">
                <p class="font-16 color-white">与 <span class="color-47">{{heightData._id.business_to_number}}</span> 交易详情记录</p>
                <div>
                    <Table v-if="tableInfo.recordInfoData.length!==0" :columns="tableInfo.recordInfoHeader" :data="tableInfo.recordInfoData"></Table>
                    <div v-else class="h-560 flex flex-dc">
                        <img src="../../assets/img/none.png"/>
                        <p class="font-16 font-bold m-t5 color-90">没有数据</p>
                    </div> 
                </div>

            </div>
            <div v-else>
                <p class="color-b1">账户收支变化</p>
                <div class="p-t10">
                    <span class="m-r10 color-b1">账号</span>
                    <Select v-model="personalAccountId" style="width:500px">
                        <Option v-for="item in personalAccountList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <selectDate class="p-t10"></selectDate>  
                <div id="echarts" class="line-chart">

                </div>
                <Table :columns="tableInfo.incomeExpendHeader" :data="tableInfo.incomeExpendData"></Table>
            </div>
        </div>
    </div>
</template>
<script>
import common from '@/common/js/common';
import timeRange from "@/common/timeRange";
import selectDate from "@/common/selectDate";
export default {
  components: {
    timeRange,
    selectDate
  },
  data() {
    return {
      btnSelect: true,
      // 账号id和列表
      accountId: 1,
      accountList: [
        {
          label: "支付宝",
          value: 1
        }
      ],
      // 个人收支账号id和列表
      personalAccountId: "",
      personalAccountList: [],
      // 表单信息
      tableInfo: {
        // 展示的表头和展示数据
        header: [],
        data: [
          {
            dealCount: 1,
            inCountMoney: 100,
            outCountMoney: "",
            self_name: null,
            type: 0,
            _id: {business_to_number: "吃辣条的神", self_number: "唐培"},
            _highlight: true
          },
          {
            dealCount: 1,
            inCountMoney: 100,
            outCountMoney: "",
            self_name: null,
            type: 0,
            _id: {business_to_number: "吃辣条的神", self_number: "唐培"}
          },
          {
            dealCount: 1,
            inCountMoney: 100,
            outCountMoney: "",
            self_name: null,
            type: 0,
            _id: {business_to_number: "吃辣条的神", self_number: "唐培"}
          }
        ],
        // 交易记录详情数据
        recordInfoData: [],
        // 交易概况header
        transactionHeader: [
          {
            type: 'index',
            width: 60,
            title: '序号',
            align: 'center'
          },  
          {
            title: "账号类型",
            key: "type"
          },
          {
            title: "本人账号",
            key: "self_name",
            ellipsis: true,
            tooltip: true
          },
          {
            title: "交易对方",
            // key: "_id.business_to_number",
            render(h, params) {
               return h('span', {}, `${params.row._id.business_to_number}`) 
            },
          },
          {
            title: "交易次数",
            key: "dealCount"
          },
          {
            title: "来账总金额(元)",
            key: "inCountMoney",
            render(h, params) {
              return h(
                "span",
                {
                  style: {
                    // color: "blue"
                  }
                },
                `${params.row.inCountMoney ? '+'+params.row.inCountMoney : '0.00'}`)}
          },
          {
            title: "往期总金额",
            // key: "outCountMoney",
            render(h, params) {
               return h('span', {}, `${params.row.outCountMoney ? '-'+params.row.outCountMoney.toFixed(2) : '0.00'}`) 
            },
          }
        ],
        // 资金流水
        capitalHeader: [
          {
            type: 'index',
            width: 60,
            title: '序号',
            align: 'center'
          }, 
          {
            title: "交易对方",
            key: "business_to_number"
          },
          {
            title: "商品名称",
            key: "commodity_name",
            ellipsis: true,
            tooltip: true
          },
          {
            title: "金额(元)",
            key: "money"
          },
          {
            title: "收/支",
            key: "in_out_money"
          },
          {
            title: "交易状态",
            key: "bussiness_state"
          },
          {
            title: "交易时间",
            render(h, params) {
              return h(
                "span",
                {
                  style: {
                    // color: "blue"
                  }
                },
                common.formatDate('yyyy-MM-dd hh:mm:ss', params.row.payment_time)
              );
            }
          }
        ],
        // 交易记录详情表头
        recordInfoHeader: [
          {
            type: 'index',
            width: 60,
            title: '序号',
            align: 'center'
          },
          {
            title: "时间",
            render(h, params) {
              return h(
                "span",
                {
                  style: {
                    // color: "blue"
                  }
                },
                common.formatDate('yyyy-MM-dd hh:mm:ss', params.row.payment_time)
              );
            }
          },
          {
            title: "来往金额",
            key: "inCountMoney",
            render(h, params) {
              return h(
                "span",
                {
                  style: {
                    // color: "blue"
                  }
                },
                `${params.row.money ? '+'+params.row.money : '0.00'}`)}
          },
        ],
        // 收入支出表头
        incomeExpendHeader: [
          {
            title: '时间',
            key: '_id'
          },
          {
            title: '收入',
            key: 'incomeValue'
          },
          {
            title: '支出',
            key: 'value',
            render (h, params) {
              return h('span', {}, `${params.row.value}`)
            }
          },
        ],
        // 收入支出数据
        incomeExpendData: []
      },
      // 列表总数
      count: 0,
      // 分页数据
      pageParams: {
        pageSize: 15,
        pageIndex: 1
      },
      // 当前行列表数据
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
          this.tableInfo.header = this.tableInfo.transactionHeader;
      } else {
          this.tableInfo.header = this.tableInfo.capitalHeader;
      }
      this.getListDataFn();
      // this.pageParams.pageIndex = 1;
    },
    clickListFn(params) {
      this.heightData = params;
      this.getRecordInfoNumberFn(params);
    },
    // 选择分页页面
    selectPageFn(page) {
      this.pageParams.pageIndex = page;
      this.getListDataFn();
    },
    // 初始化echarts
    echartsInit(xArray = [], incomeArray = [], expendArray = []) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("echarts"));
      console.log(xArray,incomeArray,expendArray);
      // 指定图表的配置项和数据
      let option = {
        // 设置鼠标悬浮提示样式
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line"
          }
        },
        legend: {
          type: 'scroll',
          left: 'right',
          data:['收入','支出'],
          pageTextStyle: {
            color: '#fff'
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
            name: '收入',  
            data: incomeArray,
            type: "line"
          },
          {
            name: '支出',
            data: expendArray,
            type: 'line',
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 获取列表数据
    getListDataFn() {
      let form = {};
      let url = '';
      if (this.btnSelect) {
          form = {
            userNumber: '513922199103056914',
            uinType: 0,
            timeSelectType: 0,
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            pageNumber: this.pageParams.pageIndex,
            pageSize: this.pageParams.pageSize
          };
          url = "/economicAnalysis/findDealConditionByUsernumber";
      } else {
          form = {
            selfNumber: '唐培',
            timeSelectType: 0,
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            pageNumber: this.pageParams.pageIndex,
            pageSize: this.pageParams.pageSize
          };
          url = "/economicAnalysis/findMoneyFlowBySelfBumber";
      }
      // 判断当前点击
      common
        .$HttpPost(url, form)
        .then(res => {
          console.log(res);
          if (+res.state === 0) {
            this.count = +res.data.count;
            // 默认选中第一行
            if (this.btnSelect) {
                res.data.deals[0]._highlight = true;
                this.heightData = res.data.deals[0];
                this.tableInfo.data = res.data.deals;
            } else {
                res.data.dealDetail[0]._highlight = true;
                this.heightData = res.data.dealDetail[0];
                this.tableInfo.data = res.data.dealDetail;
            }
            this.getRecordInfoNumberFn(this.tableInfo.data[0]);
            
            
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 获取交易详情记录
    getRecordInfoNumberFn(data) {
      let contact = {};
      let url = '';
      if (this.btnSelect) {
        url = '/economicAnalysis/findDealDetails2One';  
        contact = {
          selfNumber: data._id.self_number,
          businessToNumber: data._id.business_to_number,
          startDate: '',
          endDate: '',
          timeSelectType: 0
        };
      } else {
        url = '/economicAnalysis/findIncomeAndExpendChangeBySelfBumber';
        contact = {
          selfNumber: '唐培',
          selectType: 0,
          startDate: '',
          endDate: ''
        };
      }
      common
        .$HttpPost(url, contact)
        .then(res => {
          console.log(res);
          if (+res.state === 0) {
            if (this.btnSelect) {
              this.tableInfo.recordInfoData = res.data;
              return
            }
            let xArray = [];
            let incomeArray = [];
            let expendArray = [];
            res.data.expendCount.forEach((item, index) => {
              item.value = item.value.toFixed(2);
              xArray.push(item._id);
              expendArray.push(item.value);
              item.incomeValue = '' + res.data.inComeCount[index].value.toFixed(2);
              incomeArray.push(item.incomeValue);
            });
            // let xArray = res.data.expendCount.map(item => {
            // //   return item._id;
            // });
            // let incomeArray = res.data.map(item => {
            // //   return item.value;
            // });
            this.tableInfo.incomeExpendData = res.data.expendCount;
            this.echartsInit(xArray, incomeArray, expendArray);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取用户账号列表
    getUserAccountList () {
        common.$HttpPost('/personPortrait/findEconomicStatusByUserNumber', {
            userNumber: '513922199103056914'
        }).then(res => {
            if (+res.state === 0) {
                res.data.forEach(item => {
                    item.label = item.uin;
                    item.value = item.type;
                });
                this.personalAccountId = res.data[0].type;
                this.personalAccountList = res.data;
            }
        }).catch(err => {
            console.log(err);
        })
    },
    // 获取账户交易信息
    getTransactionInfo () {
        common.$HttpPost('economicAnalysis/findIncomeAndExpendChangeBySelfBumber',{
            selfNumber: '唐培',
            selectType: 1,
            startDate: '',
            endDate: ''
        }).then(res => {
            console.log(res)
            let xArray = res.data.expendCount.map(item => {
                return _id
            });
            let incomeArray = res.data.inComeCount.map(item => {
                return value
            });
            let expendArray = res.data.expendCount.map(item => {
                return value
            });
        }).catch(err => {
            console.log(err)
        })
    }
  },
  created () {
      this.tableInfo.header = this.tableInfo.transactionHeader;
      this.getListDataFn();
      this.getUserAccountList();
      // this.getTransactionInfo();
  }
};
</script>
<style scoped>
.economics-left {
  width: calc(100% - 600px);
}

.economics-right {
  width: 600px;
}

.w500 {
  width: 500px;
}
</style>
