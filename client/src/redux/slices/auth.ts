import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { register, login, getUser } from '../../api'
import { Profile, AuthFormData } from '../../type'

export const registerUser = createAsyncThunk<
  Profile,
  AuthFormData,
  { rejectValue: string }
>('auth/registerUser', async (formData, thunkAPI) => {
  try {
    let { data } = await register(formData)
    data = { ...data, error: false, errorMsg: '' }
    localStorage.setItem('profile', JSON.stringify(data))
    return data as Profile
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const loginUser = createAsyncThunk<
  Profile,
  AuthFormData,
  { rejectValue: string }
>('auth/loginUser', async (formData, thunkAPI) => {
  try {
    let { data } = await login(formData)
    data = { ...data, error: false, errorMsg: '' }
    localStorage.setItem('profile', JSON.stringify(data))
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const getProfile = createAsyncThunk<
  Profile,
  null,
  { rejectValue: string }
>('auth/getProfile', async (_, thunkAPI) => {
  try {
    const profile = JSON.parse(localStorage.getItem('profile') as string)
    const userId = profile.user._id
    let { data } = await getUser(userId)
    data = { ...data, error: false, errorMsg: '' }
    localStorage.setItem('profile', JSON.stringify(data))
    return data as Profile
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

const initialState: Profile = {
  status: '',
  token: '',
  user: {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    memoriesNumber: 0,
  },
  error: false,
  errorMsg: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state) =>
      (state = JSON.parse(localStorage.getItem('profile') as string)),
    logoutUser: (state) => (state = initialState),
    clearAuthError: (state) =>
      (state = { ...state, error: false, errorMsg: '' }),
    incrementMemoriesNumber: (state) => {
      state.user.memoriesNumber = state.user.memoriesNumber + 1
    },
    decrementMemoriesNumber: (state) => {
      state.user.memoriesNumber = state.user.memoriesNumber - 1
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(
      registerUser.rejected,
      (state, { payload }) =>
        (state = { ...state, error: true, errorMsg: payload })
    )

    builder.addCase(
      registerUser.fulfilled,
      (state, { payload }: PayloadAction<Profile>) =>
        (state = { ...payload, error: false, errorMsg: '' })
    )

    // Login
    builder.addCase(
      loginUser.rejected,
      (state, { payload }) =>
        (state = { ...state, error: true, errorMsg: payload })
    )

    builder.addCase(
      loginUser.fulfilled,
      (state, { payload }: PayloadAction<Profile>) =>
        (state = { ...payload, error: false, errorMsg: '' })
    )

    // Get profile
    builder.addCase(
      getProfile.rejected,
      (state, { payload }) =>
        (state = { ...state, error: false, errorMsg: payload })
    )

    builder.addCase(
      getProfile.fulfilled,
      (state, { payload }: PayloadAction<Profile>) => {
        state = { ...payload, error: false, errorMsg: '' }
      }
    )
  },
})

export const {
  setUser: setUserActionCreator,
  incrementMemoriesNumber: incrementMemoriesNumberActionCreator,
  decrementMemoriesNumber: decrementMemoriesNumberActionCreator,
  logoutUser: logoutUserActionCreator,
  clearAuthError: clearAuthErrorActionCreator,
} = authSlice.actions

export default authSlice.reducer
