<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="Name" prop="name" sortable="custom" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Desc" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" min-width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.profile">{{scope.row.profile.email}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="created_time" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.created_time) | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="updated_time" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="170px" fixed="right"
                       class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
               style="width: 800px; margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="temp.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Desc" prop="desc">
              <el-input v-model="temp.desc"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Email" prop="profile.email">
              <el-input v-model="temp.profile.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Star" prop="profile.star">
              <el-input v-model="temp.profile.star"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班庆日" prop="profile.type">
              <el-date-picker v-model="temp.profile.anniversary" type="date" placeholder="Please pick a date" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期时间" prop="birthday">
              <el-date-picker v-model="temp.profile.just_datetime" type="datetime" placeholder="Please pick a date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Type" prop="profile.type">
          <template>
            <el-select v-model="temp.profile.type" value-key="id" filterable placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="margin-right: 450px" @click="handleAddParam">
          Add Param
        </el-button>
        <el-button @click="handleCancel">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {apiGetGradeList, apiCreateGrade, apiUpdateGrade, apiDeleteApp} from '@/api/drftutorial'
import waves from '@/directive/waves'
// eslint-disable-next-line no-unused-vars
import {parseTime, deepClone} from '@/utils'
import Pagination from '@/components/Pagination'

const typeOptions = [
  { key: 1, display_name: '文科班' },
  { key: 2, display_name: '理科班' },
  { key: 3, display_name: '艺术班' }
]

// const typeKeyValue = typeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'appMana',
  components: {Pagination},
  directives: {waves},
  filters: {
    parseTime (type) {
      return parseTime(type)
    }
  },
  data () {
    return {
      tableKey: 0,
      tableKeyParamEdit: 2,
      list: null,
      typeOptions: typeOptions,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        search: '',
        sort: '+name'
      },
      temp: {
        id: undefined,
        name: '',
        desc: '',
        profile: {
          id: undefined,
          email: '',
          star: '',
          anniversary: new Date(),
          just_datetime: new Date(),
          type: 1
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        name: [{required: true, message: 'name is required', trigger: 'blur'}],
        name_exe: [{required: true, message: 'name_exe is required', trigger: 'blur'}],
        path: [{required: true, message: 'path is required', trigger: 'blur'}],
        version: [{required: true, message: 'version is required', trigger: 'blur'}],
        user: [{required: true, message: 'user is required', trigger: 'blur'}]
      },
      downloadLoading: false
    }
  },
  created () {
    this.init()
    this.getList()
  },
  methods: {
    init () {
    },
    getList () {
      this.listLoading = true
      apiGetGradeList(this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    sortChange (data) {
      const {prop, order} = data
      if (prop === 'name') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+name'
      } else {
        this.listQuery.sort = '-name'
      }
      this.handleFilter()
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        name: '',
        desc: '',
        profile: {
          id: undefined,
          email: '',
          star: '',
          anniversary: new Date(),
          just_datetime: new Date(),
          type: 1
        }
      }
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.profile.anniversary = parseTime(tempData.profile.anniversary, '{y}-{m}-{d}')
          tempData.profile.just_datetime = parseTime(tempData.profile.just_datetime, '{y}-{m}-{d} {h}:{i}:{s}')
          apiCreateGrade(tempData).then((response) => {
            // this.temp.id = response.data.id
            this.list.push(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload () {

    },
    handleUpdate (row) {
      // this.temp = Object.assign({}, row) // copy obj
      this.temp = deepClone(row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.profile.anniversary = parseTime(tempData.profile.anniversary, '{y}-{m}-{d}')
          tempData.profile.just_datetime = parseTime(tempData.profile.just_datetime, '{y}-{m}-{d} {h}:{i}:{s}')
          apiUpdateGrade(tempData).then((response) => {
            for (const v of this.list) {
              if (v.id === response.data.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDeleteApp(row.id).then((response) => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch((e) => {
          this.$message.error(e.message)
        })
      }).catch(() => {
        this.$notify({
          title: 'Cancel',
          type: 'info',
          message: '已取消删除',
          duration: 2000
        })
      })
    },
    handleAddParam () {
      let newParam = {name: '', value: '', desc: '', is_visiable: true, isSet: true}
      this.temp.params.push(newParam)
    },
    handleCancel () {
      this.dialogFormVisible = false
    },
    handleEditParam (row, index) {
      // 点击修改 判断是否已经保存所有操作
      // for (let i of this.temp.params) {
      //   if (i.isSet && row !== i) {
      //     this.$message.warning('请先保存当前编辑项')
      //     return false
      //   }
      // }
      row.isSet = !row.isSet

      // 修改的时候必须加上这两句。。否则 界面不更新
      this.$refs.tableParam.setCurrentRow()
      this.$refs.tableParam.setCurrentRow(row)
      // return true
    },
    handleDeleteParam (row, index) {
      this.temp.params.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
