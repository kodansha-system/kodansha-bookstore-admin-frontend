import { styled } from "styled-components";

export const StyledLayout: any = styled.div`
  .ant-menu-light {
    background: var(--primary-400) !important;
    &.ant-menu-inline .ant-menu-item::after {
      border-inline-end: none;
    }
    &.ant-menu-inline .ant-menu-item-selected::after {
      display: none;
    }
    .ant-menu-item-selected {
      color: #fff !important;
      background-color: #2563eb;
    }
    .ant-menu-submenu-title {
      height: 50px;
      width: 100%;
      margin: 0;
      &:hover {
        background-color: rgba(255, 204, 51, 0.1);
        border-radius: 0;
      }
      &.ant-menu-submenu-selected {
        background-color: rgba(255, 204, 51, 0.1);
      }
    }
    .ant-menu-sub.ant-menu-inline {
      background-color: #fff;
    }
  }

  .ant-menu-item {
    color: black !important;
    font-weight: bold;
    border-bottom: 1px solid #fff;
    border-radius: 0;
    width: 100%;
    height: 50px;
    margin: 0 !important;
    &:hover {
      color: #fff;
    }
  }

  .ant-menu-title-content {
    font-size: 14px;
    line-height: 23.17px;
    font-weight: 500;
  }

  .ant-menu-inline-collapsed {
    > .ant-menu-submenu > .ant-menu-submenu-title {
      padding-top: 6px;
    }
    > .ant-menu-item {
      padding-top: 6px;
    }
  }

  .ant-modal-content {
    border-radius: 4px !important;
  }

  .anticon-close {
    color: #333333;
  }

  .ant-layout .ant-layout-sider-trigger {
    background-color: #2563eb;
    font-weight: bold;
    opacity: 1;
  }
`;
