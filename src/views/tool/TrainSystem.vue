<template>
  <div class="ts-contain">
    <div class="ts-table">
      <div class="ts-left">
        <div class="ts-head">
          <el-input
            v-model="mobileNum"
            placeholder="请输入课程id"
            clearable
          />
          <el-button @click="findCourse">查找</el-button>
        </div>

        <div class="ts-head1">
          <el-input
            v-model="userName"
            placeholder="请输入姓名"
            clearable
          />
          <el-button @click="findUser">查找</el-button>
        </div>
        <div>
          <el-table
            :data="classInfos"
            style="width: 100%"
            @row-click="findStudent"
          >
            <el-table-column
              label="课程 ID"
              prop="classId"
            />
            <el-table-column
              label="课程名称"
              prop="className"
            />
            <el-table-column
              label="培训人"
              prop="classSpeaker"
            />
            <el-table-column
              label="部门"
              prop="classDep"
            />
            <el-table-column
              label="课程状态"
              prop="classTestTest"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template v-if="scope.row.classTestStatus === 1" slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >更新试卷为可编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="ts-right">
        <el-table
          :data="users"
          style="width: 100%"
        >
          <el-table-column
            label="id"
            prop="id"
          />
          <el-table-column
            label="姓名"
            prop="lastName"
          />
          <el-table-column
            label="学习状态"
            prop="studyStatus"
          />
          <el-table-column
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="DeleteUser(scope.$index, scope.row)"
              >Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { findClassInfos, findUsersByClassId, updateClassInfo, deleteUser } from '@/api/classInfo'
export default {
  name: 'TrainSystem',
  data() {
    return {
      mobileNum: 0,
      classInfos: [],
      users: [],
      isExpand: false,
      userName: ''
    }
  },
  created() {
    this.findCourse()
  },
  methods: {
    findCourse() {
      findClassInfos(this.mobileNum).then(req => {
        this.classInfos = req.data
      }).catch(error => {
        console.log(error)
      })
    },
    handleEdit(index, row) {
      updateClassInfo(row.classId).then(req => {
        if (req.data === 1) {
          this.$alert('编辑成功', ' 成功', {
            confirmButtonText: '确定',
            callback: action => {
              this.findCourse()
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    findStudent(row, expandedRows) {
      this.isExpand = true
      findUsersByClassId(row.classId).then(req => {
        this.users = req.data
      }).catch(err => {
        console.log(err)
      })
    },
    DeleteUser(index, row) {
      deleteUser(row.classId, row.id).then(req => {
        if (req.data === 1) {
          this.$alert('删除成功', ' 成功', {
            confirmButtonText: '确定',
            callback: action => {
              this.findStudent(row)
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    findUser() {
      const str = this.userName
      this.users = this.users.filter(u => u.lastName.indexOf(str) !== -1)
    }
  }
}
</script>

<style scoped>
  .ts-contain{
  }
  .ts-head{
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    position: fixed;
    top: 12%;
    z-index: 1000;
  }
  .ts-head1{
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    position: fixed;
    top: 12%;
    right: 20%;
    z-index: 1000;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .ts-table{
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: start;
  }
  .ts-left{
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    width: 60%;
  }
  .ts-right{
    width: 30%;
    margin-left: 50px;
   /* position: fixed;
    right: 20px;*/
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
