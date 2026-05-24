import { useEffect } from 'react';
import { RootState } from '../store';
import { useAppDispatch, useAppSelector } from './useRedux';
import { getMetals } from '../store/slice/metals.slice';

const useFetchMetals = () => {
  const { data, status, error } = useAppSelector(
    (state: RootState) => state.metals,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getMetals());
    return () => promise.abort();
  }, [dispatch]);

  return {
    metals: data ?? null,
    status,
    error,
  };
};

export default useFetchMetals;
