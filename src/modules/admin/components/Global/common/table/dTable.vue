<template>
  <div>
   <div class="table-container" :class="{'none-content': data.length === 0,'border-top': !border}">
      <el-table
        :data="data"
        style="width: 100%"
        :border="border"
        v-bind="$attrs"
        v-on="$listeners"  >
        <template #empty>
          <div v-show="!loading">
            <slot name="empty"></slot>
            <div v-if="!$slots.empty">
              <img src="~@admin/assets/image/public/d_noData.png" style="width: 120px; height: 120px; margin-top: 20px" class="inline-block" alt="暂无数据">
              <div>暂无数据</div>
            </div>
          </div>
          <div v-show="loading" class="loading-box">
            <img src="~@admin/assets/image/public/d_loading.gif" alt="" class="inline-block">
          </div>
        </template>
        <el-table-column label="序号" :width="tableIndexWidth" align="center" v-if="showIndex">
          <template slot-scope="scope">
            {{ (searchInfo[pageKey]-1)*searchInfo[sizeKey] + scope.$index + 1 }}
          </template>
        </el-table-column>
        <slot/>
      </el-table>
    </div>
    <el-pagination
      v-if="total && total > 5 && $attrs['page-size'] !== 10000"
      v-show="!loading"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchInfo[pageKey]"
      :page-size="searchInfo[sizeKey]"
      :align="$attrs['align'] ||'right'"
      :page-sizes="$attrs['page-sizes'] || [5, 10,20,50]"
      :layout="$attrs['layout'] || 'total, sizes ,prev, pager, next, jumper'"
      :total="total"
      v-bind="$attrs"
      v-on="$listeners">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'dTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    border: {
      type: Boolean,
      default: false
    },
    "page-key": {
      type: String,
      default: "pageNum"
    },
    "size-key": {
      type: String,
      default: "pageSize"
    },
    "init": {
      type: Boolean,
      default: true
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    tableIndexWidth: {
      type: String,
      default: "70"
    }
  },
  data() {
    return {
      searchInfo: {},
      tableIndexProps: {}
    }
  },
  created() {
    this.searchInfo[this.pageKey] = 1
    this.searchInfo[this.sizeKey] = 10
    this.$attrs["page-size"] && (this.searchInfo[this.sizeKey] = this.$attrs["page-size"])
    this.$attrs["current-page"] && (this.searchInfo[this.pageKey] = this.$attrs["current-page"])
  },
  mounted() {
    this.init && this.$emit("update",this.searchInfo)
  },
  methods: {
    refresh() {
      this.$emit("update",this.searchInfo)
    },
    // 重置分页
    resetPage(page, size) {
      this.searchInfo[this.pageKey] = page || 1
      this.searchInfo[this.sizeKey] = size || 10
      this.$emit("update",this.searchInfo)
    },
    handleSizeChange(val) {
      this.searchInfo[this.sizeKey] = val
      this.searchInfo[this.pageKey] = 1
      this.$emit("update",this.searchInfo)
      this.$emit("handleSizeChange",val)
    },
    handleCurrentChange(val) {
      this.searchInfo[this.pageKey] = val
      this.$emit("update",this.searchInfo)
      this.$emit("handleCurrentChange",val)
    }
  }
}
</script>
<style scoped>
  .table-container {
    /* min-height: 200px; */
    position: relative;
  }
  .border-top {
    border-top: 1px solid #EBEEF5;
  }
  .el-pagination {
    margin: 10px 20px 10px 0
  }
  .loading-box  img {
    width: 190px;
    height: 190px;
  }
</style>
