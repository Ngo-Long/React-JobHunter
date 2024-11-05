import { callFetchNews } from "@/config/api";
import { convertSlug } from "@/config/utils";
import { INews } from "@/types/backend";
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from 'styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { Link } from "react-router-dom";

interface IProps {
    showPagination?: boolean;
}

const NewsCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayNews, setDisplayNews] = useState<INews[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();

    useEffect(() => {
        fetchNews();
    }, [current, pageSize, filter, sortQuery])

    const fetchNews = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchNews(query);
        if (res && res.data) {
            setDisplayNews(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailNews = (item: INews) => {
        if (item.title) {
            const slug = convertSlug(item.title);
            navigate(`/news/${slug}?id=${item.id}`)
        }
    }

    return (
        <div className={`${styles["news-section"]}`}>
            <div className={styles["news-content"]}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Tư vấn nghề nghiệp từ HR Insider</span>
                                {!showPagination &&
                                    <Link to="news">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayNews?.map(item => {
                            return (
                                <Col span={24} md={6} key={item.id}>
                                    <Card
                                        onClick={() => handleViewDetailNews(item)}
                                        style={{ height: 350 }}
                                        hoverable
                                        cover={
                                            <div className={styles["card-customize"]} >
                                                <img
                                                    style={{ maxWidth: "200px" }}
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/news/${item?.image}`}
                                                />
                                            </div>
                                        }
                                    >
                                        <Divider />
                                        <h3 style={{ textAlign: "center" }}>{item.title}</h3>
                                    </Card>
                                </Col>
                            )
                        })}

                        {(!displayNews || displayNews && displayNews.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>

                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default NewsCard;