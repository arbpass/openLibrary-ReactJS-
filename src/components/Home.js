import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Input, Menu, Layout, Table, Spin } from 'antd';
const { Search } = Input;
const { Content, Footer, Sider } = Layout;

const Home = () => {
    let menuItems = ["Javascript", "Harry Potter", "Indian History", "Crypto Currency", "Criminal Law"];

    //States
    const [search, setSearch] = useState("");
    const [spin, setSpin] = useState(false);
    const [foundResult, setFoundResult] = useState(menuItems);
    const [searchText, setSearchText] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const isMounted = useRef(false);


    //Filter menu items according to search bar
    const filter = (e) => {
        const keyword = e.target.value;

        if (keyword !== '') {
            const results = menuItems.filter((user) => {
                return user.toLowerCase().startsWith(keyword.toLowerCase());

            });
            setFoundResult(results);
        } else {
            setFoundResult(menuItems);
            // If the text field is empty, show all users
        }

        setSearch(keyword);
    };


    //fetching books
    const fetchBooks = async () => {
        try {
            setSpin(true);
            const response = await fetch(`https://openlibrary.org/search.json?title=${searchText}`);
            const data = await response.json();

            data.docs.forEach(element => {
                newData(element)
            });
        } catch (error) {
            setSpin(false);
        }
    }

    //new data
    function newData(ele) {
        const newData = {
            title: ele.title,
            author: ele.author_name,
            latest_publish: ele.publish_year[0],
            first_publish: ele.publish_year[0],
        }

        setSpin(false);
        setDataSource(pre => {
            return [...pre, newData]
        })
    }

    useEffect(() => {
        if (isMounted.current) {
            fetchBooks();
        } else {
            isMounted.current = true;
        }
    }, [searchText]);


    //Defined columns for the table
    const columns = [
        {
            key: '1',
            title: 'Title and Sub Title',
            dataIndex: 'title',
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return String(record.title).toLowerCase().includes(value.toLowerCase()) || String(record.author).toLowerCase().includes(value.toLowerCase());
            }
        },
        {
            key: '2',
            title: 'Author',
            dataIndex: 'author',
        },
        {
            key: '3',
            title: 'Latest Publish Year',
            dataIndex: 'latest_publish',
        },
        {
            key: '4',
            title: 'First Publish Year',
            dataIndex: 'first_publish',
        }
    ]


    return (
        <Layout hasSider>

            <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, }}>
                <Search placeholder="Search" style={{ width: 200, marginTop: 10, }} allowClear="true" onChange={filter} value={search} />
                <Menu theme="dark" mode="inline" onClick={(e) => setSearchText(e.key)} >
                    {foundResult.map(ele => (
                        <>
                            <Menu.Item key={ele}>{ele}<Link to={`/subject/${ele}`} /></Menu.Item>
                        </>
                    ))}
                </Menu>
            </Sider>


            <Layout className="site-layout" style={{ marginLeft: 200, }}>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial', }} >
                    <Input.Search
                        value={searchText}
                        placeholder='Search...'
                        style={{ width: 300, marginBottom: 10 }}
                        onSearch={(value) => {
                            setSearchText(value);
                        }}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                        allowClear="true"
                        loading={spin}
                        enterButton
                    />

                    <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 10 }}
                        loading={{ indicator: <Spin size='large' />, spinning: spin }}></Table>
                </Content>

                <Footer style={{ textAlign: 'center', }}>
                    Made by Ayush using ReactJS
                </Footer>
            </Layout>

        </Layout>
    );
};
export default Home;