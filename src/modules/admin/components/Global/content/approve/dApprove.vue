<script setup lang="ts">
  import to from 'await-to-js'
  import { ref, reactive, toRefs } from 'vue'
  import { useRoute } from 'vue-router'

  const emit =  defineEmits(['approval'])
  const route = useRoute()
  const props = defineProps({
    name: {
      type: String,
      default: '提交'
    },
    isSelectApprove: {
      type: Boolean,
      default: true
    },
    result: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  const data = reactive({
    approveFrom: {
      result: props.result,
      comment: '通过'
    },
    rules: {
      'comment': [ { required: true, message: '请填写' },]
    }
  })
  const approveFormRef = ref()
  const { approveFrom, rules } = toRefs(data)
  function redioChange(val: Boolean) {
    approveFrom.value.comment = val ? '通过' : '驳回'
  }
  async function approve() {
    const isValidate = await to(approveFormRef.value.validate())
    if(isValidate[0]) return
    const params = {
      ...approveFrom.value,
      taskId: route.query.taskId,
      id: route.params.id
    }
    emit('approval', params)
  }
</script>

<template>
  <div class="approve-content">
    <el-form :label-width="labelWidth" ref="approveFormRef" :model="approveFrom" :rules="rules">
      <el-form-item label="批复:" v-if="isSelectApprove">
        <el-radio v-model="approveFrom.result"  size="mini" @change="redioChange" :label=true>通过</el-radio>
        <el-radio v-model="approveFrom.result"  size="mini" @change="redioChange"  :label=false>驳回</el-radio>
      </el-form-item>
      <el-form-item label="批复说明:" prop="comment">
        <el-input type="textarea" v-model="approveFrom.comment"> </el-input>
      </el-form-item>
    </el-form>
    <slot/>
    <div  class="approve-btn">
      <el-button type="primary" @click="approve()" style="padding: 8px 40px" :loading="loading">{{name}}</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .approve-content {
    text-align: left;
    margin: 10px 40px 40px 20px;
  }
  .approve-btn {
    margin-top: 20px;
    text-align: center;
  }
</style>
