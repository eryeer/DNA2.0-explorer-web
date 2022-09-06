<template>
  <el-dialog :visible.sync="visible" width="720px">
    <div slot="title">
      <div>{{ isNft? '下载数字藏品交易记录': '下载交易记录'}}</div>
      <div class="sub-title">请选择时间区间，支持下载该地址在所选区间的最近5000条交易记录</div>
    </div>
    <div class="dialog-bd">
      <div class="form">
        <div class="data-wrapper">
          <el-date-picker
            v-model="startTime"
            type="datetime"
            :clearable="false"
            value-format="timestamp"
            :picker-options="startTimePickerOptions"
          >
          </el-date-picker>
          <span class="data-separator">至</span>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            :clearable="false"
            value-format="timestamp"
            :picker-options="endTimePickerOptions"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer mb-20 mt-40 t-c">
      <el-button
        type="primary"
        style="width: 180px"
        class="common-btn"
        @click="exportCsv"
        :loading="exporting"
        :disabled="exporting"
        >下载</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'export-dialog',
  props: {
    isNft: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      visible: false,
      exporting: false,
      startTime: new Date().setHours(0, 0, 0, 0),
      endTime: Date.now(),
      startTimePickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
        selectableRange: [],
      },
      endTimePickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
        selectableRange: [],
      },
    };
  },
  watch: {
    startTime: {
      handler(val) {
        this.setOptions(val, this.startTimePickerOptions);
      },
      immediate: true,
    },
    endTime: {
      handler(val) {
        this.setOptions(val, this.endTimePickerOptions);
      },
      immediate: true,
    },
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    setOptions(val, options) {
      if (val >= new Date().setHours(0, 0, 0, 0)) {
        options.selectableRange = `00:00:00 - ${this.$options.filters.filterDate(
          Date.now(),
          'hh:mm:ss',
        )}`;
      } else {
        options.selectableRange = `00:00:00 - 23:59:59`;
      }
    },
    async exportCsv() {
      let captcha = null;
      const captchResult = await new Promise((resolve, reject) => {
        captcha = new TencentCaptcha('194416799', function callback(res) {
          if (res.ticket) {
            resolve(res);
          } else {
            reject(res.errorMessage);
          }
        });
        captcha.show();
      });
      captcha.destroy();
      const { ticket, randstr: randomStr } = captchResult;
      if (this.startTime > this.endTime) {
        const tmp = this.startTime;
        this.startTime = this.endTime;
        this.endTime = tmp;
      }

      this.exporting = true;

      const baseURL = "http://121.4.146.202:8701/explorer" || process.env.VUE_APP_BASE_API;
      const queryUrl = `${baseURL}${this.isNft ? '/address/downloadTransferList': '/address/downloadTransactionList'}`

      try {
        const response = await axios.post(
          queryUrl,
          {
            address: this.$route.params.address,
            startTime: this.startTime,
            endTime: this.endTime,
            ticket,
            randomStr,
          },
          { timeout: 0, responseType: 'blob' },
        );
        const url = URL.createObjectURL(new Blob([response.data]), { type: 'text/csv;charset=utf-8;'});
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export-${this.$route.params.address}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        this.exporting = false;
      } catch (error) {
        this.exporting = false;
        this.$message({
          message: error || '导出失败，请重试',
          type: 'error',
        });
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sub-title {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;

  opacity: 0.6;
  margin-top: 20px;
}

.data-wrapper {
  display: flex;
  justify-content: space-between;
  width: 665px;
  max-width: 100%;

  .data-separator {
    line-height: 60px;
    width: 55px;
    font-size: 14px;

    opacity: 0.6;
    text-align: center;
  }
}
.form {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-right: 10px;

  ::v-deep .el-input__inner {
    border: none;
    background-color: transparent;
    height: 60px;
    padding: 0;
    position: relative;
    color: #000000;

    opacity: 0.6;
  }

  ::v-deep .el-date-editor {
    width: initial;
    &::before {
      content: ' ';
      display: inline-block;
      left: 23.33px;
      width: 25.33px;
      height: 25.33px;
      background-image: url('~@/assets/images/calender.svg');
      position: absolute;
      top: 17.33px;
      z-index: 1;
    }

    .el-input__inner {
      width: 280px;
      height: 60px;
      padding-left: 62px;
      text-align: left;
      box-sizing: border-box;
      background: #fafafa;
      border: 1px solid #f2f2f2;
      border-radius: 4px;
    }
    .el-input__icon,
    .el-input__close-icon {
      display: none;
    }
  }
}
</style>
