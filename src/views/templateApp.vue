0<template>
  <div id="app" >

      <div class="box-top" >
          <div id="top" >
              <ul>
                  <li> CTG NET-OSS 运营门户2</li>
                  <li><a class="item1 underline" href="# ">列表</a></li>
                  <li><a class="item underline" href="# ">项目看板</a></li>
                  <li><a class="item underline" href="# ">任务</a></li>
                  <li><a class="item underline" href="# ">成员</a></li>
                  <li><a class="item underline" href="# " target="_self">项目管理</a></li>
                  <li><a class="item underline" href="# ">概况</a></li>
                  <li><a class="item underline" href="# ">计划</a></li>
                  <li><a class="item underline" href="# ">奖金</a></li>
                  <li><a class="item underline" href="# ">考核</a></li>
                  <li><a class="item underline" href="# ">预算费用</a></li>
                  <li><a class="item underline" href="# ">风险</a></li>
                  <li><a class="item underline" href="# ">文档</a></li>
              </ul>
          </div>
      </div>

      <div class="box">
          <div class="box-left">
          <div class=".comp-tr-node--btns" >
              <h1 style="font-size: 20px;top: 0px;float: left;color: black">模板列表</h1>
              <el-button  type="text" style="margin-top: 8px;float: contour;font-size: 15px"><span @click="handleNewMoudle">+新建模块</span></el-button>
              <div class="block" style="float: left">
                  <!-- <p>使用 scoped slot</p> -->
                  <el-tree
                          :data="data"
                          node-key="id"
                          :expand-on-click-node="false"
                          @node-drag-start="handleDragStart"
                          @node-drag-enter="handleDragEnter"
                          @node-drag-leave="handleDragLeave"
                          @node-drag-over="handleDragOver"
                          @node-drag-end="handleDragEnd"
                          @node-drop="handleDrop"
                          @node-click="handleNodeClick"

                          draggable
                          :allow-drop="allowDrop"
                          :allow-drag="allowDrag"
                  >
          <span
                  class="custom-tree-node"
                  slot-scope="{ node, data }"
                  @mouseenter="onMouseOver($event)"
                  @mouseleave="onMouseOut($event)"
          >
            <span v-if="!data.isEdit">{{ node.label }}</span>
            <span class="isEdit">
              <!-- 编辑状态 -->
              <div v-if="data.isEdit">
                <el-input
                        v-model="data.label"
                        autofocus
                        size="mini"
                        :ref="'slotTreeInput' + data[id]"
                        style="top: -2px"
                        @blur.stop="handleInput(node, data)"
                        @keyup.enter.native="handleInput(node, data)"></el-input>
              </div>

              <div v-else>
                <!-- 名称： 新增节点增加class（is-new） -->
                <span :class="[data[id] < NODE_ID_START ? 'is-new' : '','comp-tr-node--name', ]"></span>
              </div>

              <span class="comp-tr-node--btns" v-show="false">
                <el-dropdown trigger="click" @visible-change="handleDropdown">
                  <i class="el-icon-more"></i>
<!--                    三个按键绑定的方法-->
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="() => append(node, data)"><i class="el-icon-circle-plus-outline"></i>新增</el-dropdown-item>
                    <!-- <el-dropdown-item @click.native="handleEdit(node, data)"><i class="el-icon-edit"></i>编辑</el-dropdown-item> -->
                    <el-dropdown-item @click.native="() => remove(node, data)"><li class="el-icon-delete"></li>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </span></el-tree>

              </div>
          </div>
          </div>
      <div class="box-right" style="margin-left: 10px">

        <transition :duration="{enter:1500,leave:500}" name="el-fade-in-linear">
          <router-view :key="$route.fullPath"/>
        </transition>

      </div>
      </div>

  </div>
</template>

<script>
    let tid = 2;
    // 模板id
    let mid =1000;
    // 模板label
    let label='';
export default {
  name: 'templateApp',
    data() {


        return {
            currentEle: null,
            dropdownShow: false,
            setTree: [],
            id: "id",
            MAX_LEVEL: 2,
            NODE_ID_START: 0,
            startId: null,

            //返回的各种数据
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label',
            }
        };
    },
    props: {
        bool: {
            type: Boolean,
            default: false,
        },
    },
    created() {
        this.startId = this.NODE_ID_START;
        this.getData();
    },
    methods: {
        //左边树形菜单接口
        //1.每次打开页面
        async getData(){
            const { data: res } = await this.$http.get('/model');
            this.data=res.data;
            console.log(this.data);
        },

        //2.点击节点请求模板数据接口,这个接口会将左边树形结构的数据传给跳转的页面，跳转的页面根据传过去的模板号和版本号请求相应的数据渲染。
         handleNodeClick(node,data) {
            console.log("mid:"+node.id);
            console.log("tid:"+node.parentID);
            this.$router.push({ path: data.data.url, query: {tid:node.parentID,mid:node.id}})
        },


        //新增模板
        handleNewMoudle() {
            this.data.push({
                id: tid++,
                label: label,
                url:'/RealHome',
                children: [],
                isEdit: true,
            });
        },
        // //3.新增版本号
        // //增加版本方法，添加按钮，maxlevel在上面设置为2.最多两层,下面那个是移除
        async append(node, data) {
          console.log("aaa"+data.id)
            if (node.level >= this.MAX_LEVEL) {
                this.$message.warning(
                    "当前目录已达到" + this.MAX_LEVEL + "级，无法新增！"
                );
                return false;
            }
            const newChild = {
                id: mid++,
                label: label,
                url :'/HomeView',
                children: [],
                isEdit: true,
                parentID:data.id
            };

            //this.$set向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新，本质就是把更新的数据能够显示出来
            //！用来转boolen
            if (!data.children) {
                this.$set(data, "children", []);
            }
            //推动新值
            data.children.push(newChild);
            //确保能正确显示更改后的值
            this.$nextTick(() => {
                if (this.$refs["slotTreeInput" + data[this.id]]) {
                    this.$refs["slotTreeInput" + data[this.id]].$refs.input.focus();
                }
            });
            console.log("node"+node.children);
        },

        handleDropdown(v) {
            this.dropdownShow = v;
            if (v) return;
            this.currentEle.style.cssText += "display:none";
        },
        //鼠标操作，包括悬停移除等反应。style.cssText本质就是设置style，这里跟数据无关可略过
        onMouseOver: function (event) {
            event.target.parentElement.querySelector(
                ".comp-tr-node--btns"
            ).style.cssText += "display:block";
            this.currentEle = event.target.parentElement.querySelector(
                ".comp-tr-node--btns"
            );
        },

        onMouseOut: function (event) {
            if (this.dropdownShow) return;
            event.target.parentElement.querySelector(
                ".comp-tr-node--btns"
            ).style.cssText += "display:none";
        },

        //1.删除接口
        async remove(node, data) {
            // const parent = node.parent;
            // const children = parent.data.children || parent.data;
            // const index = children.findIndex((d) => d.id === data.id);
            // children.splice(index, 1);
        //    通过splice进行删除，用index判断是哪一行，然后删除置1

            if(node.id>=1000){//输入的是版本
                console.log("model");
              console.log("----"+data.id)
                  const { data: res } = await this.$http.delete('http://192.168.43.20:80/model/'+data.id+'/'+data.parentID)
                   console.log(res);
                   this.getData();
                }else{//输入的是模板
                console.log("template");
                console.log("----"+node.id)
                  const { data: res } = await this.$http.delete('http://192.168.43.20:80/template/'+data.id)
                  this.getData();
                  console.log(res);
                }
        },

        //2.新增接口
        async handleInput(node, data) {
            console.log(node, data);
            if (data.isEdit) {
                this.$set(data, "isEdit", false);
                label=data.label;
                console.log("输入的label: "+label);
                console.log("输入的label的id: "+data.id);
                console.log("输入的label的父节点id: "+data.parentID);
                if(data.id>=1000){//输入的是版本
                console.log("model\n");
                  console.log(node.id)
                  const { data: res } = await this.$http.post('http://192.168.43.20:80/model', {
                  tid:data.parentID,
                  name:data.label
            })
                }else{//输入的是模板
                console.log("template\n");
                  console.log(node.id)
                  const { data: res } = await this.$http.post('http://192.168.43.20:80/template', {

                        name:data.label
                  })
                }
            }
        },
        //3.修改接口
        async handleEdit(node, data) {
            console.log(node, data);

            if (!data.isEdit) {
                this.$set(data, "isEdit", true);
            }
            // this.$nextTick(() => {
            //     if (this.$refs["slotTreeInput" + data[this.id]]) {
            //         this.$refs["slotTreeInput" + data[this.id]].$refs.input.focus();
            //     }
            // });

            //     if(node.id>=1000){//输入的是版本
            //     console.log("model");
            //       const { data: res } = await this.$http.put('/model', {
            //       tid:data.parentID,
            //       mid:data.id,
            //       name:data.label
            // })
            //     }else{//输入的是模板
            //     console.log("template");
            //       const { data: res } = await this.$http.put('/template', {
            //             id:data.id,
            //             name:data.label
            //       })
            //     }

        },

        //拖拽点击事件，官方文档（可删，略有冲突，这个拖拽会占用鼠标点击悬停的事件）
        handleDragStart(node, ev) {
            // console.log("drag start", node);
        },
        handleDragEnter(draggingNode, dropNode, ev) {
            //console.log("tree drag enter: ", dropNode.label);
        },
        handleDragLeave(draggingNode, dropNode, ev) {
            // console.log("tree drag leave: ", dropNode.label);
        },
        handleDragOver(draggingNode, dropNode, ev) {
            // console.log("tree drag over: ", dropNode.label);
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            // console.log("tree drag end: ", dropNode && dropNode.label, dropType);
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            // console.log("tree drop: ", dropNode.label, dropType);
        },
        //拖拽点击事件
        allowDrop(draggingNode, dropNode, type) {
            if (dropNode.data.label === "二级 3-1") {
                return type !== "inner";
            } else {
                return true;
            }
        },
        allowDrag(draggingNode) {
            return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
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

        },
    },

    beforeCreate () {
        document.querySelector('body').setAttribute('style', 'background-color:gray');
    },
}
</script>
<!--下面是样式设置，你应该用不着-->
<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.box{
    display: flex;
    height: 100%;
    display: grid;
    grid-template-columns: 320px 1fr 0.008fr;
    background-color: gray;

}
.box-left{
    /*height: 100%;*/
    /*width: 260px;*/
    /*color: white;*/
    /*background-color: white;*/
    /*float: left;*/
    padding: 19px;
    /*margin-left: 10px;*/
    /*margin-right: 10px;*/
    background-color: white;
    margin-left: 10px;
    width: 260px;
}
.box-right{
    /*display: flex;*/
    /*!*float: right;*!*/
    /*background-color: white;*/
    /*width: 83.5rem;*/
    /*height: 100%;*/
    padding: 0px;
    /*margin-right: 5px;*/
    background-color: white;


}
.box-top{
    margin-top: -12px;
    padding: 10px;
}
.allC {
    margin-left: 21px;
    margin-bottom: 5px;}
i {
    color: #c0c4cc;
}
.allCase {
    margin-left: 8px;
    color: #606266;
    font-size: 14px;
}


.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.isEdit {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}


.el-icon-plus {
    margin: 10px 0 0 22px;
    color: #606266;
    font-size: 14px;}
span {
    margin-left: 10px;
    font-size: 14px;
}


</style>
