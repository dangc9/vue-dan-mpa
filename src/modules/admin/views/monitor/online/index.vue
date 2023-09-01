<script lang="ts" setup>
import { ref } from 'vue'
import to from 'await-to-js'
import { ElMessageBox, ElMessage } from 'element-plus'
import request from '@admin/api/monitor/online'

const tableData = ref([])
const total = ref(0)
const tableRef = ref<any>()
const loading = ref(true)
const searchForm = ref<any>({})

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
  const [err, res] = await to(request.list(params))
  loading.value = false
  if (err) return
  tableData.value = res.rows
  total.value = res.total
}

/** 强退按钮操作 */
async function handleForceLogout(row: any) {
  const [confirm] = await to(ElMessageBox.confirm(`是否确认强退名称为${row.userName}的用户?`, '系统提示', { type: 'warning' }))
  if (confirm) return
  const [err] = await to(request.forceLogout(row.tokenId))
  if (err) return
  ElMessage.success(`用户"${row.userName}强退成功`)
  searchTable()
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
        <el-form-item>
          <el-button type="primary" @click="searchTable" icon="Search">查询</el-button>
          <el-button @click="resetTable">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <d-table ref="tableRef" :data="tableData" :total="total" border :loading="loading" @update="getList">
        <el-table-column type="index" width="50" />
        <el-table-column label="会话编号" prop="tokenId" align="center" show-overflow-tooltip />
        <el-table-column label="登录名称" prop="userName" align="center" show-overflow-tooltip />
        <el-table-column label="所属部门" prop="deptName" align="center" show-overflow-tooltip />
        <el-table-column label="主机" prop="ipaddr" align="center" show-overflow-tooltip />
        <el-table-column label="登录地点" prop="loginLocation" align="center" show-overflow-tooltip />
        <el-table-column label="操作系统" prop="os" align="center" show-overflow-tooltip />
        <el-table-column label="浏览器" prop="browser" align="center" show-overflow-tooltip />
        <el-table-column label="登录时间" prop="loginTime" align="center" width="190" />
        <el-table-column label="操作" align="center" width="100"  fixed="right">
          <template #default="{row}">
            <el-button link type="primary" icon="Delete" @click="handleForceLogout(row)" v-hasPermi="['monitor:online:forceLogout']">强退</el-button>
          </template>
        </el-table-column>
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
}
</style>
