import React from 'react'
import { ClassesHeaderActions } from './classes-header-actions'
import { ClassStudentFilter } from './class-student-filter'
import { StudentList } from './student-list'

export const ClassesWrapper = () => {
  return (
    <>
      <ClassesHeaderActions />
      <ClassStudentFilter />
      <StudentList />
    </>
  )
}
