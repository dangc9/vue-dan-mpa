<script lang="ts" setup>
import { ref } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import request from '@admin/api/tool/flowable/definition'
import { useDict } from '@admin/utils/common/dict'

const { sys_process_category } = useDict("sys_process_category");

const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const loading = ref(true)
const searchForm = ref<any>({})
const dialogVisible = ref(false)
const title = ref('')
const imgSrc = ref('')
const isDialog = ref(false)

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
  const [err, { data }] = await to(request.getList(params))
  loading.value = false
  if (err) return
  tableData.value = data.data.rows
  total.value = data.data.total
}

/* 打开导入弹窗 */
function handleImport() {
  title.value = "bpmn20.xml文件导入";
  dialogVisible.value = true;
}
function closeDialog() {

}

/** 预览按钮操作 */
function handleShow(val: any) {
  imgSrc.value = `${import.meta.env.VITE_ADMIN_API}/flowable/definition/readImage/${val.id}`
  title.value = `流程图-${val.name}`;
  isDialog.value = true;
}

/** 删除按钮操作 */
async function handleDelete(row: any) {
  const [confirm] = await to(ElMessageBox.confirm(`是否删除流程：${row.name}  ?`, '删除操作', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.flowDelete(row.id))
  if (err) return
  ElMessage.success(`删除成功`)
  searchTable()
}
/* 挂起/激活按钮操作 */
async function handleUpdate(val: any) {
  const handle = val.isActive ? '挂起' : '激活'
  const [confirm] = await to(ElMessageBox.confirm(`是否“${handle}”该流程：${val.name} ?`, `${handle}操作`, { type: 'warning' }))
  if (confirm) return
  const res = await request.flowUpdate(val.id)
  if (!res) return;
  this.$message.success(`${handle}成功`)
  this.searchTable()
}
</script>

<template>
  <div class="app-container">
    <div class="d-header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入流程名称" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-select v-model="searchForm.category" placeholder="请选择">
            <el-option v-for="(item, id) in sys_process_category" :key="item.value" :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="d-content">
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList">
        <el-table-column label="流程名称" prop="name" align="center" show-overflow-tooltip />
        <el-table-column label="流程分类" prop="userName" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <dict-tag :options="sys_process_category" :value="row.category" />
          </template>
        </el-table-column>
        <el-table-column label="流程编号" prop="key" align="center" show-overflow-tooltip />
        <el-table-column label="发布时间" prop="deployTime" align="center" show-overflow-tooltip width="190" />
        <el-table-column label="版本" prop="version" align="center" show-overflow-tooltip />
        <el-table-column prop="isActive" label="流程状态" align="center" width="100px">
          <template #default="{ row }">
            <el-button :type="row.isActive ? 'success' : 'info'" plain class="d-button-mini" @click="handleUpdate(row)">
              {{ row.isActive ? '已激活' : '已挂起' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="查看" placement="top">
              <el-button type="primary" size="small" icon="View" @click="handleShow(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" size="small" icon="Delete" @click="handleDelete(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </d-table>
    </div>
  </div>
  <!-- 流程图 -->
  <el-dialog :title="title" v-model="isDialog" width="70%" append-to-body class="mx-60 my-20">
    <el-image :src="imgSrc" :preview-src-list="[imgSrc]" fit="cover" />
  </el-dialog>
</template>

<style scoped lang="scss"></style>
