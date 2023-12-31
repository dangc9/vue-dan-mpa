<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, nextTick } from 'vue'
import to from 'await-to-js'
import request from '@admin/api/system/dept'
import deptDialog from './deptDialog.vue'
import download from '@admin/utils/common/download'
import { handleTree } from '@admin/utils/common/content'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import { useDict } from  '@admin/utils/common/dict'
const { sys_normal_disable } = useDict("sys_normal_disable");

const tableData = ref([])
const loading = ref(true)
const searchForm = ref<any>({})
const isExpandAll = ref(true);
const refreshTable = ref(true);
const ids = ref([]);
const DeptDialog = ref()

const getList = async () => {
  let params = { ...searchForm.value }
  loading.value = true
  const [err, { data }] = await to(request.listDept(params))
  loading.value = false
  if (err) return
  tableData.value = handleTree(data, "deptId");
}
getList()

function resetTable() {
  searchForm.value = {}
  getList()
}

const addHandler = (row: object) => {
  DeptDialog.value.show('add', row)
}
const editHandler = (row: object) => {
  DeptDialog.value.show('edit',row)
}

const del = async (row: any) => {
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.delDept(row.deptId))
  if (err) return
  ElMessage.success('删除成功')
  getList()
}

/** 导出按钮操作 */
function handleExport() {
  download("system/role/export", { ...searchForm.value, }, `role_${new Date().getTime()}.xlsx`);
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
</script>

<template>
  <div class="app-container">
    <div class="d-header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="searchForm.deptName" placeholder="请输入部门名称" @keyup.enter="getList()" />
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList()" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="d-content">
      <div class="util">
        <el-button type="primary" @click="addHandler" icon="CirclePlus" v-hasPermi="['system:dept:add']">新增部门</el-button>
        <el-button type="info" plain :icon=" !isExpandAll ?  'FolderOpened' : 'Folder' "  @click="toggleExpandAll">{{  !isExpandAll ? "展开" : "折叠" }}</el-button>
      </div>
      <el-table 
        v-if="refreshTable"
        v-loading="loading" 
        :data="tableData" 
        border 
        row-key="deptId"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="deptName" label="部门名称"/>
        <el-table-column prop="orderNum" label="排序" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="{ row }">
            <dict-tag :options="sys_normal_disable" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="180" prop="createTime">
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="170px" align="center" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="新增" placement="top" v-if="row.roleId !== 1">
              <el-button type="primary" size="small" icon="Plus" @click="addHandler(row)"
                v-hasPermi="['system:user:edit']"></el-button>
            </el-tooltip>
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
      </el-table>
    </div>
    <deptDialog ref="DeptDialog" @search="getList()" />
  </div>
</template>