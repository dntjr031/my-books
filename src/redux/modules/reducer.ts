import { combineReducers } from 'redux';
import { History } from 'history';
import auth from './auth';
import { connectRouter } from 'connected-react-router';
import books from './books';

const reducer = (history: History<unknown>) =>
  combineReducers({
    auth,
    books,
    router: connectRouter(history),
  });

export default reducer;
