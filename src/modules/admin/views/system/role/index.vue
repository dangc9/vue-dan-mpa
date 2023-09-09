<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import to from 'await-to-js'
import request from '@admin/api/system/role'
import RoleDialog from './roleDialog.vue'
import download from '@admin/utils/common/download'
import { useDict } from  '@admin/utils/common/dict'
const { sys_normal_disable } = useDict("sys_normal_disable");

const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const loading = ref(true)
const formInline = ref<any>({})
const dateRange = ref([]);
const ids = ref([]);
const roleDialog = ref()

function searchTable() {
  tableRef.value?.resetPage()
}
function resetTable() {
  formInline.value = {}
  searchTable()
}
const getList = async (val) => {
  let params = { ...val, ...formInline.value }
  tableData.value = []
  loading.value = true
  const [err, res] = await to(request.listRole(params))
  loading.value = false
  if (err) return
  tableData.value = res.rows
  total.value = res.total
}

const addHandler = () => {
  roleDialog.value.show()
}
const editHandler = (row) => {
  roleDialog.value.show(row)
}

const del = async (row?) => {
  const roleIds = row?.roleId || ids.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.delRole(roleIds))
  if (err) return
  ElMessage.success('删除成功')
  searchTable()
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.roleId);
}
const changeStatus = (row) => {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox.confirm(
    `确定要${text} ${row.roleName} 角色吗？`, '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  },).then(async () => {
    return request.changeRoleStatus(row.roleId, row.status)
  }).then(() => {
    ElMessage.success(text + "成功");
  }).catch(() => {
    row.status = row.status === "0" ? "1" : "0";
  })
}
/** 导出按钮操作 */
function handleExport() {
  download("system/role/export", { ...formInline.value, }, `role_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="app-container">
    <div class="d-header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formInline.roleName" placeholder="请输入角色名称" clearable @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="formInline.roleKey" placeholder="请输入权限字符" clearable @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" style="width: 308px">
          <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
            start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="d-content">
      <div class="util">
        <el-button type="primary" @click="addHandler" icon="CirclePlus" v-hasPermi="['system:role:add']">新增角色</el-button>
        <el-button type="danger" @click="del()" icon="Delete" :disabled="ids.length === 0"
          v-hasPermi="['system:role:remove']">删除</el-button>
        <el-button type="success" @click="handleExport()" icon="Download"
          v-hasPermi="['system:role:export']">导出</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="roleId" label="角色编号" align="center" />
        <el-table-column prop="roleName" label="角色名称" align="center" />
        <el-table-column prop="roleKey" label="权限字符" align="center" />
        <el-table-column prop="roleSort" label="显示顺序" align="center" />
        <el-table-column label="状态" align="center" width="150">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="changeStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="190" />
        <el-table-column prop="operator" label="操作" width="160px" align="center" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top" v-if="row.roleId !== 1">
              <el-button type="primary" size="small" icon="Edit" @click="editHandler(row)"
                v-hasPermi="['system:user:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="row.roleId !== 1">
              <el-button @click="del(row)" type="danger" size="small" icon="Delete"
                v-hasPermi="['system:user:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </d-table>
    </div>
    <RoleDialog ref="roleDialog" @search="searchTable()" />
  </div>
</template>
