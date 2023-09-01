<script lang="ts" setup>
import { ref, reactive, toRefs } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import request from '@admin/api/tool/flowable/editor'
import { useDict } from '@admin/utils/common/dict'
import { useRouter } from 'vue-router'
import { getToken } from '@admin/utils/auth'
const router = useRouter()

const { sys_process_category } = useDict("sys_process_category");


console.log(1);
const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const uploadRef = ref<any>()
const loading = ref(true)
const searchForm = ref<any>({})
const isDialog = ref(false)
const title = ref('')
const data = reactive({
  uploadForm: {
    isDialog: false,
    title: "",
    isUploading: false,
    name: null,
    category: null,
    headers: { Authorization: "Bearer " + getToken() },
    url: import.meta.env.VITE_ADMIN_API + "/flowable/editor/import"
  },
  rules: [

  ]
})
const { uploadForm, rules } = toRefs(data)

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
  uploadForm.value.title = "bpmn20.xml文件导入";
  uploadForm.value.isDialog = true;
}
function closeDialog() {

}
/* 编辑按钮跳转流程编辑页 */
function handleEdit(val?: any) {
  router.push({ path: '/flowable/editor/edit', query: { deployId: val?.id } })
}
/** 发布按钮操作 */
async function handleDeploy(row: any) {
  const [confirm] = await to(ElMessageBox.confirm(`请确认是否发布流程：${row.name} ?`, '发布操作', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.editorDeploy(row.id))
  if (err) return
  ElMessage.success(`发布成功`)
}
/** 删除按钮操作 */
async function handleDelete(row: any) {
  const [confirm] = await to(ElMessageBox.confirm(`是否删除流程：${row.name} ?`, '删除操作', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.editorDelete(row.id))
  if (err) return
  ElMessage.success(`删除成功`)
  searchTable()
}


// 文件上传中处理
async function handleFileUploadProgress(event, file, fileList) {
  uploadForm.value.isUploading = true;
}
// 文件上传成功处理
async function handleFileSuccess(response, file, fileList) {
  uploadForm.value.isDialog = false;
  uploadForm.value.isUploading = false;
  uploadRef.value.clearFiles();
  ElMessage.success(response.msg || "上传成功");
  searchTable();
}
// 提交上传文件
async function submitFileForm() {
  uploadRef.value.submit();
}
</script>

<template>
  <div class="app-container">
    <div class="d-header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入流程名称" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="d-content">
      <div class="util">
        <el-button type="primary" icon="CirclePlus" @click="handleEdit()">新增</el-button>
        <el-button type="info" plain icon="Upload" @click="handleImport">导入</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList">
        <el-table-column label="流程名称" prop="name" align="center" show-overflow-tooltip />
        <el-table-column label="流程分类" prop="userName" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.category }}
            <!-- <dict-tag :options="sys_process_category" :value="row.category" /> -->
          </template>
        </el-table-column>
        <el-table-column label="流程编号" prop="key" align="center" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip width="190" />
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="发布" placement="top">
              <el-button type="primary" size="small" icon="Position" @click="handleDeploy(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button size="small" icon="Edit" @click="handleEdit(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" size="small" icon="Delete" @click="handleDelete(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </d-table>
    </div>
  </div>
  <el-dialog @close="closeDialog" v-model="uploadForm.isDialog" :title="uploadForm.title" width="400px" class="d-dialog"
    draggable>
    <el-upload ref="uploadRef" :limit="1" accept=".xml" :headers="uploadForm.headers"
      :action="uploadForm.url + '?name=' + uploadForm.name + '&category=' + uploadForm.category"
      :disabled="uploadForm.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
      :auto-upload="false" drag>
      <el-icon style="font-size: 50px"><UploadFilled/></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <div class="el-upload__tip" slot="tip">
      流程名称：<el-input v-model="uploadForm.name" />
      流程分类：<el-input v-model="uploadForm.category" />
    </div>
    <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“bpmn20.xml”格式文件！</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="uploadForm.isDialog = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
