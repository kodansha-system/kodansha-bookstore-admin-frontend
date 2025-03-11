import { Empty, Select, Skeleton } from "antd";
import { DefaultOptionType, SelectProps } from "antd/es/select";
import { UIEvent, useEffect, useRef, useState } from "react";

export interface I_AsyncSelectProps extends SelectProps {
  getOptions: (
    args: I_SearchParams
  ) => Promise<DefaultOptionType[]> | DefaultOptionType[];
  getInitialOptions?: () => Promise<DefaultOptionType[]> | DefaultOptionType[];
  debounceTime?: number;
  infiniteScroll?: boolean; // set to true if the api supports pagination to use infinite scroll, the "page" in getOptions arguments will increase every time user scroll near the bottom of the dropdown
  valueCustom?: { value: string; label: string };
}

export interface I_SearchParams {
  search: string;
  page: number;
  currentOptions: DefaultOptionType[];
}

const initialSearchParams: I_SearchParams = {
  page: 1,
  search: "",
  currentOptions: [],
};
export const AsyncSelect = ({
  getOptions,
  debounceTime = 400,
  getInitialOptions,
  infiniteScroll,

  ...props
}: I_AsyncSelectProps) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const hasNextPage = useRef<boolean>();
  const timeoutHandler = useRef<any>();
  const searchParams = useRef<I_SearchParams>({ ...initialSearchParams });
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (params: I_SearchParams, loadMore?: boolean) => {
    if (!getOptions || !hasNextPage.current) return;
    searchParams.current = params;
    setLoading(true);
    // !loadMore && setOptions([]);
    clearTimeout(timeoutHandler.current);
    timeoutHandler.current = setTimeout(
      async () => {
        try {
          const options = await getOptions(params);
          setLoading(false);
          if (loadMore) setOptions((prev) => [...prev, ...options]);
          else setOptions(options);
          hasNextPage.current = Boolean(options.length);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
        props.onSearch?.(params.search);
      },
      loadMore || !params.search ? 0 : debounceTime
    );
  };

  const loadMore = (e: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
    const target = e.target as HTMLDivElement;
    if (
      !infiniteScroll ||
      loading ||
      !hasNextPage ||
      target.scrollHeight - Math.abs(target.scrollTop) - target.clientHeight >
        50
    )
      return;
    handleSearch(
      {
        page: searchParams.current.page + 1,
        search: searchParams.current.search,
        currentOptions: options,
      },
      true
    );
  };
  const onDropdownVisibleChange = (open: boolean) => {
    setDropdownOpen(open);
    if (!open) return;
    setOptions([]);
    hasNextPage.current = true;
    handleSearch(initialSearchParams);
  };
  const fetchInitialOptions = async () => {
    hasNextPage.current = true;
    if (!options.length) setLoading(true);
    if (!getInitialOptions)
      getInitialOptions = () => getOptions(initialSearchParams);
    const data = await getInitialOptions?.();
    setLoading(false);
    if (!data) return;
    setOptions(data);
  };
  const onSearch = (search: string) => {
    hasNextPage.current = true;
    handleSearch({ ...initialSearchParams, search });
  };
  useEffect(() => {
    fetchInitialOptions();
  }, [getInitialOptions]);

  return (
    <Select
      notFoundContent={
        !isDropdownOpen ? null : loading ? <Skeleton active /> : <Empty />
      }
      virtual={false}
      allowClear
      filterOption={false}
      showSearch
      {...props}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onPopupScroll={loadMore}
      onSearch={onSearch}
      options={options}
      value={props.valueCustom?.value ? props.valueCustom : props.value}
    />
  );
};
