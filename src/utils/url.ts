import { useSearchParams, URLSearchParamsInit } from "react-router-dom";
import { useMemo } from "react";
import { cleanObject } from "utils";

/**
 * 返回页面url中，指定键的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParam] = useSearchParams();
  return [
    useMemo(() => {
      return keys.reduce((prev, key) => {
        return { ...prev, [key]: searchParams.get(key) || "" };
      }, {} as { [key in K]: string });
    }, [searchParams]),
    (param: Partial<{ [key in K]: unknown }>) => {
      // iterator
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
      // Object.fromEntries将具有iterator的数据转为对象类型

      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...param,
      }) as URLSearchParamsInit;
      setSearchParam(o);
    },
  ] as const;
};
