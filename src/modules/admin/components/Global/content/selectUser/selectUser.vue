<template>
  <div>
    <div class="content">
      <div class="select-tree">
        <el-form>
          <el-form-item>
            <el-input v-model="filterText" size="mini" placeholder="部门过滤"/>
          </el-form-item>
        </el-form>
        <el-scrollbar class="content-scrollbar">
          <el-tree
            v-show="deptOptions.length > 0"
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"/>
          <el-skeleton :rows="12" animated v-show="deptOptions.length === 0" class="list-group-item"/>
        </el-scrollbar>
      </div>
      <div class="user-content">
        <el-form>
          <el-form-item>
            姓名：<el-input v-model="searchInfo.nickName" size="mini" style="width: 200px" placeholder="姓名" @input="userNameInput"/>
          </el-form-item>
        </el-form>
        <el-scrollbar class="content-scrollbar">
          <d-table
            class="d-table-default"
            ref="d_table"
            border
            size="small"
            :total="total"
            :data="userList"
            :page-size="10000"
            :loading="isLoading"
            @row-click="rowClick"
            @update="getUserList">
            <el-table-column prop="nickName" label="用户姓名"  align="center"></el-table-column>
            <el-table-column prop="userName" label="账号名称"  align="center"></el-table-column>
            <el-table-column prop="dept.deptName" label="部门"  align="center"></el-table-column>
            <el-table-column prop="phonenumber" label="手机号码"  align="center"></el-table-column>
            <el-table-column label="是否选择"  align="center">
              <template #default="{row}">
                <div class="status">
                  <el-icon :class="[getSelectedStatus(row) && 'active' , 'selected-icon']"><component :is="getSelectedStatus(row) ? 'SuccessFilled' : 'CircleCheck'" /></el-icon>
                  {{ getSelectedStatus(row) ? '已选择' : '未选择' }}
                </div>
              </template>
            </el-table-column>
          </d-table>
        </el-scrollbar>
      </div>
    </div>
    <div class="action-contianer">
      <div class="limit-describe">
        <span v-if="limit >= 99"> <i :class="icon"></i> 可选多个成员</span>
        <span v-if="limit === 1"> <i :class="icon"></i> 选择单个成员</span>
        <span v-if="limit > 1 && limit < 99"> <i :class="icon"></i> 可选{{limit}}名成员</span>
      </div>
      <el-button size="mini" type="primary" @click="confirmClick">确认</el-button>
      <el-button size="mini" @click="selectedMember = []">清空</el-button>
      <el-button v-if="isSelectAll" size="mini" @click="selectAll">选择全部</el-button>
    </div>
    <div class="selected-list">
      <el-tag
        v-for="(item, index) in selectedMember"
        :key="index"
        closable
        @close="cancelSelected(item)">
        {{ item.name }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import request from "@admin/api/system/user";
export default {
  props: {
    limit: {
      type: Number,
      default: 10000
    },
    value: {
      type: Array,
      default: []
    },
    searchList: {
      type: Object,
      default: () => { return {} }
    },
    doubleClick: {
      type: Boolean,
      default: true
    },
    icon: String,
    isSelectAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      isDialog: true,
      clickTime: undefined,
      filterText: "",
      total: 0,
      userList: [],
      deptOptions: [],
      selectedMember: JSON.parse(JSON.stringify(this.value)),
      searchInfo: { ...this.searchList },
      defaultProps: {
        children: "children",
        label: "label"
      },
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      request.getTreeData().then(response => {
        this.deptOptions = response.data.data;
      });
    },
    selectTable() {
      this.$refs.d_table.resetPage()
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(val) {
      this.searchInfo.deptId = val.id;
      this.selectTable();
    },
    getUserList(val) {
      this.isLoading = true
      this.userList = []
      request.getUserList({ ...val, ...this.searchInfo }).then(res => {
        res.data.rows.forEach( item => {
          item.id = item.userId
          item.name = item.userName
        })
        this.userList = res.data.rows;
        this.total = res.data.total;
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      })
    },
    userNameInput(val) {
      this.selectTable();
    },
    rowClick(val) {
      const index = this.selectedMember.findIndex(item => item.id === val.id)
      const item = { ...val, ...{ id: val.userId, name: val.nickName } }
      // 双击事件
      const now = new Date().getTime()
      if(this.doubleClick && this.limit === 1 && this.clickTime && now - this.clickTime < 0.5*1000) {
        if(this.selectedMember.length === 0 || this.selectedMember[0]?.id === item.id) {
          this.selectedMember = [item]
          this.confirmClick()
          return
        }
      }
      this.clickTime = now
      // 校验
      if( this.selectedMember?.length >= this.limit && index === -1 ) {
        this.limit === 1 ? (this.selectedMember = [item]) : this.$message.info(`最多选择${this.limit}个成员！`)
        return
      }
      index !== -1 ? this.selectedMember.splice(index, 1) : this.selectedMember.push(item)
    },
    selectAll() {
      this.selectedMember = this.userList.map(item => {
        return { ...item, ...{ id: item.userId, name: item.nickName } }
      })
    },
    confirmClick() {
      this.$emit('close')
      this.$emit('selected', this.selectedMember)
    },
    cancelSelected(val,a) {
      const index = this.selectedMember.findIndex(item => item.id === val.id)
      this.selectedMember.splice(index, 1)
    },
    getSelectedStatus(val) {
      return !!this.selectedMember.find(item => parseInt(item.id) === parseInt(val.id))
    }
  },
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
  .content-scrollbar {
    height: 400px;
    width: max-content;
    min-width: 100%;
  }
  .select-tree {
    width: 250px;
    padding: 10px;
    border-right: 1px solid var(--el-border-color);
  }
  .user-content {
    width: calc(100% - 250px);
    padding: 10px;
  }
  .selected-icon {
    font-size: 16px;
  }
  .active {
    color: var(--el-color-primary);
  }
  .el-form-item {
    margin-bottom: 5px;
  }
}
.action-contianer {
  margin: 10px 0 2px 0;
  overflow: hidden;
  .el-button {
    float: right;
    margin-left: 10px;
  }
  .limit-describe {
    float: left;
    font-size: 14px;
    margin-left: 10px;
    span {
      line-height: 28px;
    }
  }
}
.selected-list {
  min-height: 58px;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
  .el-tag {
    margin: 4px 15px 4px 0;
  }
}
.status {
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    margin-right: 4px;
  }
}
// :deep {
//   .el-dialog__header {
//     padding: 10px 20px 0 20px;
//   }
//   .el-dialog__body {
//     padding-top: 0;
//   }
//   .el-skeleton__paragraph {
//     margin-top: 10px;
//   }
//   .el-scrollbar__wrap {
//     overflow-x: hidden;
//   }
//   .el-input__inner {
//     border-color: #DCDFE6 !important;
//   }
//   table tr {
//     cursor: pointer;
//   }
// }
</style>