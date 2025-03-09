import {
  Button,
  Image,
  Input,
  InputRef,
  Popover,
  Space,
  Table,
  TableColumnType,
} from "antd";
import Header from "../../components/Header";
import AddButton from "../../components/AddButton";
import { useRef, useState } from "react";
import AddSubject from "./Add";
import EditSubject from "./Edit";
import { useQueryClient } from "@tanstack/react-query";
import { useUsers } from "../../hooks/users";
import { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { IUser } from "../../models";

type DataIndex = keyof IUser;

const Subjects = () => {
  const { data, isSuccess, isLoading } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<IUser> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columnsUser = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
      render: (text: string) => {
        return <div>{text}</div>;
      },
      ...getColumnSearchProps("email"),
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
      width: "30%",
      render: (text: string) => {
        return <div>{text}</div>;
      },
      ...getColumnSearchProps("fullname"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: "10%",
      render: (text: number) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      width: "10%",
      render: (text: string) => {
        return <Image src={text} alt="" width={50} height={50} />;
      },
    },
    {
      title: "Sao",
      dataIndex: "star",
      key: "star",
      width: "10%",
      render: (text: string) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isLocked",
      key: "isLocked",
      width: "10%",
      render: (text: boolean) => {
        return <div>{text ? "unactive" : "active"}</div>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (_: unknown, data: IUser) => {
        return (
          <div className="flex gap-x-2 justify-center">
            <Button
              onClick={() => handleEditSubject(data._id)}
              type="primary"
              className="bg-blue-400 w-[90px] text-white"
            >
              Sửa
            </Button>
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn khóa tài khoản này?</div>
                  <div className="text-right">
                    <button className="bg-blue-500 text-white py-1 px-2 mt-2 rounded-md">
                      OK
                    </button>
                  </div>
                </>
              }
            >
              <Button type="dashed" className="bg-red-500 text-white">
                Unactive
              </Button>
            </Popover>
          </div>
        );
      },
    },
  ];

  const handleAddNewSubject = () => {
    setIsOpen(true);
  };
  const queryClient = useQueryClient();

  const handleEditSubject = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
    console.log(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewSubject}>Thêm mới</AddButton>}
      >
        Quản lý người dùng
      </Header>
      <Table
        columns={columnsUser}
        dataSource={isSuccess ? data?.data?.data?.users : []}
        loading={isLoading}
        bordered
        className="w-[95%]"
      />

      <AddSubject isOpen={isOpen} setIsOpen={setIsOpen} />
      <EditSubject isOpen={isOpenEdit} setIsOpen={setIsOpenEdit} id={id!} />
    </div>
  );
};

export default Subjects;
