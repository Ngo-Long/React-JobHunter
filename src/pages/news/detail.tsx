import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { INews } from "@/types/backend";
import { callFetchNewsById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";


const ClientNewsDetailPage = (props: any) => {
    const [newsDetail, setNewsDetail] = useState<INews | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id");

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchNewsById(id);
                if (res?.data) {
                    setNewsDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {newsDetail && newsDetail.id &&
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {newsDetail.title}
                                </div>

                                <div className={styles["location"]}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(newsDetail?.author)}
                                </div>

                                <Divider />
                                {parse(newsDetail?.content ?? "")}
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles["news"]}>
                                    <div>
                                        <img
                                            width={200}
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/news/${newsDetail?.image}`}
                                        />
                                    </div>
                                    <div>
                                        {newsDetail?.title}
                                    </div>
                                </div>
                            </Col>
                        </>
                    }
                </Row>
            }
        </div>
    )
}
export default ClientNewsDetailPage;