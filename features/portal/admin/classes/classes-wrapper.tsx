import React from 'react'
import { ClassesHeaderActions } from './classes-header-actions'
import { ClassesList } from './classes-list'

export const ClassesWrapper = () => {
  return (
    <>
      <ClassesHeaderActions />
      <ClassesList />
    </>
  )
}
