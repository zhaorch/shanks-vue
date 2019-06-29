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
      <el-table-column label="Grade" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grade | filterGradeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="No" prop="no" sortable="custom" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Gender" min-width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.gender">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column label="Birthday" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday}}</span>
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
            <el-form-item label="No" prop="no">
              <el-input v-model="temp.no"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="temp.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Gender" prop="gender">
              <el-radio-group v-model="temp.gender">
                <el-radio-button label="true">男</el-radio-button>
                <el-radio-button label="false">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Birthday" prop="birthday">
              <el-date-picker v-model="temp.birthday" type="date" placeholder="Please pick a date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Grade" prop="grade">
          <template>
            <el-select v-model="temp.grade" value-key="id" filterable placeholder="请选择">
              <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="Goods" prop="goods">
          <el-table
            :key="tableKeyGoodsEdit"
            ref="tableParam"
            :data="temp.goods"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            height="300"
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Name" prop="name" min-width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                    <el-input size="small" placeholder="请输入内容" v-model="scope.row.name"/>
                </span>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Price" min-width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input-number size="small" v-model="scope.row.price" :precision="2" :step="0.1" :max="100"></el-input-number>
                </span>
                <span v-else>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Number" min-width="100px" align="center">
              <template slot-scope="{row}">
                 <span v-if="row.isSet">
                    <el-input-number size="small" v-model="row.number" :min="1" :max="10" label="描述文字"></el-input-number>
                </span>
                <span v-else>{{ row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button :type="!scope.row.isSet?'primary':'success'" size="mini" @click="handleEditParam(scope.row,scope.$index)">
                  {{scope.row.isSet?'保存':"修改"}}
                </el-button>
                <el-button type="danger" size="mini" @click="handleDeleteParam(scope.row,scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="margin-right: 450px" @click="handleAddParam">
          Add Goods
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
import {apiGetStudentList, apiGetGradeList, apiCreateStudent, apiUpdateStudent, apiDeleteStudent} from '@/api/drftutorial'
import waves from '@/directive/waves'
// eslint-disable-next-line no-unused-vars
import {parseTime, deepClone} from '@/utils'
import Pagination from '@/components/Pagination'

const typeOptions = [
  { key: 1, display_name: '文科班' },
  { key: 2, display_name: '理科班' },
  { key: 3, display_name: '艺术班' }
]

let gradeMap = {}

export default {
  name: 'one2manyMana',
  components: {Pagination},
  directives: {waves},
  filters: {
    parseTime (type) {
      return parseTime(type)
    },
    filterGradeName (gradeID) {
      return gradeMap[gradeID]
    }
  },
  data () {
    return {
      tableKey: 0,
      tableKeyGoodsEdit: 2,
      list: null,
      typeOptions: typeOptions,
      gradeList: null,
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
        no: '',
        name: '',
        gender: true,
        birthday: new Date(),
        goods: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        no: [{required: true, message: 'no is required', trigger: 'blur'}],
        name: [{required: true, message: 'name is required', trigger: 'blur'}],
        gender: [{required: true, message: 'gender is required', trigger: 'blur'}],
        birthday: [{required: true, message: 'birthday is required', trigger: 'blur'}],
        grade: [{required: true, message: 'grade is required', trigger: 'blur'}]
      },
      downloadLoading: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.InitGradeList()
    },
    InitGradeList () {
      this.listLoading = true
      apiGetGradeList({limit: 99999}).then(response => {
        this.gradeList = response.data.results
        gradeMap = response.data.results.reduce((acc, cur) => {
          acc[cur.id] = cur.name
          return acc
        }, {})
        this.getList()
        this.listLoading = false
      })
    },
    getList () {
      this.listLoading = true
      apiGetStudentList(this.listQuery).then(response => {
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
        no: '',
        name: '',
        gender: true,
        birthday: new Date(),
        goods: []
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
          tempData.birthday = parseTime(tempData.birthday, '{y}-{m}-{d}')
          apiCreateStudent(tempData).then((response) => {
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
          tempData.birthday = parseTime(tempData.birthday, '{y}-{m}-{d}')
          apiUpdateStudent(tempData).then((response) => {
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
        apiDeleteStudent(row.id).then((response) => {
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
      let newParam = {name: '', price: 0, number: 1, isSet: true}
      this.temp.goods.push(newParam)
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
      this.temp.goods.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
