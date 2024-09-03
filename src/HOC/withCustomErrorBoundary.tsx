/* eslint-disable no-console */
import React from "preact/compat";
import { Button, Result, Space } from "antd";
import { Link } from "react-router-dom";
import { RootPaths } from "../constants";
import { withErrorBoundary } from "react-error-boundary";

export const withCustomErrorBoundary = <T,>(
  Component: React.ComponentType<T>
) => {
  //@ts-ignore
  return withErrorBoundary(Component, {
    // @ts-ignore
    FallbackComponent: ({ error, resetErrorBoundary }) => (
      // @ts-ignore
      <Result
        status="warning"
        title={
          <Space direction="vertical">
            <div>There are some problems:</div>
            <div>
              <code style={{ fontSize: "small" }}>{error.message}</code>
            </div>
          </Space>
        }
        extra={
          <Space>
            <Button type="default" onClick={resetErrorBoundary}>
              Try Again
            </Button>
            <Button type="primary" onClick={resetErrorBoundary}>
              <Link to={RootPaths.HOME}>Back home</Link>
            </Button>
          </Space>
        }
      />
    ),
    onError: (error: any, info: any) => {
      console.error(error, info);
    },
  });
};
