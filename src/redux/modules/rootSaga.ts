import { all } from 'redux-saga/effects';
import { authSaga } from './auth';
import { BooksSaga } from './books';

export default function* rootSaga() {
  yield all([authSaga(), BooksSaga()]);
}
