<script lang="ts" setup>
import { ref } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import dictTag from '@admin/components/Ruoyi/DictTag.vue'
import Detail from './detail.vue'
import request from '@admin/api/system/post'
import download from '@admin/utils/common/download'
import { useDict } from  '@admin/utils/common/dict'
const { sys_normal_disable } = useDict("sys_normal_disable");

const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const loading = ref(true)
const searchForm = ref<any>({})
const ids = ref([]);
const detailDialog = ref()

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
  const [err, res] = await to(request.listPost(params))
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
  const postIds = row?.postId || ids.value.join(',');
  const [confirm] = await to(ElMessageBox.confirm('是否确认删除角色编号为"' + postIds + '"的数据项?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }))
  if (confirm) return
  const [err] = await to(request.delPost(postIds))
  if (err) return
  ElMessage.success('删除成功')
  searchTable()
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.postId);
}

/** 导出按钮操作 */
function handleExport() {
  download("system/post/export", { ...searchForm.value, }, `post_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="searchForm.postCode" placeholder="请输入岗位编码" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="searchForm.postName" placeholder="请输入岗位名称" @keyup.enter="searchTable" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
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
        <el-button type="primary" @click="handleAdd" icon="CirclePlus" v-hasPermi="['system:post:add']">新增角色</el-button>
        <el-button type="danger" @click="handlleDelete()" icon="Delete" :disabled="ids.length === 0" v-hasPermi="['system:post:remove']">删除</el-button>
        <el-button type="success" @click="handleExport()" icon="Download" v-hasPermi="['system:post:export']">导出</el-button>
      </div>
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <!-- <el-table-column prop="postId" label="岗位编号" align="center" /> -->
        <el-table-column prop="postCode" label="岗位编码" align="center" />
        <el-table-column prop="postName" label="岗位名称" align="center" />
        <el-table-column prop="postSort" label="岗位排序" align="center" /> 
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <dict-tag :options="sys_normal_disable" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="190" />
        <el-table-column prop="operator" label="操作" width="160px" align="center" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button type="primary" size="small" icon="Edit" @click="handleEdit(row)"  v-hasPermi="['system:user:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button @click="handlleDelete(row)" type="danger" size="small" icon="Delete" v-hasPermi="['system:user:remove']"></el-button>
            </el-tooltip>
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
