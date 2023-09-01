<script lang="ts" setup>
import { ref } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import Detail from './detail.vue'
import request from '@admin/api/system/log'
import download from '@admin/utils/common/download'
import { useDict } from '@admin/utils/common/dict'
const { sys_normal_disable, sys_oper_type } = useDict("sys_normal_disable", "sys_oper_type");
const defaultSort = ref({ prop: "operTime", order: "descending" });

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
  const [err, { data }] = await to(request.operlist(params))
  loading.value = false
  if (err) return
  tableData.value = data.rows
  total.value = data.total
}

const handleView = (row) => {
  detailDialog.value.show(row)
}

const handlleDelete = async (row?) => {
  const operIds = row?.operId || ids.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', '系统提示', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.delOperlog(operIds))
  if (err) return
  ElMessage.success('删除成功')
  searchTable()
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.operId);
}

/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  searchForm.value.orderByColumn = column.prop;
  searchForm.value.isAsc = column.order;
  searchTable();
}

/** 清空按钮操作 */
async function handleClean() {
  const [confirm] = await to(ElMessageBox.confirm("是否确认清空所有操作日志数据项?",'系统提示', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.cleanOperlog())
  if (err) return
  ElMessage.success('清空成功')
  searchTable()
}

/** 导出按钮操作 */
function handleExport() {
  download("monitor/operlog/export", { ...searchForm.value, }, `config_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="系统模块" prop="title">
          <el-input v-model="searchForm.title" placeholder="请输入系统模块" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="操作人员" prop="operName">
          <el-input v-model="searchForm.operName" placeholder="请输入操作人员" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="类型" prop="businessType">
          <el-select v-model="searchForm.businessType" placeholder="操作类型" clearable @change="searchTable()">
            <el-option v-for="dict in sys_oper_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable @change="searchTable()">
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-"
            start-placeholder="开始日期" end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="util">
        <el-button type="danger" @click="handlleDelete()" icon="Delete" :disabled="ids.length === 0"
          v-hasPermi="['monitor:operlog:remove']">删除</el-button>
        <el-button type="danger" @click="handleClean()" icon="Delete"
          v-hasPermi="['monitor:operlog:remove']">清空</el-button>
        <el-button type="success" @click="handleExport()" icon="Download"
          v-hasPermi="['monitor:operlog:export']">导出</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList"
        :default-sort="defaultSort" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="operId" label="日志编号" align="center" />
        <el-table-column prop="title" label="系统模块" align="center" show-overflow-tooltip />
        <el-table-column label="操作类型" align="center" prop="businessType">
          <template #default="{ row }">
            <dict-tag :options="sys_oper_type" :value="row.businessType" />
          </template>
        </el-table-column>
        <el-table-column label="操作人员" align="center" width="110" prop="operName" :show-overflow-tooltip="true"
          sortable="custom" :sort-orders="['descending', 'ascending']" />

        <el-table-column prop="operIp" label="主机" align="center" show-overflow-tooltip />
        <el-table-column label="操作状态" align="center">
          <template #default="{ row }">
            <dict-tag :options="sys_normal_disable" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作日期" align="center" prop="operTime" width="190"  sortable="custom" :sort-orders="['descending', 'ascending']"/>
        <el-table-column label="消耗时间" align="center" prop="costTime" width="110" :show-overflow-tooltip="true"
          sortable="custom" :sort-orders="['descending', 'ascending']">
          <template #default="scope">
            <span>{{ scope.row.costTime }}毫秒</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="120px" align="center" fixed="right">
          <template #default="{ row, index }">
            <el-button plain type="primary" icon="Document" @click="handleView(row)"
              v-hasPermi="['monitor:operlog:query']">详情</el-button>
          </template>
        </el-table-column>
      </d-table>
    </div>
    <Detail ref="detailDialog" @search="searchTable()" />
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  padding: 16px 16px 0px 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}

.footer {
  flex: 1;
  display: flex;
  padding: 16px;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  background: white;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  position: relative;
  box-sizing: border-box;

  .util {
    margin-bottom: 15px;
    display: flex;
    flex-shrink: 0;
  }

  .table-inner {
    flex: 1;
    position: relative;
  }

  .table {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%
  }
}</style>
