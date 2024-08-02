import { counterSlice } from 'redux/slice/counter'
import { mintSlice } from 'redux/slice/mint'

export const reducer = {
  counter: counterSlice.reducer,
  mint: mintSlice.reducer
}
