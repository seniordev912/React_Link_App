import React, { useEffect } from 'react';
import { CreateAccountCard, MainLayout } from '../../components'
import { ContactUsCard, Companies } from './components'
import './index.scss'

const Contact = (props) => {
    useEffect(() => {

    }, [])
    return (
        <MainLayout>
            <div>
                <ContactUsCard/>
                <Companies/>
                <div className={"container"}>
                    <CreateAccountCard/>
                </div>
            </div>
        </MainLayout>
    )
}

export default Contact