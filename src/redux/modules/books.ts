import { Action, createActions, handleActions } from 'redux-actions';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { BookReqType, BooksState, BookType } from '../../types';
import BookService from '../../services/BookService';
import { push } from 'connected-react-router';

const initialState: BooksState = {
  books: null,
  loading: false,
  error: null,
};

const prefix = 'my-books/books';

export const { pending, success, fail } = createActions('PENDING', 'SUCCESS', 'FAIL', { prefix });

const reducer = handleActions<BooksState, BookType[]>(
  {
    PENDING: state => ({ ...state, loading: true, error: null }),
    SUCCESS: (state, action: any) => ({ books: action.payload, loading: false, error: null }),
    FAIL: (state, action: any) => ({ ...state, loading: false, error: action.payload }),
  },
  initialState,
  { prefix },
);

export default reducer;

export const { getBooks, addBook, deleteBook } = createActions('GET_BOOKS', 'ADD_BOOK', 'DELETE_BOOK', { prefix });

function* getBooksSaga() {
  try {
    yield put(pending());
    const token: string = yield select(state => state.auth.token);
    const books: BookType[] = yield call(BookService.getBooks, token);
    yield put(success(books));
  } catch (e) {
    yield put(fail(new Error(e?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
function* addBookSaga(action: Action<BookReqType>) {
  try {
    yield put(pending());
    const token: string = yield select(state => state.auth.token);
    const book: BookType = yield call(BookService.addBook, token, action.payload);
    const books: BookType[] = yield select(state => state.books.books);
    yield put(success([...(books || []), book]));
    yield put(push('/'));
  } catch (e) {
    yield put(fail(new Error(e?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
function* deleteBookSaga(action: Action<number>) {
  try {
    const bookId = action.payload;
    yield put(pending());
    const token: string = yield select(state => state.auth.token);
    yield call(BookService.deleteBook, token, bookId);
    const books: BookType[] = yield select(state => state.books.books);
    yield put(success(books.filter(book => book.bookId !== bookId)));
  } catch (e) {
    yield put(fail(new Error(e?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
export function* BooksSaga() {
  yield takeLatest(`${prefix}/GET_BOOKS`, getBooksSaga);
  yield takeEvery(`${prefix}/ADD_BOOK`, addBookSaga);
  yield takeEvery(`${prefix}/DELETE_BOOK`, deleteBookSaga);
}
