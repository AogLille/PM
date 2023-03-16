<template style="background-color: #e8edf8;height: 100%">
  <div class="box" style="background-color: #e8edf8; ;height: 100%">

    <div id="top" style="height: 30px;background-color: white;height: 40px;box-shadow:0 0 10px #94959E">
      <ul style="">
        <li> CTG NET-OSS 运营门户2</li>
        <li><a class="item1 underline" href="# ">列表</a></li>
        <li><a class="item underline" href="# ">项目看板</a></li>
        <li><a class="item underline" href="# ">任务</a></li>
        <li><a class="item underline" href="# ">成员</a></li>
        <li><a class="item underline" href="# ">项目管理</a></li>
        <li><a class="item underline" href="# ">概况</a></li>
        <li><a class="item underline" href="# ">计划</a></li>
        <li><a class="item underline" href="# ">奖金</a></li>
        <li><a class="item underline" href="# ">考核</a></li>
        <li><a class="item underline" href="# ">预算费用</a></li>
        <li><a class="item underline" href="# ">风险</a></li>
        <li><a class="item underline" href="# ">文档</a></li>
      </ul>
    </div>


    <div>
      <div style="height: calc(100vh - 40px)">
        <div style="height: 100px">
          <h2 style="padding-top: 50px">项目没有制定项目计划，请尽快完成！</h2>
        </div>
        <div style="height: 100px;margin-top: 100px">
          <el-row>
            <el-button type="primary" @click="importFromTemplateButton()" >从模板导入</el-button>
            <el-dialog title="从模板导入"  width="500px" :visible.sync="importDialogVisible" :append-to-body="true" :modal-append-to-body="false">
              <el-form
                  :model="ruleForm"
                  status-icon
                  ref="ruleForm"
                  class="demo-ruleForm"
              >
                <el-form-item label="从模板导入：" prop="pass">
                  <el-select v-model="selectOptionsIndex" placeholder="请选择" style="width: 250px">
                    <el-option
                        v-for="item in options"
                        :key="item.mid"
                        :label="item.name"
                        :value="item.tid"
                        ref = "mySelected"

                        >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <div style="display: inline-block; margin-left: 20%"><el-button type="primary"  @click="importFromTemplateInterface(options[selectOptionsIndex-1].mid,options[selectOptionsIndex-1].name)">确认</el-button></div>
                  <div style="display: inline-block; margin-left: 25%"><el-button type="primary" @click="importDialogVisible=false">取消</el-button></div>
                </el-form-item>
              </el-form>
            </el-dialog>

            <el-button type="primary" style="margin-left: 200px" @click="craeteButton()">重新创建</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",

  created () {
    this.getTemplate();
  },

  methods: {
    //接口
    //1.跳转到首页之后需要显示已有模板
    async getTemplate(){
        // window.location.reload()
        const { data: res } = await this.$http.get('/planAddPage/PlanAdd/templates');
        this.options=res.data;
        console.log(res.data);
    },
    // 2.请求模板按钮，请求一个计划新增页并跳转到显示页面
    async importFromTemplateInterface(mid,name){
        console.log(mid,name);
        const { data: res } = await this.$http.get('/planAddPage/PlanAdd/choose/'+mid);
        console.log(res);
        //跳转到计划新增页
        this.$router.push({ path:'/test', query: {name:name}})

    },






    //一些用到的方法
    // 从模板导入按钮绑定事件，用于给接口传参
    importFromTemplateButton(){
      this.importDialogVisible=true;
    },
    //点击重新创建跳转到模板首页
    craeteButton(){
      // this.$router.push({path:'http://localhost:3001'});
      window.location.href = 'http://localhost:3001';
    },




    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },

  data() {
    return{
      //控制弹窗是否展示的变量
      importDialogVisible:false,
      createDialogVisible:false,
      //下拉框绑定的下标
      selectOptionsIndex:'',

      //从模板导入接口要传的参数放在这里
      importFromTemplate:{
        templateId:'',
        versionId:''
      },


      dialogTableVisible: false,
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        region: '',
        desc: ''
      },
      // 模板列表
      options: [],

      formLabelWidth: '120px'
    };
  }
}
</script>

<style scoped>

</style>
