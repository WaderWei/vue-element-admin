<template>
  <div class="container">
    <div class="top-chose">
      <div>
        <el-checkbox v-model="horizontal">水平</el-checkbox>
        <el-checkbox v-model="collapsable">全部</el-checkbox>
      </div>
    </div>
    <div class="middle-color-picker" />
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
  data() {
    return {
      data: {
        id: 0,
        label: '度量指标体系',
        children: [
          {
            id: 1,
            label: '交付质量',
            children: [
              {
                id: 11,
                label: '生产质量',
                children: [
                  {
                    id: 111,
                    label: '生产事件'
                  }
                ]
              },
              {
                id: 12,
                label: '开发质量',
                children: [
                  {
                    id: 121,
                    label: '项目开发缺陷密度'
                  }
                ]
              },
              {
                id: 13,
                label: '发布质量',
                children: [
                  {
                    id: 131,
                    label: '上线失败率'
                  }
                ]
              },
              {
                id: 14,
                label: '过程质量',
                children: [
                  {
                    id: 141,
                    label: '项目过程符合度'
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            label: '交付效能',
            children: [
              {
                id: 21,
                label: '交付能力',
                children: [
                  {
                    id: 211,
                    label: '功能点产出'
                  },
                  {
                    id: 212,
                    label: '代码行产出'
                  },
                  {
                    id: 213,
                    label: '上线投产次数'
                  },
                  {
                    id: 214,
                    label: '接收需求数'
                  },
                  {
                    id: 215,
                    label: '立项数'
                  },
                  {
                    id: 216,
                    label: '结项数'
                  },
                  {
                    id: 217,
                    label: '迭代速率'
                  },
                  {
                    id: 218,
                    label: '迭代完成率'
                  }
                ]
              },
              {
                id: 22,
                label: '交付效率',
                children: [
                  {
                    id: 221,
                    label: '人均产出功能点'
                  },
                  {
                    id: 222,
                    label: '项目生产率'
                  }
                ]
              }
            ]
          },
          {
            id: 3,
            label: '业务满意度',
            children: [
              {
                id: 31,
                label: '业务满意度'
              }
            ]
          },
          {
            id: 4,
            label: '交付价值',
            children: [
              {
                id: 41,
                label: '业务价值关键指标'
              }
            ]
          },
          {
            id: 5,
            label: '交付速度',
            children: [
              {
                id: 51,
                label: '需求评估速度',
                children: [
                  {
                    id: 511,
                    label: '需求响应度'
                  }
                ]
              },
              {
                id: 52,
                label: '开发速度',
                children: [
                  {
                    id: 521,
                    label: '完成度天数'
                  },
                  {
                    id: 522,
                    label: '完成度达标率'
                  },
                  {
                    id: 523,
                    label: '故事平均测试通过周期'
                  }
                ]
              },
              {
                id: 53,
                label: '发布速度',
                children: [
                  {
                    id: 531,
                    label: '首次交付天数'
                  },
                  {
                    id: 532,
                    label: '首次交付达标率'
                  },
                  {
                    id: 533,
                    label: '故事平均发布周期'
                  }
                ]
              },
              {
                id: 54,
                label: '燃尽图'
              },
              {
                id: 55,
                label: '一次测试通过率'
              }
            ]
          },
          {
            id: 6,
            label: '持续交付',
            children: [
              {
                id: 61,
                label: '技术债务率',
                url: 'https://world.taobao.com/'
              },
              {
                id: 62,
                label: 'DEVOPS成熟度',
                url: ' http://www.baidu.com'
              },
              {
                id: 63,
                label: 'DEVOPS健康度',
                url: ' https://www.google.com/'
              }
            ]
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
      // console.log(data.label);
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
    /* expandChange() {
        this.toggleExpand(this.data, this.expandAll)
      },*/
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
    display: -webkit-flex; /* Safari */
    display: flex;
  }
  .top-chose{

  }
  .org-tree-node-label {
    white-space: nowrap;
  }
</style>
