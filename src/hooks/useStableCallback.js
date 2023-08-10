import { useRef, useCallback} from 'react';

function useStableCallback(callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const stableCallback = useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);

  return stableCallback;
}

export default useStableCallback;