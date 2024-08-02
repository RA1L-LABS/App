import { createSlice } from '@reduxjs/toolkit'
import AccountType from 'types/prisma/Account'

export const mintInitialState = {
  progress: 1 as 1 | 2 | 3,
  step: 1 as 1 | 2 | 3,
  data: {} as AccountType
}

export const mintSlice = createSlice({
  name: 'mint',
  initialState: mintInitialState,
  reducers: {
    setProgress(state, action) {
      state.progress = action.payload || 1
    },
    setStep(state, action) {
      state.step = action.payload || 1
    },
    setData(state, action) {
      state.data = action.payload || {}
    }
  }
})

export const { setProgress, setStep, setData } = mintSlice.actions
