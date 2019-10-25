<template>
  <div class="container">
    <el-row>
      <el-col :span="24"><h1 style="text-align: center">{{ $t('system.deptStructure') }}</h1></el-col>
    </el-row>
    <div class="top-chose">
      <el-switch
        v-model="expandAll"
        active-text="展开"
        inactive-text="收缩"
        @change="expandChange"
      />
    </div>
    <div class="text-center">
      <vue2-org-tree
        name="test"
        :data="data"
        :horizontal="horizontal"
        :collapsable="collapsable"
        :label-class-name="labelClassName"
        :render-content="renderContent"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'DepartmentStructure',
  data() {
    return {
      data: {
        id: 0,
        label: '未央科技有限公司',
        children: [
          {
            id: 1,
            label: '软件部',
            children: [{
              id: 4,
              label: '软件部1',
              children: [{
                id: 9,
                label: '软件部2'
              }, {
                id: 10,
                label: '软件部3'
              }]
            }]
          },
          {
            id: 2,
            label: '销售部',
            children: [{
              id: 5,
              label: '销售部1'
            }, {
              id: 6,
              label: '销售部2'
            }]
          },
          {
            id: 3,
            label: '生产部',
            children: [{
              id: 7,
              label: '生产部1'
            },
            {
              id: 8,
              label: '生产部2'
            }]
          }
        ]
      },
      horizontal: true,
      collapsable: true,
      expandAll: true,
      labelClassName: 'bg-white'
    }
  },
  created() {
    this.toggleExpand(this.data, this.expandAll)
  },
  methods: {
    renderContent(h, data) {
      return data.label
    },
    onExpand(e, data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    // 点击选项执行的方法，可以用于跳转到其他链接，注意一定要写协议头
    onNodeClick(e, data) {
      if (data.url == null) {
        return false
      } else {
        window.open(data.url)
      }
    },
    collapse(list) {
      var _this = this
      list.forEach(function(child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    expandChange() {
      this.toggleExpand(this.data, this.expandAll)
    },
    toggleExpand(data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function(item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    }
  }
}
</script>
<style type="text/css">
  .container{
  }
  .top-chose{
      margin: 20px;
  }
  .org-tree-node-label {
    white-space: nowrap;
  }
</style>
