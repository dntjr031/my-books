import Add from '../components/Add';
import { useDispatch, useSelector } from 'react-redux';
import { BookReqType, RootState } from '../types';
import { useCallback } from 'react';
import { goBack } from 'connected-react-router';
import { logout as logoutSagaStart } from '../redux/modules/auth';
import { addBook as addBookSagaStart } from '../redux/modules/books';

const AddContainer = () => {
  const loading = useSelector<RootState, boolean>(state => state.books.loading);
  const dispatch = useDispatch();

  const back = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutSagaStart());
  }, [dispatch]);

  const add = useCallback(
    (book: BookReqType) => {
      dispatch(addBookSagaStart(book));
    },
    [dispatch],
  );
  return <Add loading={loading} logout={logout} back={back} add={add} />;
};

export default AddContainer;
