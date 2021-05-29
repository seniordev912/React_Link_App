import React, { useEffect, useState } from 'react'
import { 
    Row,
    Table,
    Tag
} from 'antd'
import '../index.scss'
import axios from '../../../constants/axios'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'
import SettingsLayout from '../Component/SettingsLayout'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

function Billing(props, user) {
    
    const [tblBillData, setTblBillData] = useState([])

    useEffect(() => {
        const getBilldingData = async() => {
            const { user: userInfo } = props
            const result = await axios.get(`user/product/getBillingData/${userInfo.id}`)
            if(result && result.data) {
                setTblBillData(result.data)
            }
        }
        getBilldingData()
    }, [])


	return (
        <SettingsLayout selectedIndex = {"1"} {...props}>
            <div>
                <Row>
                    <h3>Billing</h3>
                </Row>
                <Row>
                    <div className={"Body-1"}>
                        Manage your payments, payouts and billing history
                    </div>
                </Row>
                <Row>
                    <Table
                        className="pay-share-table"
                        columns={[
                            {
                                title: "Order ID",
                                dataIndex: "orderId",
                                key: "orderId"
                            },
                            {
                                title: "Date",
                                dataIndex: "paymentDate",
                                key: "paymentDate"
                            },
                            {
                                title: "Product",
                                dataIndex: "product",
                                key: "product",
                                render : (product, row, index) => {
                                    return(
                                        <>
                                            {product && product.map(tag => (
                                                <Tag className="product-item-tag" key={tag}>
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </>
                                    )
                                }
                            },
                            {
                                title: "Amount",
                                dataIndex: "paymentAmount",
                                key: "paymentAmount",
                                render: (paymentAmount, row, index) => {
                                    return (
                                        `$${paymentAmount}`
                                    )
                                }
                            }
                        ]}
                        dataSource={tblBillData}
                        size="middle"
                    >
                    </Table>
                </Row>
            </div>
        </SettingsLayout>
	)
}

export default Billing
