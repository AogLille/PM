<template>
  <div class="box">

    <div id="top">
      <ul>
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
        <li><a class="item underline" href="http://localhost:3001">计划模板</a></li>
      </ul>
    </div>

    <div class="body">

      <div class="body_top">
        <span>
          <h3 style="width:200px">{{this.$route.query.name}}</h3>
        </span>
        <span class="menu_register">
          <el-button icon="el-icon-user" size="small" circle @click="register()"
                     :disabled="$store.state.user.roleid ==2"></el-button>
        </span>
        <span class="register">
          <el-button type="text" style="color: #94959E" @click="register()"
                     :disabled="$store.state.user.roleid ==2">用户注册</el-button>
        </span>
        <span class="menu">
          <el-button icon="el-icon-switch-button" size="small" circle @click="logout()"></el-button>
        </span>
        <span class="close">
          <el-button type="text" style="color: #94959E" @click="logout()">退出登录</el-button>
        </span>
      </div>





      <div class="body_center">
        <table>
          <tr>
            <td class="one">当前进度：<strong>{{ navigationData.currentProgress }}%</strong></td>
            <td class="one">待确认进度：<strong>{{ navigationData.confirmProgress }}%</strong></td>
            <td class="one">下月进度：<strong>{{ navigationData.mouthProgress }}%</strong></td>
            <td class="one">季末进度：<strong>{{ navigationData.seasonProgress }}%</strong></td>
            <td class="one">年末进度：<strong>{{ navigationData.yearProgress }}%</strong></td>
            <td class="one">偏差类型：<strong>{{ navigationData.biasType }}</strong></td>
          </tr>
          <tr>
            <td class="two" style="width: 700px">偏差分析：<strong>{{ navigationData.biasAnalysis }}</strong></td>
            <td><strong></strong></td>
            <td><strong></strong></td>
            <td class="two">说明：<strong>{{ navigationData.illustrate }}</strong></td>
          </tr>
        </table>
      </div>

      <!--主体表格部分  -->
      <div class="body_bottom">
        <el-table :data="tableData" border style="width: 100%" :cell-style="rowStyle">
          <el-table-column fixed prop="milestoneName" label="里程碑" width="200" align="center">
          </el-table-column>
          <el-table-column prop="activityName" label="活动编号" width="180" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.activityName }}
              </div>
              <div>
                <el-tag type="success" v-if="scope.row.status == '1'">已完成</el-tag>
                <el-tag type="danger" v-if="scope.row.status == '2'">主管待确认</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="progressRatio" label="进度占比(%)" width="120" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.progressRatio }}%
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="计划成本（人/日）" width="150" align="center">
            <template slot-scope="scope">
              <div :style="{ color: scope.row.charge ? 'red' : '' }">
                {{ scope.row.cost }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="charge" label="负责人" width="150" align="center">
          </el-table-column>
          <el-table-column prop="startTime" label="计划开始时间" width="150" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.startTime }}
              </div>
              <div v-if="scope.row.startTimeReally && scope.row.status!='0'" style="color: red">
                {{ scope.row.startTimeReally}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="计划结束时间" width="150" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.endTime }}
              </div>
              <div v-if="scope.row.endTimeReally && scope.row.status!='0'" style="color: red">
                {{ scope.row.endTimeReally}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sortNumber" label="排序" width="50" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="340" align="center">
            <template slot-scope="scope">
              <!-- scope.row.states=='0' 里程碑-->
              <el-button type="text" size="small" @click="addMilestoneDialogVisible = true" v-if="scope.row.status == '0'">增加里程碑
              </el-button>
              <el-button type="text" size="small" v-if="scope.row.status == '0'" @click="addActivity(scope.row.milestoneId)">增加活动编号</el-button>
              <el-button type="text" size="small" v-if="scope.row.status == '0'" @click.prevent="modifyMilestoneButton(scope.row.milestoneId,scope.row.progressRatio)">修改
              </el-button>
              <el-button type="text" size="small" v-if="scope.row.status == '0'"
                @click.prevent="deleteMilestone(scope.row.milestoneId)">删除</el-button>

              <!-- scope.row.states=='1' 活动编号-->
              <el-button type="text" size="small" v-if="scope.row.status == '1' || scope.row.status == '2' || scope.row.status == '3'"
                :disabled="scope.row.status == '1' || scope.row.status == '2' || $store.state.user.roleid ==1" @click="finishButton(scope.row.activityId,scope.row.cost,scope.row.startTimeReally,scope.row.endTime)">完成
              </el-button>
              <el-button type="text" size="small" v-if="scope.row.status == '1' || scope.row.status == '2' || scope.row.status == '3'"
                :disabled="scope.row.status == '1' || scope.row.status == '3' ||$store.state.user.roleid ==2" @click="revokeActivity(scope.row.activityId)">撤回
              </el-button>
              <el-button type="text" size="small" v-if="scope.row.status == '1' || scope.row.status == '2' || scope.row.status == '3'"
                :disabled="scope.row.status == '1' || scope.row.status == '3' ||$store.state.user.roleid ==2" @click="terminateActivity(scope.row.activityId)">结束
              </el-button>
              <el-button type="text" size="small" v-if="scope.row.status == '1' || scope.row.status == '2' || scope.row.status == '3'"
                :disabled="scope.row.status == '1' || scope.row.status == '2' || $store.state.user.roleid ==1" @click="modifyActivityButton(scope.row.activityId,scope.row.milestoneId)">修改
              </el-button>
              <el-button type="text" size="small"
                v-if="scope.row.status == '1' || scope.row.status == '2' || scope.row.status == '3'"
                :disabled="scope.row.status == '1' || scope.row.status == '2' || $store.state.user.roleid ==1" @click="deleteActivityNumber(scope.row.activityId)">删除
              </el-button>
              <!-- 详情暂时不写。。。 -->
              <!-- 里程碑弹窗 -->
              <el-button type="text" size="small" @click="detailsButton(scope.row.milestoneId,scope.row.activityId,scope.row.activityName,scope.row.milestoneName,scope.row.progressRatio,scope.row.startTime,scope.row.endTime)">详情
              </el-button>
              <!-- 活动编号弹窗 -->
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

          <!-- 用到的弹窗 -->


          <!-- 1.增加里程碑弹窗 -->
        <el-dialog title="增加里程碑" :visible.sync="addMilestoneDialogVisible" :append-to-body="true"
                @close="resetForm('addMileStoneForm')">
                <el-form :model="addMileStoneForm" :rules="rules" ref="addMileStoneForm" label-width="100px"
                  class="demo-ruleForm">
                  <el-form-item label="里程碑名称" :label-width="formLabelWidth">
                    <el-input type="input" v-model="addMileStoneForm.milestoneName" placeholder="请输入1-10个字符的名称"></el-input>
                  </el-form-item>
                 <el-form-item label="成本(人/日)"  :label-width="formLabelWidth">
                          <el-input-number v-model="addMileStoneForm.cost" placeholder="请输入计划成本(人/日)" style="width: 225px"
                                           controls-position="right" :min="1" :max="100">
                          </el-input-number>
                  </el-form-item>
                  <el-form-item label="计划开始时间" :label-width="formLabelWidth">
                        <el-date-picker @input="$forceUpdate()" v-model="addMileStoneForm.startTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="计划结束时间" :label-width="formLabelWidth">
                        <el-date-picker @input="$forceUpdate()" v-model="addMileStoneForm.endTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addMilestoneDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addMilestone()">确 定</el-button>
                </div>
        </el-dialog>

          <!--2.增加活动编号弹窗-->
              <el-dialog
                      title="提示"
                      :visible.sync="addActivityDialogVisible"
                      :append-to-body="true"
                      width="30%">

                  <el-form :model="ActivityForm" :rules="rules" ref="ActivityForm" label-width="110px" class="demo-ruleForm">
                      <el-form-item label="活动编号名称" >
                          <el-input v-model="ActivityForm.activityNumber"></el-input>
                      </el-form-item>
                      <el-form-item label="进度占比(%)" >
                          <el-input-number v-model="ActivityForm.rate" placeholder="请输入进度占比" style="width: 225px"
                                           controls-position="right"  :min="1" :max="100">
                          </el-input-number>
                      </el-form-item>
                      <el-form-item label="成本(人/日)" >
                          <el-input-number v-model="ActivityForm.cost" placeholder="请输入计划成本(人/日)" style="width: 225px"
                                           controls-position="right" :min="1" :max="100">
                          </el-input-number>
                      </el-form-item>
                      <el-form-item label="负责人" >
                          <el-input v-model="ActivityForm.principal"></el-input>
                      </el-form-item>
                      <el-form-item label="计划开始时间" >
                          <el-date-picker @input="$forceUpdate()" v-model="ActivityForm.startTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                      </el-form-item>
                      <el-form-item label="计划结束时间" >
                          <el-date-picker @input="$forceUpdate()" v-model="ActivityForm.endTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                      </el-form-item>

                  </el-form>


                  <span slot="footer" class="dialog-footer">
                  <el-button @click="addActivityDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="addActivityNumber()">确 定</el-button>
                </span>
              </el-dialog>

              <!-- 3.修改活动编号弹窗 -->
              <el-dialog
                      title="修改活动编号"
                      :visible.sync="modifyActivityDialogVisible"
                      :append-to-body="true"
                      width="30%">

                  <el-form :model="ActivityForm" :rules="rules" ref="ActivityForm" label-width="110px" class="demo-ruleForm">
                      <el-form-item label="活动编号名称" >
                          <el-input v-model="ActivityForm.activityNumber"></el-input>
                      </el-form-item>
                      <el-form-item label="进度占比(%)"  >
                          <el-input-number placeholder="请输入进度占比" style="width: 225px" v-model="ActivityForm.rate"
                                           controls-position="right" :min="1" :max="100"></el-input-number>
                      </el-form-item>
                      <el-form-item label="成本(人/日)" >
                          <el-input-number v-model="ActivityForm.cost" placeholder="请输入计划成本(人/日)" style="width: 225px"
                                           controls-position="right" :min="1" :max="100">
                          </el-input-number>
                      </el-form-item>
                      <el-form-item label="负责人" >
                          <el-input v-model="ActivityForm.principal"></el-input>
                      </el-form-item>
                      <el-form-item label="计划开始时间" >
                          <el-date-picker @input="$forceUpdate()" v-model="ActivityForm.startTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                      </el-form-item>
                      <el-form-item label="计划结束时间" >
                          <el-date-picker @input="$forceUpdate()" v-model="ActivityForm.endTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                      </el-form-item>

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
                                    <el-form-item label="里程碑名称" :label-width="formLabelWidth">
                    <el-input type="input" v-model="addMileStoneForm.milestoneName" placeholder="请输入1-10个字符的名称"></el-input>
                  </el-form-item>
                 <el-form-item label="成本(人/日)"  :label-width="formLabelWidth">
                          <el-input-number v-model="addMileStoneForm.cost" placeholder="请输入计划成本(人/日)" style="width: 225px"
                                           controls-position="right" :min="1" :max="100">
                          </el-input-number>
                  </el-form-item>
                  <el-form-item label="计划开始时间"  :label-width="formLabelWidth">
                        <el-date-picker @input="$forceUpdate()" v-model="addMileStoneForm.startTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="计划结束时间"  :label-width="formLabelWidth">
                        <el-date-picker @input="$forceUpdate()" v-model="addMileStoneForm.endTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="modifyMilestoneDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="modifyMilestone()">修改</el-button>
                </div>
              </el-dialog>


              <!-- 5.活动详情弹窗 -->
              <el-dialog
                      title="详情"
                      :visible.sync="detailsDialogVisible"
                      :append-to-body="true"
                      width="30%">
                  <el-form :model="detailsForm" :rules="rules" ref="detailsForm" label-width="110px" class="demo-ruleForm">
                      <el-form-item label="名称" >
                          <el-input v-model="detailsForm.activityNumber"></el-input>
                      </el-form-item>
                       <el-form-item label="进度占比(%)" >
                          <el-input v-model="detailsForm.rate"></el-input>
                      </el-form-item>
                         <el-form-item label="奖金来源" >
                          <el-input v-model="detailsForm.source"></el-input>
                      </el-form-item>
                          <el-form-item label="是否可裁剪" >
                          <el-switch v-model="ActivityForm.cut"
                                     active-value="是"
                                     inactive-value="否"
                          ></el-switch>
                      </el-form-item>
                      <el-form-item label="前置活动" >
                         <el-input v-model="detailsForm.pre"></el-input>
                      </el-form-item>
                      <el-form-item label="输出成果物" >
                          <el-input v-model="detailsForm.achievement"></el-input>
                      </el-form-item>
                      <el-form-item label="活动编号类型">

                      </el-form-item>
                      <el-form-item label="排序">
                          <el-input v-model="detailsForm.rank"></el-input>
                      </el-form-item>
                       <el-form-item label="计划开始时间"  :label-width="formLabelWidth">
                        <el-date-picker @input="$forceUpdate()" v-model="detailsForm.startTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="计划结束时间"  :label-width="formLabelWidth">
                        <el-date-picker @input="$forceUpdate()" v-model="detailsForm.endTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                      <el-form-item label="活动编号描述">
                          <el-input type="textarea" v-model="detailsForm.describe"></el-input>
                      </el-form-item>
                  </el-form>

                  <span slot="footer" class="dialog-footer">
                  <el-button @click="detailsDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="details()">修改</el-button>
                </span>
              </el-dialog>

              <!-- 6.里程碑详情弹窗 -->
              <el-dialog
                      title="详情"
                      :visible.sync="detailsDialogVisible"
                      :append-to-body="true"
                      width="30%">
                  <el-form :model="detailsForm" :rules="rules" ref="detailsForm" label-width="110px" class="demo-ruleForm">
                      <el-form-item label="编号名称" >
                          <el-input v-model="detailsForm.activityNumber"></el-input>
                      </el-form-item>
                       <el-form-item label="进度占比(%)" >
                          <el-input v-model="detailsForm.rate"></el-input>
                      </el-form-item>
                         <el-form-item label="奖金来源" >
                          <el-input v-model="detailsForm.source"></el-input>
                      </el-form-item>
                          <el-form-item label="是否可裁剪" >
                          <el-switch v-model="ActivityForm.cut"
                                     active-value="是"
                                     inactive-value="否"
                          ></el-switch>
                      </el-form-item>
                      <el-form-item label="前置活动" >
                         <el-input v-model="detailsForm.pre"></el-input>
                      </el-form-item>
                      <el-form-item label="输出成果物" >
                          <el-input v-model="detailsForm.achievement"></el-input>
                      </el-form-item>
                      <el-form-item label="活动编号类型">

                      </el-form-item>
                      <el-form-item label="排序">
                          <el-input v-model="detailsForm.rank"></el-input>
                      </el-form-item>
                       <el-form-item label="计划开始时间"  :label-width="formLabelWidth">
                        <el-date-picker @input="$forceUpdate()" v-model="detailsForm.startTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="计划结束时间"  :label-width="formLabelWidth">
                        <el-date-picker @input="$forceUpdate()" v-model="detailsForm.endTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                      <el-form-item label="活动编号描述">
                          <el-input type="textarea" v-model="detailsForm.describe"></el-input>
                      </el-form-item>
                  </el-form>

                  <span slot="footer" class="dialog-footer">
                  <el-button @click="detailsDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="details()">修改</el-button>
                </span>
              </el-dialog>

    <!--7.完成弹窗-->
    <el-dialog
        title="提示"
        :visible.sync="finishsDialogVisible"
        :append-to-body="true"
        width="30%">

      <el-form :model="finish" :rules="rules" ref="ActivityForm" label-width="110px" class="demo-ruleForm">
        <el-form-item label="成本(人/日)" >
          <el-input-number v-model="finish.cost" placeholder="请输入计划成本(人/日)" style="width: 225px"
                           controls-position="right" :min="1" :max="100">
          </el-input-number>
        </el-form-item>
        <el-form-item label="实际计划开始时间" >
          <el-date-picker @input="$forceUpdate()" v-model="finish.startTimeReally" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="实际计划结束时间" >
          <el-date-picker @input="$forceUpdate()" v-model="finish.endTimeReally" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>

      </el-form>


      <span slot="footer" class="dialog-footer">
                  <el-button @click="finishsDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="finishActivity()">确 定</el-button>
                </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  // 每次created时都要请求数据
  created () {
    this.getPlanTable()
  },


  //method
  methods: {
    // 接口
    // 1.请求计划表数据
    async getPlanTable () {
      const { data: res } = await this.$http.get('/planAddPage/listAll')
      this.tableData = res.data.list;
      this.navigationData = res.data;
      console.log(res.data.list);
    },
    //2.增加里程碑
    async addMilestone () {
      this.addMilestoneDialogVisible = false
      const { data: res } = await this.$http.post('/planAddPage/Milestone', {
        name:this.addMileStoneForm.milestoneName,
        cost:this.addMileStoneForm.cost,
        startTime:this.addMileStoneForm.startTime,
        endTime:this.addMileStoneForm.endTime
      })
      this.getPlanTable()
    },
    // 3.删除里程碑
    async deleteMilestone (id) {
      const confirmResult = await this.$confirm("此操作将永久删除里程碑，是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      // 判断是否点击了按钮
      if (confirmResult !== 'confirm') return this.$message.info("取消了删除")
      console.log(id);
      const { data: res } = await this.$http.delete('/planAddPage/Milestone/' + id);
      this.$message.success("删除成功")
      this.getPlanTable()
    },
    // 4.增加活动编号
    async addActivityNumber(){
      this.addActivityDialogVisible = false

      const {data:res} = await this.$http.post('/planAddPage/Activity',{
          name: this.ActivityForm.activityNumber,
          progressRatio:this.ActivityForm.rate,
          cost:this.ActivityForm.cost,
          charge:this.ActivityForm.principal,
          startTime:this.ActivityForm.startTime,
          endTime:this.ActivityForm.endTime,
          milestoneId:this.ActivityForm.milestoneId,
          status:3
      })
      this.getPlanTable()

    },
    // 5.删除活动编号
    async deleteActivityNumber (id) {
      const confirmResult = await this.$confirm("此操作将永久删除活动编号，是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      // 判断是否点击了按钮
      if (confirmResult !== 'confirm') return this.$message.info("取消了删除")
      const { data: res } = await this.$http.delete('/planAddPage/Activity/'+id);
      this.$message.success("删除成功")
      this.getPlanTable()
    },
    // 6.修改里程碑
    async modifyMilestone () {
      this.modifyMilestoneDialogVisible = false
      console.log(this.addMileStoneForm.progressRatio);
      const { data: res } = await this.$http.put('/planAddPage/Milestone', {
        id:this.addMileStoneForm.milestoneId,
        name:this.addMileStoneForm.milestoneName,
        progressRatio:this.addMileStoneForm.progressRatio,
        cost:this.addMileStoneForm.cost,
        startTime:this.addMileStoneForm.startTime,
        endTime:this.addMileStoneForm.endTime
      })
      this.getPlanTable()
    },

    // 7.修改活动编号
    async modifyActivityNumber () {
      this.modifyActivityDialogVisible = false
      const { data: res } = await this.$http.put('/planAddPage/Activity', {
          id:this.ActivityForm.activityId,
          milestoneId:this.ActivityForm.milestoneId,
          name:this.ActivityForm.activityNumber,
          progressRatio:this.ActivityForm.rate,
          cost:this.ActivityForm.cost,
          charge:this.ActivityForm.principal,
          startTime:this.ActivityForm.startTime,
          endTime:this.ActivityForm.endTime,
          status:this.ActivityForm.status
      })
      this.getPlanTable()
    },
    // 8.完成活动
    async finishActivity () {
      const confirmResult = await this.$confirm("确认完成?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      // 判断是否点击了按钮
      if (confirmResult !== 'confirm') return this.$message.info("取消确认操作")
      const { data: res } = await this.$http.put('/planAddPage/complete', {
        id:this.finish.activityId,
        cost:this.finish.cost,
        startTimeReally:this.finish.startTimeReally,
        endTimeReally:this.finish.endTimeReally
      });
      this.$message.success("已修改活动状态为成功")
      this.finishsDialogVisible=false;
      this.getPlanTable()
    },
    // 9.撤回活动
    async revokeActivity (id) {
      const confirmResult = await this.$confirm("确认撤回?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      // 判断是否点击了按钮
      if (confirmResult !== 'confirm') return this.$message.info("取消撤回操作")
      console.log(id);
      const { data: res } = await this.$http.get('/planAddPage/withdraw/'+ id);
       if(res.code=='20040') return this.$message.info("请在中国华东时区每月26号后修改状态")
       else{
      this.$message.success("已修改活动状态为撤回")
      this.getPlanTable()
       }
    },
    // 10.结束活动
    async terminateActivity (id) {
      const confirmResult = await this.$confirm("确认结束活动?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      // 判断是否点击了按钮
      if (confirmResult !== 'confirm') return this.$message.info("取消结束操作")
      console.log(id);
      const { data: res } = await this.$http.get('/planAddPage/end/'+id);
      console.log(res.code);
      if(res.code=='20040') return this.$message.info("sorry请在中国华东时区每月26号后修改状态")
      else{
      this.$message.success("已修改活动状态为结束")
      this.getPlanTable()
      }
    },
    // 11.详情(如果有需要)
    async details (milestoneId, activityId) {
      // this.dialogFormVisible = false
      if (milestoneId) {
        const { data: res } = await this.$http.get('/planAddPage/Milestone/', +milestoneId)
        console.log(res);
      } else {
        const { data: res } = await this.$http.get('/planAddPage/Milestone/', +activityId)
        console.log(res);
      }



    },

    //一些绑定按钮的方法
    //1.这个方法是为了绑定按钮在增加活动编号时帮助传参
    addActivity(milestoneId){
      this.addActivityDialogVisible=true;
      this.ActivityForm.milestoneId=milestoneId
    },
    //2.这个方法是为了绑定按钮在修改里程碑的时候给接口传参
    modifyMilestoneButton(milestoneId,progressRatio){
      this.modifyMilestoneDialogVisible=true;
      this.addMileStoneForm.progressRatio=progressRatio;
      this.addMileStoneForm.milestoneId=milestoneId;
    },
    //3.这个方法是为了绑定按钮在修改活动编号时给接口传参
    modifyActivityButton(activityId,milestoneId){
      this.modifyActivityDialogVisible=true;
      this.ActivityForm.activityId=activityId;
      this.ActivityForm.milestoneId=milestoneId;
    },
    //4.这个方法是为了绑定按钮在点击详情时给接口传参
    detailsButton(activityId,milestoneId,activityNumber,milestoneName,rate,startTime,endTime){
      this.detailsDialogVisible=true;
      this.detailsForm.milestoneId=milestoneId;
      this.detailsForm.activityId=activityId;
      this.detailsForm.milestoneName=milestoneName;
      this.detailsForm.activityNumber=activityNumber;
      this.detailsForm.rate=rate;
      this.detailsForm.startTime=startTime;
      this.detailsForm.endTime=endTime;
    },
    //5.绑定完成弹窗的方法
    finishButton(activityId,cost,startTimeReally,endTimeReally){
      this.finishsDialogVisible=true;
      this.finish.activityId=activityId;
    },

    //退出登录
    logout(){
      window.sessionStorage.clear();//清空sessionStorage中的存储信息
      this.$router.replace("/login");//从当前页面跳转到登录页面
    },
    //注册
    register(){
      this.$router.replace("/register");
    },
    rowStyle () {
      return "text-align:center"
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }

  },
  // 数据部分
  data () {
    return {
      // 控制弹窗是否展示的变量
      dialogTableVisible: false,
      dialogVisible:false,

      //1.增加里程碑弹窗
      addMilestoneDialogVisible: false,
      // 2.增加活动编号弹窗
      addActivityDialogVisible:false,
      //3.修改活动编号弹窗
      modifyActivityDialogVisible:false,
      //4.修改里程碑弹窗
      modifyMilestoneDialogVisible: false,
      //5.详情弹窗
      detailsDialogVisible:false,
      //6.完成弹窗
      finishsDialogVisible:false,


      //界面绑定的数据
      // 1.导航栏数据
      navigationData: '',

      // 弹窗数据
      //1.增加/修改 里程碑弹窗数据数据绑定在这里
      addMileStoneForm: {
        milestoneId: '',
        milestoneName: '',
        cost: '',
        progressRatio: '',
        startTime: '',
        endTime: '',
        status: '0'
      },
      //2.增加/修改 活动编号表单数据
      ActivityForm: {
          activityId:'',
          activityNumber: '',
          rate:'',
          cost:'',
          principal:'',
          startTime:'',
          endTime:'',
          milestoneId:'',
          status:'3'
      },
      //3.详情弹窗数据
      detailsForm: {
          milestoneId:'',
          activityNumber: '',
          activityId:'',
          rate:'',
          source: 'csgo',
          cost:'',
          principal:'',
          startTime:'',
          endTime:'',
          tailor: false,
          pre: '第一次需求分析',
          achievement: '第二次需求分析',
          activity: [],
          status:'',
          rank: '3',
          describe: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
      },
      //完成弹窗数据
      finish:{
        activityId:'',
        cost:'',
        startTimeReally:'',
        endTimeReally:''
      },


      rules: {
        milestone: [
          { required: true, message: '请输入里程碑名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '请进行排序', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px',

      // 页面表格数据
      tableData: []
    }
  }
}
</script>

<style scoped>
</style>
