import React, { useEffect } from 'react';
import { CreateAccountCard, MainLayout } from '../../components'
import { Companies, PageHeader, CardGrid } from './components'
import './index.scss'

const pageHeader = {
    title: "Community Love",
    content: "See what our talented creators and business owners are saying about LinkUp"
}

const Testimonial = (props) => {
    useEffect(() => {

    }, [])
    return (
        <MainLayout>
            <div>
                <PageHeader title={pageHeader.title} content={pageHeader.content}/>
                <CardGrid/>
                <Companies/>
                <div className={"container"}>
                    <CreateAccountCard/>
                </div>
            </div>
        </MainLayout>
    )
}

export default Testimonial