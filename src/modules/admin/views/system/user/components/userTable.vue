<script lang="ts" setup>
import { ElMessageBox, ElTree, FormInstance, ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref, watch } from 'vue'
// import { userData } from '@/mock/system'
import UserDialog from './userDialog.vue'
import request from '@admin/api/system/user'
import to from 'await-to-js'
import download from '@admin/utils/common/download'

interface Tree {
  id: string
  deptName: string
  orderNo?: number
  createTime?: string
  remark?: string
  status?: boolean
  children?: Tree[]
}
const deptOptions = ref<Tree[]>([])
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const ids = ref([]);
const multiple = ref(true);

const tableData = ref([])
const statusOptions = ref([])
const total = ref(0)
const userDialog = ref()
const ruleFormRef = ref<FormInstance>()
const tableRef = ref()
const formInline = ref<any>({})
const loading = ref(true)

// 部门tree
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
/** 通过条件过滤节点  */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.deptName.includes(value)
}

function handleNodeClick(val) {
  formInline.value.deptId = val.id
  searchTable()
}

function searchTable() {
  tableRef.value.resetPage()
}
function resetTable() {
  formInline.value = {}
  searchTable()
}
const getList = async (val) => {
  let params = { ...val, ...formInline.value }
  tableData.value = []
  loading.value = true
  const [err, res] = await to(request.getUserList(params))
  console.log(1);
  loading.value = false
  if (err) return
  tableData.value = res.rows
  total.value = res.total
}
const addHandler = () => {
  userDialog.value.show()
}
const editHandler = (row) => {
  userDialog.value.show(row)
}
const del = async (userId?: string | number) => {
  const userIds = userId || ids.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }))
  if(confirm) return
  const [err, res] = await to(request.delUser(userIds))
  if(err) return
  ElMessage.success('删除成功')
  searchTable()
}

function handleResetPwd(row) {
  ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
  }).then(({ value }) => {
    request.resetUserPwd(row.userId, value).then(response => {
      ElMessage.success("修改成功，新密码是：" + value);
    });
  }).catch(() => {});
};

/** 导出按钮操作 */
function handleExport() {
  download("system/user/export", {
    ...formInline.value,
  },`user_${new Date().getTime()}.xlsx`);
};

const changeStatus = (row) => {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox.confirm(
    `确定要${text} ${row.userName} 用户吗？`, '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  },).then(async () => {
    return request.changeUserStatus(row.userId, row.status)
  }).then(() => {
    ElMessage.success(text + "成功");
  }).catch(() => {
    row.status = row.status === "0" ? "1" : "0";
  })
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.userId);
  multiple.value = !selection.length;
};

onMounted(() => {
  init()
})
async function init() {
  const requests = [
    request.getDicts('sys_normal_disable'),
    request.getTreeData()
  ]
  const [err, res] = await to(Promise.all(requests))
  if (err) return
  statusOptions.value = res[0].data
  deptOptions.value = res[1].data
}

</script>

<template>
  <el-card class="m-dept-side">
    <div class="title">部门列表</div>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" class="filter-search" />
    <div class="filter-tree">
      <el-scrollbar class="scrollbar">
        <el-tree ref="treeRef" :data="deptOptions" :props="{ label: 'label', children: 'children' }" node-key="id"
          highlight-current default-expand-all :filter-node-method="filterNode" @node-click="handleNodeClick" />
      </el-scrollbar>
    </div>
  </el-card>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item label="账户名称">
          <el-input v-model="formInline.username" placeholder="请输入账户名称" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="formInline.phonenumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.status" placeholder="用户状态" clearable>
            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:">
          <d-date-picker v-model="formInline.date" v-model:beginDate="formInline['params[beginTime]']"
            v-model:endDate="formInline['params[endTime]']" type="daterange" value-format="YYYY-MM-DD"
            start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable" :icon="Search">查询</el-button>
          <el-button icon="Refresh" @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="util">
        <el-button type="primary" plain icon="CirclePlus" @click="addHandler" v-hasPermi="['system:user:add']">新增用户</el-button>
        <el-button type="danger" plain icon="Delete" :disabled="multiple"  @click="del()" v-hasPermi="['system:user:remove']">删除</el-button>
        <!-- <el-button type="info" plain icon="Upload" @click="handleImport()" v-hasPermi="['system:user:import']">导入</el-button> -->
        <el-button type="success" plain icon="Download" @click="handleExport()" v-hasPermi="['system:user:export']">导出</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="userId" label="用户编号" align="center" />
        <el-table-column prop="userName" label="账户名称" align="center" />
        <el-table-column prop="nickName" label="用户姓名" align="center" />
        <el-table-column prop="dept.deptName" label="部门" align="center" />
        <el-table-column prop="phonenumber" label="手机号码" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="changeStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="190" />
        <el-table-column prop="operator" label="操作" width="160px" align="center" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top" v-if="row.userId !== 1">
              <el-button type="primary" size="small" icon="Edit" @click="editHandler(row)" v-hasPermi="['system:user:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="row.userId !== 1">
              <el-button @click="del(row.userId)" type="danger" size="small" icon="Delete" v-hasPermi="['system:user:remove']"></el-button>
            </el-tooltip>
            <el-tooltip content="重置密码" placement="top" v-if="row.userId !== 1">
              <el-button @click="handleResetPwd(row)" size="small" icon="Pointer" v-hasPermi="['system:user:resetPwd']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </d-table>
    </div>

    <UserDialog ref="userDialog" :deptOptions="deptOptions" @search="searchTable()"/>
  </div>
</template>

<style lang="scss" scoped>
@import "../index";
</style>
