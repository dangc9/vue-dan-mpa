<script setup lang="ts">
  import to from 'await-to-js'
  import { ref, watch, computed } from 'vue'
  import request from '@admin/api/public/index'
  const flowHistory = ref([])
  const isLoading = ref(true)
  const props = defineProps<{
    instanceId: string | number
  }>()
  const imgUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_API}/flowable/task/diagram?processDefinitionId=111&processId=${props.instanceId}`
  })
  watch(() => props.instanceId, async (val) => {
    if (val) {
      getHistory(val)
    }
  }, { immediate: true })

  async function getHistory(id: string | number) {
    const [err, res] = await to(request.getFlowHistory(id))
    if (err) return
    flowHistory.value = res.data.data.flowList
  }
  function loadSuccess() {
    isLoading.value = false
  }
</script>

<template>
  <div>
    <div class="d-title">流程历史</div>
    <div class="m-6">
      <el-table :data="flowHistory" border>
        <el-table-column prop="taskName" label="操作类型"></el-table-column>
        <el-table-column prop="candidate" label="办理人" width="120"></el-table-column>
        <el-table-column prop="comment.comment" label="处理意见"></el-table-column>
        <el-table-column prop="finishTime" label="处理时间" width="200"></el-table-column>
      </el-table>
    </div>
    <div class="d-title">流程图</div>
    <div class="m-6 px-40">
      <el-image
        style="width: 100%;"
        :src="imgUrl"
        :preview-src-list="[imgUrl]"
        @load="loadSuccess">
        <template #placeholder>
          <div style="width: 200px; height: 200px; margin: 0 auto">
            <img
              v-if="isLoading"
              src="@admin/assets/image/public/loading.gif"
              width="200px"
              height="200px"/>
          </div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .el-table {
    font-weight: bold;
    :deep(.el-table__header)  {
      th {
        font-weight: 200;
      }
      
      .el-table__cell {
        background-color: var(--el-bg-color) !important;
      }
    }
  }
</style>