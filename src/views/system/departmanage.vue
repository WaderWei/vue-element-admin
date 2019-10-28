<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div style="text-align: center"><h1>部门与用户</h1></div>
      </el-col>
    </el-row>
    <el-row :gutter="40" style="margin: 10px 0">
      <el-col :lg="8" :xs="24" :span="8" style="margin: 10px 0">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: larger">部门管理</span>
            <el-button style="float: right;" type="primary" plain>添加一级部门</el-button>
          </div>
          <el-row>
            <el-input
              v-model="filterText"
              placeholder="输入要搜索的部门"
            />
          </el-row>
          <el-row style="margin: 10px 0">
            <div class="custom-tree-container">
              <div class="block">
                <el-tree
                  ref="tree"
                  class="filter-tree"
                  :data="deptData"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  :props="{label: 'name'}"
                >
                  <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button
                        type="text"
                        icon="el-icon-circle-plus-outline"
                        size="mini"
                        ic
                        @click="() => append(data)"
                      />
                      <el-button type="text" icon="el-icon-edit" size="mini" @click="() => remove(node, data)" />
                      <el-button type="text" icon="el-icon-delete" size="mini" @click="() => remove(node, data)" />
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </el-row>
        </el-card>
      </el-col>
      <el-col :lg="16" :xs="24" :span="15" style="margin: 10px 0">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: larger">员工管理</span>
            <el-button style="float: right;" type="primary" plain>添加员工</el-button>
          </div>
          <el-row>
            <el-input v-model="input3" placeholder="请输入内容" class="input-with-select">
              <el-select slot="prepend" v-model="select" placeholder="请选择">
                <el-option label="日期" value="1" />
                <el-option label="姓名" value="2" />
                <el-option label="地址" value="3" />
              </el-select>
              <el-button slot="append" icon="el-icon-search" class="btn-select" />
            </el-input>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-table :data="tableData" border>
              <el-table-column prop="date" label="日期" />
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="address" label="地址" />
              <el-table-column
                fixed="right"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button icon="el-icon-edit" type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)" />
                  <el-button icon="el-icon-delete" type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)" />
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row type="flex" justify="end">
            <el-pagination
              background
              :page-size="10"
              layout="prev, pager, next"
              :total="100"
            />
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
let id = 1000
import { findAll } from '@/api/dept'

export default {
  name: 'DepartManage',
  data() {
    return {
      deptData: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市'
      }],
      filterText: '',
      input3: '',
      select: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchDeptData()
  },
  methods: {
    fetchDeptData() {
      findAll().then(req => {
        debugger
        this.deptData = req.data
      }).catch(error => {
        console.log(error)
      })
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
