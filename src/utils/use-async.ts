import { useCallback, useState } from "react";
import { useMountedRef } from "utils";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });
  const config = { ...defaultConfig, ...initialConfig };

  const setData = useCallback(
    (data: D) =>
      setState({
        data,
        error: null,
        stat: "success",
      }),
    []
  );

  const setError = useCallback(
    (error: Error) =>
      setState({
        error,
        stat: "error",
        data: null,
      }),
    []
  );

  const [retry, setRetry] = useState(() => () => {});
  const mountedRef = useMountedRef();
  // run 用来触发异步请求
  const run = useCallback(
    (promise: Promise<D>, retryConfig?: { resty: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入 Promise 类型数据");
      }
      setState((prevState) => ({ ...prevState, stat: "loading" }));
      setRetry(() => () => {
        if (retryConfig?.resty) {
          run(retryConfig?.resty(), retryConfig);
        }
      });
      return promise
        .then((data) => {
          // 判断组件是否是挂载状态。避免组件未挂载或已卸载导致赋值报错
          if (mountedRef.current) {
            setData(data);
          }
          return data;
        })
        .catch((error) => {
          // catch会消化异常，如果不主动抛出，外面是接收不到异常的
          setError(error);

          if (config.throwOnError) return Promise.reject(error);
          return error;
        });
    },
    [config.throwOnError, mountedRef, setData, setError]
  );

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    // retry被调用时重新跑一遍run，刷新
    retry,
    ...state,
  };
};
