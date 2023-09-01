<script setup lang="ts">
  import selectUser from './selectUser.vue'
  import { ref, watch, reactive, computed, toRefs } from 'vue'

  const emit = defineEmits(['update:modelValue','update:nameList','change','input'])
  const props = defineProps({
    modelValue: [ String, Object, Array ],
    limit: {
      type: Number,
      default: 10000
    },
    // 使v-model绑定一个对象,  仅在limit为1时有效
    object: {
      type: Boolean,
      default: false,
    },
    // 使v-model绑定一个字符串的(用户的id)
    string: {
      type: Boolean,
      default: false,
    },
    // v-model绑定字符串时, 对应的userNameList(为了在初始化时, 展示已选择的用户名称。 需要用.sync符)
    nameList: {
      type: String,
      default: '',
    },
    // v-model绑定字符串时, id和name的分隔符
    separator: {
      type: String,
      default: ','
    },
    placeholder: {
      type: String,
      default: () => "请选择"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: () => 'UserFilled'
    }
  })
  const data = reactive({
    selectedList: []
  })
  const isSelectMember = ref(false)
  const { selectedList } = toRefs(data) as any

  const valueLabel = computed(() => {
    return selectedList.value.map(item => item.name).join(props.separator)
  })
  const isDisabled = computed(() => {
    return props.disabled
  })

  watch(() => props.modelValue, (val) => {
    if(!val) {
      selectedList.value = []
    }
    if(Array.isArray(val)) {
      selectedList.value = val
    }
    if(Object.prototype.toString.call(val) === '[object Object]') {
      selectedList.value = [val]
    }
    if(val && (typeof(val)=='string' || typeof(val)=='number') && props.string) {
      const value = val.toString()
      selectedList.value = value?.split(props.separator).map((item, index) => {
        return {
          id: parseInt(value?.split(props.separator)[index]),
          name: props.nameList?.split(props.separator)[index],
        }
      })
    }
  }, { immediate: true })

  watch(selectedList, (val) => {
    if(isDisabled.value) return 
    const data = getModelValue(val)
    console.log(data);
    emit('update:modelValue', data );
    emit('change', data );
    emit('input', data );
  }, { deep: true})

  function selected(val) {
    selectedList.value = val
    close()
  }
  function close() {
    isSelectMember.value = false
  }
  function focus() {
    isSelectMember.value = true
  }
  function getModelValue(val) {
    if(props.limit === 1 && props.object) {
      return val[0]
    }
    if(props.string) {
      emit('update:nameList', val?.map(a => a.name)?.join(props.separator))
      return val?.map(a => a.id)?.join(props.separator)
    }
    return val
  }
</script>

<template>
  <div>
    <el-input v-if="!isDisabled" v-model="valueLabel" readonly :placeholder="placeholder" :prefix-icon="icon" @focus="focus"></el-input>
    <div v-else>
      <el-tag v-for="item in selectedList" class="mr-2">{{ item.name }}</el-tag>
    </div>
    <el-dialog v-model="isSelectMember" title="用户选择" center width="1000px" @close="close()" class="d-dialog" destroy-on-close append-to-body :show-close="false">
      <select-user
        :limit="limit"
        :value="selectedList"
        :icon="icon"
        v-bind="$attrs"
        @click.stop
        @selected="selected">
      </select-user>
    </el-dialog>
  </div>
</template>
