<script lang="ts" setup>
import { ref } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import Detail from './detail.vue'
import request from '@admin/api/system/dict'
import download from '@admin/utils/common/download'
import useDictStore from '@admin/store/modules/dict'
import { useDict } from  '@admin/utils/common/dict'
const { sys_normal_disable } = useDict("sys_normal_disable");

const dictStore = useDictStore()
const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const loading = ref(true)
const searchForm = ref<any>({})
const ids = ref([]);
const detailDialog = ref()
const dateRange = ref([]);

function searchTable() {
  tableRef.value?.resetPage()
}
function resetTable() {
  searchForm.value = {}
  searchTable()
}
const getList = async (val: object) => {
  let params = { ...val, ...searchForm.value }
  tableData.value = []
  loading.value = true
  const [err, res] = await to(request.listType(params))
  loading.value = false
  if (err) return
  tableData.value = res.rows
  total.value = res.total
}

const handleAdd = () => {
  detailDialog.value.show()
}
const handleEdit = (row) => {
  detailDialog.value.show(row)
}

const handlleDelete = async (row?) => {
  const dictIds = row?.dictId || ids.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.delType(dictIds))
  if (err) return
  ElMessage.success('删除成功')
  searchTable()
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.dictId);
}

/** 刷新缓存按钮操作 */
async function handleRefreshCache() {
  const [err] = await to(request.refreshCache())
  if(err) return 
  ElMessage.success('刷新成功')
  dictStore.cleanDict()
}
/** 导出按钮操作 */
function handleExport() {
  download("system/dict/type/export", { ...searchForm.value, }, `dict_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="app-container">
    <div class="d-header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="searchForm.dictName" placeholder="请输入字典名称" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="searchForm.dictType" placeholder="请输入字典类型" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="字典状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-button type="primary" @click="handleAdd" icon="CirclePlus" v-hasPermi="['system:dict:add']">新增</el-button>
        <el-button type="danger" @click="handlleDelete()" icon="Delete" :disabled="ids.length === 0" v-hasPermi="['system:dict:remove']">删除</el-button>
        <el-button type="success" @click="handleExport()" icon="Download" v-hasPermi="['system:dict:export']">导出</el-button>
        <el-button type="success" @click="handleRefreshCache()" icon="Refresh" v-hasPermi="['system:dict:remove']">刷新缓存</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="dictName" label="字典名称" align="center" />
        <el-table-column label="字典类型" align="center" show-overflow-tooltip>
          <template #default="{row}">
            <router-link :to="'/system/dict/data/' + row.dictId" class="text-sky-500">{{ row.dictType }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <dict-tag :options="sys_normal_disable" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="创建时间" align="center" prop="createTime" width="190" />
        <el-table-column prop="operator" label="操作" width="160px" align="center" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button type="primary" size="small" icon="Edit" @click="handleEdit(row)"  v-hasPermi="['system:dict:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button @click="handlleDelete(row)" type="danger" size="small" icon="Delete" v-hasPermi="['system:dict:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </d-table>
    </div>
    <Detail ref="detailDialog" @search="searchTable()" />
  </div>
</template>
