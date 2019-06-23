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
          <el-tag>{{ row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Name_exe" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.name_exe}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Path" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Version" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="User" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user | filterUserName }}</span>
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
            <el-form-item label="Name_exe" prop="name_exe">
              <el-input v-model="temp.name_exe"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Path" prop="path">
              <el-input v-model="temp.path"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Version" prop="version">
              <el-input v-model="temp.version"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="User" prop="user">
          <template>
            <el-select v-model="temp.user" value-key="id" filterable placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.username"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="Params" prop="params">
          <el-table
            :key="tableKeyParamEdit"
            :data="temp.params"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Name" prop="name" min-width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                    <el-input size="mini" placeholder="请输入内容" v-model="scope.row.name"/>
                </span>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Value" min-width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                    <el-input size="mini" placeholder="请输入内容" v-model="scope.row.value"/>
                </span>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Desc" min-width="100px" align="center">
              <template slot-scope="scope">
                 <span v-if="scope.row.isSet">
                    <el-input size="mini" placeholder="请输入内容" v-model="scope.row.desc"/>
                </span>
                <span v-else>{{ scope.row.desc }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Visiable" min-width="100px" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.is_visiable"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="handleEditParam(scope.row,scope.$index)">
                   {{scope.row.isSet?'保存':"修改"}}
                </span>
                <span class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;">
                   删除
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="margin-right: 450px" @click="handleAddParam">
          Add Param
        </el-button>
        <el-button @click="dialogFormVisible = false">
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
import {getAppList, apiCreateAppList} from '@/api/project'
import {getUserList} from '@/api/user'
import waves from '@/directive/waves'
// eslint-disable-next-line no-unused-vars
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination'

let userMap = {}

export default {
  name: 'appMana',
  components: {Pagination},
  directives: {waves},
  filters: {
    parseTime (type) {
      return parseTime(type)
    },
    filterUserName (userID) {
      return userMap[userID]
    }
  },
  data () {
    return {
      tableKey: 0,
      tableKeyParamEdit: 2,
      list: null,
      userList: null,
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
        name_exe: '',
        path: '',
        version: '',
        user: undefined,
        params: []
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
      this.InitUserList()
    },
    getList () {
      this.listLoading = true
      getAppList(this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    InitUserList () {
      this.listLoading = true
      getUserList({limit: 99999}).then(response => {
        this.userList = response.data.results
        userMap = response.data.results.reduce((acc, cur) => {
          acc[cur.id] = cur.username
          return acc
        }, {})
        this.listLoading = false
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
        name_exe: '',
        path: '',
        version: '',
        user: undefined,
        params: []
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
          apiCreateAppList(tempData).then((response) => {
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

    },
    handleDelete (row) {

    },
    handleAddParam () {
      let newParam = {name: '', value: '', desc: '', is_visiable: true, isSet: true}
      this.temp.params.push(newParam)
    },
    handleEditParam (row, index) {
      // 点击修改 判断是否已经保存所有操作
      for (let i of this.temp.params) {
        if (i.isSet && row !== i) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      row.isSet = !row.isSet
      return true
    }
  }
}
</script>

<style scoped>

</style>
