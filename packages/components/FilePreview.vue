<template>
  <div title="文件预览">
    <div class="img">
      <el-image :src="url" :preview-src-list="[url]" v-if="!isPdf" fit="contain">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline f-48"></i>
        </div>
      </el-image>
      <div v-else @click="download" class="pdf">
        <a :href="url" :download="name" target="_blank">
          <img src="~@/assets/images/pdf.svg" width="48" height="48" class="mb-10" />
          <div class="f-12">{{ name | filterWordCount(12) }}</div>
        </a>
      </div>
      <!-- <el-dialog :visible.sync="dialogVisible" width="80%" :show-close="false" v-if="isPdf">
        <div class="protocol-content" v-loading="loading">
          <div v-for="i in numPages" :key="i">
            <pdf :src="url" :page="i" style="max-width: 100%"></pdf>
            <div class="f-12 mt-20 mb-20 t-c">{{ i }} / {{ numPages }} 页</div>
          </div>
        </div>
        <div slot="footer" class="t-c">
          <el-button type="primary" @click="dialogVisible = false" class="w-120">确 定</el-button>
        </div>
      </el-dialog> -->
    </div>
    <div class="tip" v-if="tip">{{ tip }}</div>
  </div>
</template>

<script>
// import pdf from 'vue-pdf';

export default {
  name: 'FilePreview',
  props: {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    tip: {
      type: String,
    },
  },
  data() {
    return {
      isPdf: false,
      dialogVisible: false,
      numPages: 1,
      loading: false,
    };
  },
  methods: {
    download() {},
  },
  watch: {
    url: {
      handler: async function () {
        if (this.name && this.name.toLowerCase().endsWith('.pdf')) {
          this.isPdf = true;
          // this.loading = true;
          // try {
          //   const { numPages } = await pdf.createLoadingTask(this.url).promise;
          //   this.numPages = numPages;
          //   this.loading = false;
          // } catch (error) {
          //   this.loading = false;
          // }
        }
      },
    },
  },
  // async created() {},
};
</script>

<style lang="scss" scoped>
.img {
  width: 160px;
  height: 160px;
  background: #fafafa;
  border: 1px solid #f2f2f2;
  transition: 0.3s linear border-color;
  cursor: pointer;

  &:hover {
    border-color: darken(#f2f2f2, 10);
  }
  ::v-deep {
    .el-image {
      width: 158px;
      height: 158px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.tip {
  text-align: center;
  opacity: 0.6;
}

.pdf {
  > a {
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: rgba(0, 0, 0, 0.59);
  }
}

.protocol-content {
  max-height: 60vh;
  overflow: auto;
  @include scroll-bar();
}

.el-icon-picture-outline {
  color: #c3cbd6;
}
</style>
