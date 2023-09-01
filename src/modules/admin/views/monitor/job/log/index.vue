<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import request from '@admin/api/monitor/job'
import download from '@admin/utils/common/download'
import { useDict } from '@admin/utils/common/dict'
import { useRoute } from 'vue-router'
const route = useRoute()
const { sys_job_group, sys_common_status } = useDict("sys_job_group", "sys_common_status");

const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const loading = ref(false)
const searchForm = ref<any>({})
const detailForm = ref<any>({})
const ids = ref([]);
const isDetailDialog = ref(false);

onMounted(async () => {
  const jobId = route.params?.jobId;
  if (jobId && jobId !== '0') {
    const [err, res] = await to(request.getJob(jobId))
    if (err) return
    searchForm.value.jobName = res.data.jobName
    searchForm.value.jobGroup = res.data.jobGroup
    searchTable()
  } else {
    searchTable()
  }
})

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
  const [err, res] = await to(request.listJobLog(params))
  loading.value = false
  if (err) return
  tableData.value = res.rows
  total.value = res.total
}


const handleView = (row:  any) => {
  detailForm.value = row
  isDetailDialog.value = true
}

const handlleDelete = async () => {
  const jobLogIds = ids.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除字典编号为"' + jobLogIds + '"的数据项?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.delJobLog(jobLogIds))
  if (err) return
  ElMessage.success('删除成功')
  searchTable()
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.jobLogId);
}

/** 清空按钮操作 */
async function handleClean() {
  const [confirm] = await to(ElMessageBox.confirm('是否确认清空所有调度日志数据项?', '温馨提示', {
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.cleanJobLog())
  if (err) return
  ElMessage.success('清空成功')
  searchTable()
}

/** 导出按钮操作 */
function handleExport() {
  download("monitor/jobLog/export", { ...searchForm.value, }, `job_log_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="searchForm.jobName" placeholder="请输入任务名称" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroup">
          <el-select v-model="searchForm.jobGroup" placeholder="请选择" clearable @change="searchTable">
            <el-option v-for="dict in sys_job_group" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable @change="searchTable">
            <el-option v-for="dict in sys_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
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
          v-hasPermi="['monitor:job:remove']">删除</el-button>
        <el-button type="danger" @click="handleClean()" icon="Delete" v-hasPermi="['monitor:job:remove']">清空</el-button>
        <el-button type="success" @click="handleExport()" icon="Download"
          v-hasPermi="['monitor:job:export']">导出</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :init="false" :loading="loading" @update="getList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="日志编号" align="center" prop="jobLogId" />
        <el-table-column label="任务名称" align="center" prop="jobName" show-overflow-tooltip />
        <el-table-column label="任务组名" align="center" prop="jobGroup" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="sys_job_group" :value="scope.row.jobGroup" />
          </template>
        </el-table-column>
        <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" show-overflow-tooltip />
        <el-table-column label="日志信息" align="center" prop="jobMessage" show-overflow-tooltip />
        <el-table-column label="执行状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_common_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="执行时间" align="center" prop="createTime" width="190"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template #default="{row}">
            <el-button link type="primary" icon="View" @click="handleView(row)"
              v-hasPermi="['monitor:job:query']">详细</el-button>
          </template>
        </el-table-column>
      </d-table>
    </div>
    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" v-model="isDetailDialog" width="50%" class="d-dialog" append-to-body>
      <el-form :model="detailForm" label-width="100px">   
        <el-row>
          <el-col :lg="12" :span="24">
            <el-form-item label="日志序号：">{{ detailForm.jobLogId }}</el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="任务名称：">{{ detailForm.jobName }}</el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="任务分组：">{{ detailForm.jobGroup }}</el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="执行时间：">{{ detailForm.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ detailForm.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ detailForm.jobMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="detailForm.status == 0">正常</div>
              <div v-else-if="detailForm.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="detailForm.status == 1">{{ detailForm.exceptionInfo }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDetailDialog = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
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
}
</style>
