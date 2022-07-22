<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';
function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

export default {
  name: 'CLineChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '160px',
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '',
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    primaryColor: {
      type: String,
      default: '#0078FA',
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    dataSource: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions();
    },
    setOptions() {
      this.chart.setOption({
        xAxis: {
          data: this.dataSource.map((item) => item.label),
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLabel: {
            // interval: this.dataSource.length === 12 ? 0 : (index) => index % 4 === 0 && index !== 0,
            // rotate: 10, //-30度角倾斜显示
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.29)',
              width: 1, //这里是为了突出显示加上的
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(255, 255, 255, 0.04)'],
              width: 1,
              type: 'solid',
            },
          },
          splitNumber: 5,
        },
        grid: {
          left: 0,
          right: 20,
          bottom: 0,
          top: 20,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          padding: [0, 0],
        },
        yAxis: {
          min: Math.min(...this.dataSource.map((item) => item.value)),
          max: Math.max(...this.dataSource.map((item) => item.value)),
          axisLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.29)',
              width: 1, //这里是为了突出显示加上的
            },
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: ['#fff'],
              width: 1,
              type: 'solid',
            },
          },
          splitNumber: 5,
          axisLabel: {
            formatter: function (value) {
              return nFormatter(value);
            },
          },
        },
        legend: {
          data: [''],
        },
        series: [
          {
            name: this.label,
            smooth: false,
            type: 'line',
            itemStyle: {
              normal: {
                color: this.primaryColor,
                lineStyle: {
                  color: this.primaryColor,
                  width: 1,
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: this.primaryColor, // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
            },
            data: this.dataSource.map((item) => item.value),
            animationDuration: 1000,
            animationEasing: 'quadraticOut',
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chart {
  margin-top: -12px;
}
</style>
