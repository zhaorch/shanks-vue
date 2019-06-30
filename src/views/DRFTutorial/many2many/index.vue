<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
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
          <span>{{ scope.row.grade.name }}</span>
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
            选课
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
              <el-input v-model="temp.no" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="temp.name" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Goods" prop="goods">
          <el-table
            :key="tableKeyGoodsEdit"
            ref="tableParam"
            :data="this.temp.courses"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            height="300"
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Course" prop="course" min-width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-select v-model="scope.row.course" value-key="id" filterable placeholder="请选择">
                    <el-option
                    v-for="item in courseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                    </el-option>
                  </el-select>
                </span>
                <span v-else>{{ scope.row.course.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Desc" min-width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input size="small" placeholder="请输入内容" v-model="scope.row.desc"/>
                </span>
                <span v-else>{{ scope.row.desc }}</span>
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
import {apiStudentListStudentCourse, apiGetCourseList, apiStudentSetCourse} from '@/api/drftutorial'
import waves from '@/directive/waves'
// eslint-disable-next-line no-unused-vars
import {parseTime, deepClone} from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'one2manyMana',
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
      tableKeyGoodsEdit: 2,
      list: null,
      courseList: null,
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
        grade: null,
        courses: []
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
      apiGetCourseList({limit: 99999}).then(response => {
        this.courseList = response.data.results
        this.listLoading = false
        this.getList()
      })
    },
    getList () {
      this.listLoading = true
      apiStudentListStudentCourse(this.listQuery).then(response => {
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
        grade: null,
        courses: []
      }
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
          apiStudentSetCourse(this.temp).then((response) => {
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
    handleAddParam () {
      let newCourse = {course: '', desc: '', isSet: true}
      this.temp.courses.push(newCourse)
    },
    handleCancel () {
      this.dialogFormVisible = false
    },
    handleEditParam (row, index) {
      row.isSet = !row.isSet

      // 修改的时候必须加上这两句。。否则 界面不更新
      this.$refs.tableParam.setCurrentRow()
      this.$refs.tableParam.setCurrentRow(row)
      // return true
    },
    handleDeleteParam (row, index) {
      this.temp.courses.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
