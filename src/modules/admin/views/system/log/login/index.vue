<script lang="ts" setup>
import { ref } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import request from '@admin/api/system/log'
import download from '@admin/utils/common/download'
import { useDict } from  '@admin/utils/common/dict'
const { sys_normal_disable } = useDict("sys_normal_disable");

const defaultSort = ref({ prop: "loginTime", order: "descending" });
const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const loading = ref(true)
const searchForm = ref<any>({})
const ids = ref([]);
const selectName = ref([]);
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
  const [err, res ] = await to(request.loginlist(params))
  loading.value = false
  if (err) return
  tableData.value = res.rows
  total.value = res.total
}

/** 排序触发事件 */
function handleSortChange(column) {
  searchForm.value.orderByColumn = column.prop;
  searchForm.value.isAsc = column.order;
  searchTable();
}

const handlleDelete = async (row?) => {
  const infoIds = row?.infoId || ids.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', '系统提示', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.delLogininfor(infoIds))
  if (err) return
  ElMessage.success('删除成功')
  searchTable()
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.infoId);
  selectName.value = selection.map(item => item.userName);
}

/** 清空按钮操作 */
async function handleClean() {
  const [confirm] = await to(ElMessageBox.confirm("是否确认清空所有登录日志数据项?", '系统提示', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.cleanLogininfor())
  if (err) return
  ElMessage.success('清空成功')
  searchTable()
}
/** 解锁按钮操作 */
async function handleUnlock() {
  const username = selectName.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm(`是否确认解锁用户${username}数据项?`, '系统提示', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.unlockLogininfor(username))
  if (err) return
  ElMessage.success(`用户"${username }解锁成功`)
  searchTable()
}

/** 导出按钮操作 */
function handleExport() {
  download("monitor/logininfor/export", { ...searchForm.value, }, `config_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="登录地址" prop="ipaddr">
          <el-input v-model="searchForm.ipaddr" placeholder="请输入登录地址" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名称" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="登录状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录时间">
          <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
            start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
          v-hasPermi="['monitor:logininfor:remove']">删除</el-button>
        <el-button type="danger" @click="handleClean()" icon="Delete"
          v-hasPermi="['monitor:logininfor:remove']">清空</el-button>
        <el-button type="primary" @click="handleUnlock()" icon="Unlock"
          v-hasPermi="['monitor:logininfor:unlock']">解锁</el-button>
        <el-button type="success" @click="handleExport()" icon="Download"
          v-hasPermi="['monitor:logininfor:export']">导出</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList"
        @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="infoId" label="访问编号" align="center" />
        <el-table-column label="用户名称" align="center" prop="userName" show-overflow-tooltip sortable="custom" :sort-orders="['descending', 'ascending']" />
        <el-table-column label="地址" align="center" prop="ipaddr" show-overflow-tooltip />
         <el-table-column label="登录地点" align="center" prop="loginLocation" show-overflow-tooltip />
         <el-table-column label="操作系统" align="center" prop="os" show-overflow-tooltip />
         <el-table-column label="浏览器" align="center" prop="browser" show-overflow-tooltip />
        <el-table-column label="登录状态" align="center">
          <template #default="{ row }">
            <dict-tag :options="sys_normal_disable" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="msg" show-overflow-tooltip/>
        <el-table-column label="访问时间" align="center" prop="loginTime" width="190" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      </d-table>
    </div>
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
