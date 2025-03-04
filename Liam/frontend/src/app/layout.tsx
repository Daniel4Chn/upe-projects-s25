"use client";
import "antd/dist/reset.css";
import { Layout, Menu, Typography } from "antd";
import Link from "next/link";

const { Header, Content, Footer } = Layout;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: <Link href="/">Home</Link>,
      key: "1",
    },
    {
      label: <Link href="/about">About</Link>,
      key: "2",
    },
  ];

  return (
    <html lang="en">
      <body>
        <Layout>
          <Header style={{ padding: 0 }}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} items={menuItems} />
          </Header>
          <Content style={{ padding: "20px" }}>
            {children} {/* This is where the page content will be rendered */}
          </Content>
          <Footer style={{ textAlign: 'center' }}><Typography.Title level={5}>&lt;&lt;&lt;UPE Intern Projects Spring 2025&gt;&gt;&gt;</Typography.Title></Footer>
        </Layout>
      </body>
    </html>
  );
}