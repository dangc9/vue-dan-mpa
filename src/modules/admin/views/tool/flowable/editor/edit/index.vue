<template>
  <div class="app-container">
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="false"
      :saveTip="saveTip"
      @save="save"
      @showXML="showXML"
      @dataType="dataType"
    />
    <!--在线查看xml-->
    <el-dialog :title="xmlTitle" :visible.sync="xmlOpen" width="60%" append-to-body>
      <div>
        <pre v-highlight>
           <code class="xml">
                {{xmlContent}}
           </code>
        </pre>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import bpmnModeler from '@admin/components/Ruoyi/Process/index'
import vkbeautify from 'vkbeautify'
import Hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import dictApi from '@admin/api/system/dict'
import request from '@admin/api/tool/flowable/editor.ts'

export default {
  name: "Model",
  components: {
    bpmnModeler,
    vkbeautify
  },
  // 自定义指令
  directives: {
    highlight:(el) => {
      let blocks = el.querySelectorAll('pre code');
      blocks.forEach((block) => {
        Hljs.highlightBlock(block)
      })
    }
  },
  data() {
    return {
      xml: "", // 后端查询到的xml
      modeler:"",
      xmlOpen: false,
      xmlTitle: '',
      xmlContent: '',
      users: [],
      groups: [],
      categorys: [],
      saveTip: !this.$route.query?.deployId ? '新增模型' : '保存模型',
    };
  },
  computed: {
    isAdd() {
      return !this.$route.query?.deployId
    }
  },
  created () {
    //  查询流程xml
    !this.isAdd &&  this.getModelDetail(this.$route.query.deployId);
    dictApi.getDicts("sys_process_category").then(res => {
      this.categorys = res.data.data;
    });
    this.getDataList()
  },
  methods: {
    // 编辑初始化流程
    async getModelDetail(deployId) {
      // 发送请求，获取xml
      const res = await request.getFlowXML(deployId)
      this.xml = res.data.data;
      this.modeler = res.data.data
    },
    // 新增或保存
    async save(data) {
      const params = {
        name: data.process.name,
        category: data.process.category,
        content: data.xml,
        key: data.process.id,
        id: this.$route.query?.deployId
      }
      if(!data.process.category) {
        this.$message.warning("请选择流程分类")
        return
      }
      const res = await request[this.isAdd ? 'editorAdd' : 'editorUpdate'](params)
      if(!res) return;
      this.$message.success(`${this.saveTip}成功！`)
      // 关闭当前标签页并返回上个页面
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1)
    },
    // 指定流程办理人员列表
    getDataList() {
      request.getUserList().then(res =>{
        res.data.data.forEach(val =>{
          val.userId = val.userId.toString();
        })
        this.users = res.data.data;
        let arr = {nickName: "流程发起人", userId: "${INITIATOR}"}
        this.users.push(arr)
      });
      request.getRoleList().then(res =>{
        res.data.data.forEach(val =>{
          val.roleId = val.roleId.toString();
        })
        this.groups = res.data.data;
      });
    },
    // 展示xml
    showXML(data){
      this.xmlTitle = 'xml查看';
      this.xmlOpen = true;
      this.xmlContent = vkbeautify.xml(data);
    },
    // 获取数据类型
    dataType(data){
      this.users = [];
      this.groups = [];
      if (data) {
        if (data.dataType === 'dynamic') {
          if (data.userType === 'assignee') {
            this.users = [{nickName: "${INITIATOR}", userId: "${INITIATOR}"},
                          {nickName: "#{approval}", userId: "#{approval}"}
              ]
          } else if (data.userType === 'candidateUsers') {
            this.users = [ {nickName: "#{approval}", userId: "#{approval}"}]
          } else {
            this.groups = [{roleName: "#{approval}", roleId: "#{approval}"}]
          }
        } else {
          this.getDataList()
        }
      }
    }
  },
};
</script>
