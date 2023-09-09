<script lang="ts" setup>
import { ref } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import Handle from './handle.vue'
import request from '@admin/api/monitor/job'
import download from '@admin/utils/common/download'
import { useDict } from '@admin/utils/common/dict'
import { selectDictLabel } from '@admin/utils/ruoyi/index'
import { useRouter } from 'vue-router'
const router = useRouter()
const { sys_job_group, sys_job_status } = useDict("sys_job_group", "sys_job_status");

const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const loading = ref(true)
const searchForm = ref<any>({})
const detailForm = ref<any>({})
const ids = ref([]);
const handleDialog = ref()
const isDetailDialog = ref(false)

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
  const [err, res] = await to(request.listJob(params))
  loading.value = false
  if (err) return
  tableData.value = res.rows
  total.value = res.total
}

const handleAdd = () => {
  handleDialog.value.show()
}
const handleEdit = (row) => {
  handleDialog.value.show(row)
}
function handleJobLog(row?: any) {
  const jobId = row?.jobId || 0;
  router.push('/monitor/job/log/' + jobId)
}

// 任务状态修改
function handleStatusChange(row) {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox.confirm('确认要"' + text + '""' + row.jobName + '"任务吗?', '温馨提示', {
    type: 'warning',
    draggable: true,
  }).then(() => {
    return request.changeJobStatus(row.jobId, row.status)
  }).then(() => {
    ElMessage.success(text + "成功")
  }).catch(() => {
    row.status = row.status === "0" ? "1" : "0"
  })
}

/** 任务详细信息 */
async function handleView(row) {
  detailForm.value = {}
  isDetailDialog.value = true
  const [err, res] = await to(request.getJob(row.jobId))
  if (err) return
  detailForm.value = res.data
}

const handleDelete = async (row?) => {
  const jobIds = row?.jobId || ids.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项?', '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.delJob(jobIds))
  if (err) return
  ElMessage.success('删除成功')
  searchTable()
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.jobId);
}

/* 立即执行一次 */
async function handleRun(row?) {
  const [confirm] = await to(ElMessageBox.confirm('确认要立即执行一次"' + row.jobName + '"任务吗?', '系统提示', {
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.runJob(row.jobId, row.jobGroup))
  if (err) return
  ElMessage.success('执行成功')
}

/** 任务组名字典翻译 */
function jobGroupFormat(row) {
  return selectDictLabel(sys_job_group.value, row.jobGroup);
}
/** 导出按钮操作 */
function handleExport() {
  download("monitor/job/export", { ...searchForm.value, }, `job_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="app-container">
    <div class="d-header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="searchForm.jobName" placeholder="请输入任务名称" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroup">
          <el-select v-model="searchForm.jobGroup" placeholder="请选择" clearable @change="searchTable">
            <el-option v-for="dict in sys_job_group" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable @change="searchTable">
            <el-option v-for="dict in sys_job_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="d-content">
      <div class="util">
        <el-button plain type="primary" @click="handleAdd" icon="CirclePlus"
          v-hasPermi="['monitor:job:add']">新增</el-button>
        <el-button plain type="danger" @click="handleDelete()" icon="Delete" :disabled="ids.length === 0"
          v-hasPermi="['monitor:job:remove']">删除</el-button>
        <el-button plain type="success" @click="handleExport()" icon="Download"
          v-hasPermi="['monitor:job:export']">导出</el-button>
        <el-button plain type="info" @click="handleJobLog()" icon="Operation"
          v-hasPermi="['monitor:job:query']">日志</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="任务编号" prop="jobId" align="center" width="100" />
        <el-table-column label="任务名称" prop="jobName" align="center" show-overflow-tooltip />
        <el-table-column label="任务组名" align="center">
          <template #default="{ row }">
            <dict-tag :options="sys_job_group" :value="row.jobGroup" />
          </template>
        </el-table-column>
        <el-table-column label="调用目标字符串" prop="invokeTarget" align="center" show-overflow-tooltip />
        <el-table-column label="cron执行表达式" prop="cronExpression" align="cronExpression" show-overflow-tooltip />
        <el-table-column label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="0" inactive-value="1"
              @change="handleStatusChange(row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="200px" align="center" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleEdit(row)"
                v-hasPermi="['monitor:job:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(row)"
                v-hasPermi="['monitor:job:remove']"></el-button>
            </el-tooltip>
            <el-tooltip content="执行一次" placement="top">
              <el-button link type="primary" icon="CaretRight" @click="handleRun(row)"
                v-hasPermi="['monitor:job:changeStatus']"></el-button>
            </el-tooltip>
            <el-tooltip content="任务详细" placement="top">
              <el-button link type="primary" icon="View" @click="handleView(row)"
                v-hasPermi="['monitor:job:query']"></el-button>
            </el-tooltip>
            <el-tooltip content="调度日志" placement="top">
              <el-button link type="primary" icon="Operation" @click="handleJobLog(row)"
                v-hasPermi="['monitor:job:query']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </d-table>
    </div>
    <Handle ref="handleDialog" @search="searchTable()" />
    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" v-model="isDetailDialog" width="50%" class="d-dialog" append-to-body>
      <el-form :model="detailForm" label-width="120px">
        <el-row>
          <el-col :lg="12" :span="24">
            <el-form-item label="任务编号：">{{ detailForm.jobId }}</el-form-item>
            <el-form-item label="任务名称：">{{ detailForm.jobName }}</el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="任务分组：">{{ jobGroupFormat(detailForm) }}</el-form-item>
            <el-form-item label="创建时间：">{{ detailForm.createTime }}</el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="cron表达式：">{{ detailForm.cronExpression }}</el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="下次执行时间：">{{ detailForm.nextValidTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用目标方法：">{{ detailForm.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="任务状态：">
              <div v-if="detailForm.status == 0">正常</div>
              <div v-else-if="detailForm.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="是否并发：">
              <div v-if="detailForm.concurrent == 0">允许</div>
              <div v-else-if="detailForm.concurrent == 1">禁止</div>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :span="24">
            <el-form-item label="执行策略：">
              <div v-if="detailForm.misfirePolicy == 0">默认策略</div>
              <div v-else-if="detailForm.misfirePolicy == 1">立即执行</div>
              <div v-else-if="detailForm.misfirePolicy == 2">执行一次</div>
              <div v-else-if="detailForm.misfirePolicy == 3">放弃执行</div>
            </el-form-item>
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