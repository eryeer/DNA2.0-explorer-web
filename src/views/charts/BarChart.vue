<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

export default {
  name: 'BarChart',
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
      default: '446px',
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
      default: '#5e72e4',
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 20,
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.dataSource.map((item) => item.label),
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval:
                this.dataSource.length === 12 ? 0 : (index) => index % 4 === 0 && index !== 0,
              // rotate: 10, //-30度角倾斜显示
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(0,0,0,0.29)',
                width: 1, //这里是为了突出显示加上的
              },
            },
          },
        ],
        yAxis: {
          splitLine: {
            show: false,
            lineStyle: {
              color: ['#fff'],
              width: 1,
              type: 'solid',
            },
          },
          splitNumber: 5,
          axisLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.29)',
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        series: [
          {
            name: this.label,
            smooth: true,
            type: 'bar',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: this.primaryColor,
                  width: 3,
                },
                barBorderRadius: [2, 2, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(0, 120, 250, 0.5)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: this.primaryColor, // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            barWidth: this.dataSource.length === 12 ? 12 : 6, //柱图宽度
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
