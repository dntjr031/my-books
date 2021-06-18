import { Action, createActions, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import { LoginReqType } from '../../types';
import UserService from '../../services/UserService';
import TokenService from '../../services/TokenService';
import { push } from 'connected-react-router';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: Error | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

const prefix = 'my-books/auth';

export const { pending, success, fail } = createActions('PENDING', 'SUCCESS', 'FAIL', { prefix });

const reducer = handleActions<AuthState, string>(
  {
    PENDING: state => ({ ...state, loading: true, error: null }),
    SUCCESS: (state, action) => ({ token: action.payload, loading: false, error: null }),
    FAIL: (state, action: any) => ({ ...state, loading: false, error: action.payload }),
  },
  initialState,
  { prefix },
);

export default reducer;

//saga
export const { login, logout } = createActions('LOGIN', 'LOGOUT', { prefix });
function* loginSaga(action: Action<LoginReqType>) {
  try {
    yield put(pending());
    const token: string = yield call(UserService.login, action.payload);
    TokenService.set(token);
    yield put(success(token));
    yield put(push('/'));
  } catch (e) {
    yield put(fail(new Error(e?.response?.data?.error || 'UNKNOWN_ERROR').message));
  }
}
function* logoutSaga() {}
export function* authSaga() {
  yield takeEvery(`${prefix}/LOGIN`, loginSaga);
  yield takeEvery(`${prefix}/LOGOUT`, logoutSaga);
}
