import { useEffect, useCallback } from 'react';
import { RootState } from '../store';
import { useAppDispatch, useAppSelector } from './useRedux';
import { getMetalPrice, MetalType } from '../store/slice/metals.slice';

const useFetchMetal = (metal: MetalType) => {
  const dispatch = useAppDispatch();
  const metalState = useAppSelector((state: RootState) => state.metals[metal]);

  const refetch = useCallback(() => {
    return dispatch(getMetalPrice(metal));
  }, [dispatch, metal]);

  useEffect(() => {
    const promise = dispatch(getMetalPrice(metal));
    return () => promise.abort();
  }, [dispatch, metal]);

  return {
    ...metalState,
    refetch,
  };
};

export default useFetchMetal;
