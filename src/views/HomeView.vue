<template>
  <div class="home">
      <div>
          <h1 style=" ;font-size: 20px">云项目管理模型【合同升级项目（迭代型2）】</h1>
          <div class="body_bottom"
               style="display: flex;margin-top: 20px;transform:scale(0.95,1);top: 20%;">


              <!--       表格内容，写的比较多         -->
              <el-table
                      :data="tableData"
                      border
                      style="width: 120%"
                      >
                  <el-table-column
                          fixed
                          prop="sname"
                          label="里程碑"
                          width="140"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop="aname"
                          label="活动编号"
                          width="140"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop="front"
                          label="前置活动"
                          width="90"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop="achievement"
                          label="输出成果物"
                          width="120"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop="type"
                          label="活动类型"
                          width="90"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop="process"
                          label="进度占比"
                          width="90"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop="bonus"
                          label="奖金来源"
                          width="90"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop=""
                          label="百分比（%）"
                          width="90"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop="quota"
                          label="固定额（元）"
                          width="90"
                          align="center">
                  </el-table-column>
                  <el-table-column
                          prop="iscrop"
                          label="可裁剪"
                          width="70"
                          align="center">
                    <template slot-scope="scope">
                    <div v-if="scope.row.iscrop">
                          是
                    </div>
                    <div v-else>
                          否
                    </div>
            </template>
                  </el-table-column>
                  <el-table-column
                          fixed="right"
                          label="操作"
                          width="300"
                          align="center"
                          >
                      <template slot-scope="scope">
                          <el-button type="text"
                                     size="small" v-if="scope.row.sname" @click="addMilestoneDialogVisible=true">增加里程碑</el-button>
                          <el-button type="text" @click="addActivityNumberButton(scope.row.sid)"
                                     size="small" v-if="scope.row.sname">增加活动编号</el-button>
                          <!-- <el-button type="text" v-if="scope.row.milestone" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button> -->
                          <el-button type="text" v-if="scope.row.sname" size="small" @click="modifyMilestoneButton(scope.row.sname,scope.row.describe,scope.row.sid)">修改</el-button>
                          <el-button type="text" v-if="scope.row.sname" size="small" @click="deleteMilestone(scope.row.sid)" >删除</el-button>


                          <!-- <el-button type="text" v-if="scope.row.activity" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button> -->
                          <el-button type="text" v-if="scope.row.aname" size="small" @click="modifyActivityNumberButton(scope.row.aid,scope.row.sid)">修改</el-button>
                          <el-button type="text" v-if="scope.row.aname" size="small" @click="deleteActivityNumber(scope.row.aid)" >删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>





              <!-- 弹窗 -->
              <!-- 1.增加里程碑弹窗 -->
              <el-dialog title="增加里程碑" :visible.sync="addMilestoneDialogVisible" :append-to-body="true"
                @close="resetForm('addMileStoneForm')">
                <el-form :model="addMileStoneForm" :rules="addMilestoneRules" ref="addMileStoneForm" label-width="100px"
                  class="demo-ruleForm">
                  <el-form-item label="里程碑名称" prop="name" :label-width="formLabelWidth">
                    <el-input type="input" v-model="addMileStoneForm.name" placeholder="请输入1-10个字符的名称"></el-input>
                  </el-form-item>
                  <el-form-item label="排序" prop="sort" :label-width="formLabelWidth">
                    <el-input type="number" v-model="addMileStoneForm.sort" placeholder="请输入数字进行排序"
                              oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                  </el-form-item>
                  <el-form-item label="里程碑描述" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="addMileStoneForm.desc" placeholder="请输入里程碑描述"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addMilestoneDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addMilestone">确 定</el-button>
                </div>
              </el-dialog>

              <!--2.增加活动编号弹窗        -->
              <el-dialog
                      title="提示"
                      :visible.sync="addActivityDialogVisible"
                      :append-to-body="true"
                      width="30%">

                  <el-form :model="ActivityForm" :rules="rules" ref="ActivityForm" label-width="110px" class="demo-ruleForm">
                      <el-form-item label="活动编号名称" prop="name">
                          <el-input v-model="ActivityForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label="进度占比(%)"  prop="rate">
                          <el-input-number v-model="ActivityForm.rate" placeholder="请输入进度占比" style="width: 225px"
                                           controls-position="right" @change="handleChange" :min="1" :max="100"></el-input-number>
                      </el-form-item>
                      <el-form-item label="奖金来源" prop="source">
                          <el-select v-model="ActivityForm.source" placeholder="请选择">
                              <el-option label="csgo" value="反恐精英"></el-option>
                              <el-option label="genshin" value="原神"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="是否可裁剪"  prop="iscrop">
                          <el-switch v-model="ActivityForm.iscrop"
                                     active-value="true"
                                     inactive-value="false"
                          ></el-switch>
                      </el-form-item>
                      <el-form-item label="前置活动" prop="pre">
                          <el-select v-model="ActivityForm.pre" placeholder="请选择">
                              <el-option label="zood" value="zood"></el-option>
                              <el-option label="1！5！" value="15"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="输出成果物" prop="achievement">
                          <el-select v-model="ActivityForm.achievement" placeholder="请选择">
                              <el-option label="zood" value="zood"></el-option>
                              <el-option label="1！5！" value="15"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="活动编号类型" prop="activityType">
                          <el-select v-model="ActivityForm.activityType" placeholder="请选择">
                              <el-option label="zood" value="zood"></el-option>
                              <el-option label="1！5！" value="15"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="排序" prop="sort">
                          <el-input v-model="ActivityForm.sort"></el-input>
                      </el-form-item>
                      <el-form-item label="活动编号描述" prop="describe">
                          <el-input type="textarea" v-model="ActivityForm.describe"></el-input>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" @click="addRow()" >立即创建</el-button>
                      </el-form-item>
                  </el-form>


                  <span slot="footer" class="dialog-footer">
                  <el-button @click="addActivityDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="addActivityNumber">确 定</el-button>
                </span>
              </el-dialog>

              <!-- 3.修改活动编号弹窗 -->
              <el-dialog
                      title="提示"
                      :visible.sync="modifyActivityDialogVisible"
                      :append-to-body="true"
                      width="30%">

                  <el-form :model="ActivityForm" :rules="rules" ref="ActivityForm" label-width="110px" class="demo-ruleForm">
                      <el-form-item label="活动编号名称" prop="name">
                          <el-input v-model="ActivityForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label="进度占比(%)"  prop="rate">
                          <el-input-number v-model="ActivityForm.rate" placeholder="请输入进度占比" style="width: 225px"
                                  controls-position="right" @change="handleChange" :min="1" :max="100">
                          </el-input-number>
                      </el-form-item>
                      <el-form-item label="奖金来源" prop="source">
                          <el-select v-model="ActivityForm.source" placeholder="请选择">
                              <el-option label="csgo" value="反恐精英"></el-option>
                              <el-option label="genshin" value="原神"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="是否可裁剪"  prop="iscrop">
                          <el-switch v-model="ActivityForm.iscrop"
                                     active-value="true"
                                     inactive-value="false"
                          ></el-switch>
                      </el-form-item>
                      <el-form-item label="前置活动" prop="pre">
                          <el-select v-model="ActivityForm.pre" placeholder="请选择">
                              <el-option label="zood" value="zood"></el-option>
                              <el-option label="1！5！" value="15"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="输出成果物" prop="achievement">
                          <el-select v-model="ActivityForm.achievement" placeholder="请选择">
                              <el-option label="zood" value="zood"></el-option>
                              <el-option label="1！5！" value="15"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="活动编号类型" prop="activityType">
                          <el-select v-model="ActivityForm.activityType" placeholder="请选择">
                              <el-option label="zood" value="zood"></el-option>
                              <el-option label="1！5！" value="15"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="排序" prop="sort">
                          <el-input v-model="ActivityForm.sort"></el-input>
                      </el-form-item>
                      <el-form-item label="活动编号描述" prop="describe">
                          <el-input type="textarea" v-model="ActivityForm.describe"></el-input>
                      </el-form-item>
                      <!-- <el-form-item>
                          <el-button type="primary" @click="addRow()" >立即创建</el-button>
                      </el-form-item> -->
                  </el-form>


                  <span slot="footer" class="dialog-footer">
                  <el-button @click="modifyActivityDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="modifyActivityNumber()">修改</el-button>
                </span>
              </el-dialog>

              <!-- 4.修改里程碑弹窗 -->
              <el-dialog title="修改里程碑" :visible.sync="modifyMilestoneDialogVisible" :append-to-body="true"
                @close="resetForm('addMileStoneForm')">
                <el-form :model="addMileStoneForm" :rules="rules" ref="addMileStoneForm" label-width="100px"
                  class="demo-ruleForm">
                  <el-form-item label="里程碑名称" prop="name" :label-width="formLabelWidth">
                    <el-input type="input" v-model="addMileStoneForm.name" placeholder="请输入1-10个字符的名称"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="排序" prop="sort" :label-width="formLabelWidth">
                    <el-input type="number" v-model="addMileStoneForm.sort" placeholder="请输入数字进行排序"
                              oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                  </el-form-item> -->
                  <el-form-item label="里程碑描述" prop="describe" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="addMileStoneForm.describe" placeholder="请输入里程碑描述"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="modifyMilestoneDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="modifyMilestone()">确 定</el-button>
                </div>
              </el-dialog>





          </div>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'HomeView',
  // 每次created时都要请求数据
  created () {
    this.getPlanTable()
  },
    data() {
        return {
          //控制弹窗是否展示的变量
          // 1.增加里程碑弹窗是否展示
          addMilestoneDialogVisible:false,
          //2.添加活动编号弹窗是否展示
          addActivityDialogVisible: false,
          //3.添加活动编号弹窗是否展示
          modifyActivityDialogVisible: false,
          //4.修改里程碑弹窗是否展示
          modifyMilestoneDialogVisible: false,


          //界面绑定的数据
          //1.增加里程碑表单数据
          addMileStoneForm: {
            id: '',
            name: 'aaa',
            progressRatio: '2',
            cost: '2',
            startTime: '2022-07-03',
            endTime: '2022-07-03',
            status: '0',
            sort:'',
            desc:'aaa'
      },

            currentIndex: 0,
            num: 1,
          //2.增加活动编号表单数据
            ActivityForm: {
                name: 'aaa',
                rate:'',
                source: '',
                iscrop: false,
                pre: '',
                achievement: '',
                activityType:'',
                sort: '',
                describe: 'aaa',
                sid:'',
                id:''
            },
            //3.修改里程碑填写数据
            modifyData: {
                id: '9',
                name: '五十号快干活',
                progressRatio: '2',
                cost: '2',
                startTime: '2022-07-03',
                endTime: '2022-07-03',
                status: '0',
            },


            // 增加活动编号表单数据填写规则
            rules: {
                number: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                // ratio: [
                //     {  message: '请输入进度占比', trigger: 'blur' },
                // ],
                source: [
                    {  message: '请选择', trigger: 'change' }
                ],
                pre: [
                    {  message: '请选择', trigger: 'change' }
                ],
                achievement: [
                    { message: '请选择', trigger: 'change' }
                ],
                activity: [
                    {  message: '请选择', trigger: 'change' }
                ],
                rank: [
                    { required: true, message: '请进行排序', trigger: 'blur' }
                ],
                describe: [
                    {  message: '请填写活动形式', trigger: 'blur' }
                ]
            },
            // 增加里程碑表单填写规则
            addMilestoneRules: {
                milestone: [
                  { required: true, message: '请输入里程碑名称', trigger: 'blur' },
                  { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
                ],
                sort: [
                  { required: true, message: '请进行排序', trigger: 'change' }
                ]
            },
            // 增加弹窗表单的宽度
            formLabelWidth: '120px',

            defaultProps: {
                children: 'children',
                label: 'label'
            },
            // 页面表格数据
            tableData: [
               {
              "sname": "点击右侧按钮编辑模板",
              "aname": "",
              "process":"" ,
              "bonus": "",
              "iscrop": true,
              "front": "",
              "achievement": "",
              "type": "",
              "quota": "",
              "aid": ""
        }
            ],
        }
    },
    methods: {
    // 接口
    // 1.请求计划模板数据，计划模板页有多个模板，每次点击侧面目录数据都要请求当前页面的数据
    async getPlanTable () {
      const { data: res } = await this.$http.get('http://192.168.43.20:80/show/'+this.$route.query.mid+'/'+this.$route.query.tid);
      this.tableData = res.data;
      console.log("->接口getPlanTable接收到的数据\n"+this.tableData[0].sid);
    },
    //2.增加里程碑
    async addMilestone () {
      this.addMilestoneDialogVisible = false
      const { data: res } = await this.$http.post('http://192.168.43.20:80/stones', {
        mid:this.$route.query.mid,
        tid:this.$route.query.tid,
        sname:this.addMileStoneForm.name,
        sort:this.addMileStoneForm.sort,
        sdescription:this.addMileStoneForm.desc
      })
      this.getPlanTable()

    },
    // 3.增加活动编号
    async addActivityNumber(){
      this.addActivityDialogVisible = false
      const {data:res} = await this.$http.post('http://192.168.43.20:80/activity',{
        "aname": this.ActivityForm.name,
        "process":this.ActivityForm.rate,
        "bonus":this.ActivityForm.source,
        "iscrop":this.ActivityForm.iscrop,
        "front":this.ActivityForm.pre,
        "achievement":this.ActivityForm.achievement,
        "type":this.ActivityForm.activityType,
        "asort":this.ActivityForm.sort,
        "adescription":this.ActivityForm.describe,
        "quota":10,
        "sid":this.ActivityForm.sid,
        "mid":this.$route.query.mid,
        "tid":this.$route.query.tid
      })
      this.getPlanTable()
    },
    // //4.删除里程碑(这个是原来的方法，和后端对接不知道是前端还是后端除了问题，显示请求体丢失，于是改成下面的方法)
    // async deleteMilestone (sid) {
    //   this.addMileStoneForm.id=sid;
    //   const confirmResult = await this.$confirm("此操作将永久删除里程碑，是否继续?", "提示", {
    //     confirmButtonText: '确定',
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).catch(err => err)
    //   // 判断是否点击了按钮
    //   if (confirmResult !== 'confirm') return this.$message.info("取消了删除")
    //   console.log(sid);
    //   console.log(this.$route.query.mid+"--"+this.$route.query.tid);
    //   const { data: res } = await this.$http.delete('/stones',{
    //       "sname":this.addMileStoneForm.name,
    //       "sdescription":this.addMileStoneForm.desc,
    //       "id":this.addMileStoneForm.id,
    //       "mid":this.$route.query.mid,
    //       "tid":this.$route.query.tid
    //   });
    //   this.$message.success("删除成功")
    //   this.getPlanTable()
    //   console.log(res);
    // },

    //4.删除里程碑
    async deleteMilestone (sid) {
      this.addMileStoneForm.id=sid;
      const confirmResult = await this.$confirm("此操作将永久删除里程碑，是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      // 判断是否点击了按钮
      if (confirmResult !== 'confirm') return this.$message.info("取消了删除")
      console.log(sid);
      console.log(this.$route.query.mid+"--"+this.$route.query.tid);
      const { data: res } = await this.$http.post('http://192.168.43.20:80/stones/'+sid);
      this.$message.success("删除成功")
      this.getPlanTable()
      console.log(res);
    },
    //5.删除活动编号
    async deleteActivityNumber (id) {
      const confirmResult = await this.$confirm("此操作将永久删除活动编号，是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      // 判断是否点击了按钮
      if (confirmResult !== 'confirm') return this.$message.info("取消了删除")
      console.log(id);
      const { data: res } = await this.$http.delete('http://192.168.43.20:80/activity/'+id);
      this.tableData = res.data;
      this.$message.success("删除成功")
      this.getPlanTable()
      console.log(res);
    },
    // 6.修改里程碑
    async modifyMilestone () {
      this.modifyMilestoneDialogVisible = false
      const { data: res } = await this.$http.put('http://192.168.43.20:80/stones', {
          "sname":this.addMileStoneForm.name,
          "sdescription":this.addMileStoneForm.desc,
          "id":this.addMileStoneForm.id,
          "mid":this.$route.query.mid,
          "tid":this.$route.query.tid
      })
      this.getPlanTable()
      console.log(res);
    },
    // 7.修改活动编号
    async modifyActivityNumber () {
      this.modifyActivityDialogVisible = false
      const { data: res } = await this.$http.put('http://192.168.43.20:80/activity', {
            "aname": this.ActivityForm.name,
            "process":this.ActivityForm.rate,
            "id":this.ActivityForm.id,
            "bonus":this.ActivityForm.source,
            "iscrop":this.ActivityForm.iscrop,
            "front":this.ActivityForm.pre,
            "achievement":this.ActivityForm.achievement,
            "type":this.ActivityForm.activityType,
            "asort":this.ActivityForm.sort,
            "adescription":this.ActivityForm.describe,
            "quota":10,
            "sid":this.ActivityForm.sid,
            "mid":this.$route.query.mid,
            "tid":this.$route.query.tid
      })
      this.getPlanTable()
      console.log(res);
    },



        //一些界面用的方法
        //1.绑定修改里程碑按钮，点击时给接口传递参数
        modifyMilestoneButton(sname,describe,sid){
          this.modifyMilestoneDialogVisible = true;
          this.addMileStoneForm.name=sname;
          this.addMileStoneForm.desc=describe;
          this.addMileStoneForm.id=sid;
        },
        //2.绑定修改活动编号按钮，点击时给接口传递参数
        modifyActivityNumberButton(aid,sid){
          this.modifyActivityDialogVisible=true;
          this.ActivityForm.id=aid;
          this.ActivityForm.sid=sid;
        },

        //3.绑定增加活动编号按钮，点击时给接口传递参数
        addActivityNumberButton(milestoneId){
          this.addActivityDialogVisible=true;
          this.ActivityForm.sid=milestoneId;
        },


        //在当前行下方新增行
    addRow(){
        this.tableData.splice(this.currentIndex + 1,0,{
            milestone: '',
            number: '完成需求分析',
            pre: '',
            achievement: '毛利分析表格',
            activity: '',
            rate:'',
            source: '',
            percent: '',
            fixation: '',
            cut: '否',
        })
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        handleEdit(index, row) {
            console.log(index, row);
        },

        handleChange(value) {
            console.log(value);
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                    console.log(this.ruleForm);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    }
}
</script>
