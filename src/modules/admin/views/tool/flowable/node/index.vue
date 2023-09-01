<script lang="ts" setup>
import { ref, reactive, toRefs } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import request from '@admin/api/tool/flowable/node'

const tableData = ref([])
const total = ref(0)
const detailData = ref([])
const detailTotal = ref(0)
const tableRef = ref<any>()
const detailTableRef = ref<any>()
const optionFormRef = ref<any>()
const loading = ref(true)
const searchForm = ref<any>({})
const searchDetailInfo = ref<any>({})
const isSumbitLoading = ref(false)
const isDetailLoading = ref(false)
const isHandleDialog = ref(false)
const isOptionDialog = ref(false)
const isOpetionDetailDialog = ref(false)
const isOptionAdd = ref(true)
const data = reactive<any>({
  editForm: {},
  optionForm: {},
})
const { editForm, optionForm } = toRefs(data)

function searchTable() {
  tableRef.value?.resetPage()
}
function resetTable() {
  searchForm.value = {}
  searchTable()
}
function searchDetailTable() {
  detailTableRef.value?.resetPage()
}
function resetDetailTable() {
  searchDetailInfo.value = {}
  searchDetailTable()
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
const getDetailList = async (val: object) => {
  const params = { ...val, ...searchDetailInfo.value, version: optionForm.value.version }
  detailData.value = []
  isDetailLoading.value = true
  const [err, res] = await to(request.getList(params))
  isDetailLoading.value = false
  if(err) return;
  detailData.value = res.data.data.rows
  detailTotal.value = res.data.data.total
} 

async function handleEdit(val) {
  const [err, res] = await to(request.getNodeUserDetail(val.id))
  if(err) return
  editForm.value = {
    id: val.id,
    candidateUser: res.data.data.candidateUser,
    candidateUserName: res.data.data.candidateUserName,
    candidateRole: res.data.data.candidateRole,
    candidateRoleName: res.data.data.candidateRoleName,
    node: { id: val.nodeId, name: val.nodeName },
    flow: { id: val.defId, name: val.defName },
    userFlag: res.data.data.userFlag,
  }
  isHandleDialog.value = true
}

function copyVersion() {
  isOptionDialog.value = true
  isOptionAdd.value = true
  optionForm.value = {}
}
function setVersion() {
  isOptionDialog.value = true
  isOptionAdd.value = false
  optionForm.value = {}
}
async function showOption() {
  const isValidate = await to(optionFormRef.value.validate())
  if(!isValidate[1]) return;
  isOpetionDetailDialog.value = true
}
async function submit() {
  isSumbitLoading.value = true
  const [err] = await to(request.nodeUserUpdate(editForm.value))
  isSumbitLoading.value = false
  if (err) return
  isHandleDialog.value = false
  ElMessage.success(`修改成功`)
  searchTable()
}

async function optionSubmit() {
  const isValidate = await to(optionFormRef.value.validate())
  if(!isValidate[1]) return;
  const data = {
    version: optionForm.value.version,
  }
  const type = this.isOptionAdd ? 'setVersion' : 'copyVersion'
  const [err, res] =  await to(request[type](data))
  if(err) return
  ElMessage.success(res.data.msg)
  isOptionDialog.value = false
  searchTable()
}

/** 删除按钮操作 */
async function handleDelete(val: any) {
  const [confirm] = await to(ElMessageBox.confirm(`是否删除流程节点审批人：${val.defName} - ${val.candidateUserNames} ?`, '删除操作', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.nodeUserDelete(val.id))
  if (err) return
  ElMessage.success(`删除成功`)
  searchTable()
}

</script>

<template>
  <div class="app-container">
    <div class="d-header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="流程名称" prop="defName">
          <el-input v-model="searchForm.defName" placeholder="请输入流程名称" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="d-content">
      <div class="util">
        <el-button type="primary"  @click="copyVersion" icon="CopyDocument">使用预设配置</el-button>
        <el-button icon="FolderChecked"  @click="setVersion">保存为预设配置</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList">
        <el-table-column label="流程名称" prop="defName" align="center" show-overflow-tooltip />
        <el-table-column label="节点名称" prop="nodeName" align="center" show-overflow-tooltip />
        <el-table-column label="审批人" prop="candidateUserNames" align="center" show-overflow-tooltip width="190" />
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button type="primary" size="small" icon="edit" @click="handleEdit(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </d-table>
    </div>
  </div>
  <el-dialog title="修改审批人" v-model="isHandleDialog" destroy-on-close class="d-dialog" width="500px" append-to-body>
    <el-form ref="form" class="d-form" :model="editForm" label-width="120px">
      <el-form-item label="流程："> {{ editForm.flow.name }}
      </el-form-item>
      <el-form-item label="流程节点："> {{ editForm.node.name }}</el-form-item>
      <el-form-item label="审批类型："> {{ editForm.userFlag ? "指定人员" : '指定角色' }} </el-form-item>
      <el-form-item label="审批人：" v-if="editForm.userFlag">
        <d-select-user v-model="editForm.candidateUser" string v-model:nameList="editForm.candidateUserName" :limit="10000"></d-select-user>
      </el-form-item>
      <!-- <el-form-item label="审批角色：" v-else>
        <d-select-role v-model="editForm.candidateRole" string :nameList.sync="editForm.candidateRoleName" :limit="10000"></d-select-role>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button size="small" @click="isHandleDialog = false">取 消</el-button>
      <el-button type="primary" size="small" @click="submit" :loading="isSumbitLoading">确 定</el-button>
    </template>
  </el-dialog>
  <el-dialog :title="isOptionAdd ? '保存预设配置': '使用预设配置'" class="d-dialog" v-model="isOptionDialog" width="500px" append-to-body>
    <el-form v-if="isOptionDialog" ref="optionFormRef" class="d-edit-form" :model="optionForm"  label-width="100px">
      <el-form-item label="配置项：" prop="version">
        <el-select v-model="optionForm.version" placeholder="请选择">
          <el-option value="1" label="配置一"></el-option>
          <el-option value="2" label="配置二"></el-option>
          <el-option value="3" label="配置三"></el-option>
        </el-select>
        <el-button type="primary" size="small" plain style="margin-left: 10px" @click="showOption">查看配置</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="isOptionDialog = false">取 消</el-button>
      <el-button type="primary" size="small" @click="optionSubmit" :loading="isSumbitLoading">{{ isOptionAdd ? '保 存' : '使 用' }}</el-button>
    </template>
  </el-dialog>
  <el-dialog :title="'配置'+ optionForm.version + ' - 流程节点审批人详情'" class="d-dialog"  v-model="isOpetionDetailDialog" center width="800px" append-to-body>
    <div v-if="isOpetionDetailDialog">
      <el-form :model="searchDetailInfo" ref="form" class="d-search-form" :inline="true" label-width="80px">
        <el-form-item label="流程名称">
          <el-input v-model="searchDetailInfo.defName"  placeholder="请输入名称"  size="small"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDetailTable">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetDetailTable">重置</el-button>
        </el-form-item>
      </el-form>
      <d-table
        class="d-table-default"
        ref="detailTableRef"
        border
        style="width: 100%"
        :total="detailTotal"
        :data="detailData"
        showIndex
        :loading="isDetailLoading"
        @update="getDetailList">
        <el-table-column prop="defName" label="流程名称"  align="center"></el-table-column>
        <el-table-column prop="nodeName" label="节点名称"  align="center"></el-table-column>
        <el-table-column prop="candidateUserNames" label="审批人"  align="center"></el-table-column>
      </d-table>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
