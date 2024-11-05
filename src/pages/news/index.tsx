import { Col, Row } from 'antd';
import styles from 'styles/client.module.scss';
import NewsCard from '@/components/client/card/news.card';

const ClientNewsPage = (props: any) => {
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <NewsCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientNewsPage;