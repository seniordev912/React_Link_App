import React from 'react'
import { CreateAccountCard, MainLayout } from '../../components'
import { Services } from './components'
import { Companies } from '../Testimonial/components'
import 'boxicons'
import './index.scss'

const Pricing = props => {

    return (
        <MainLayout>
            <Services {...props} />
            <Companies/>
            <div className="container">
                <CreateAccountCard />
            </div>
        </MainLayout>
    )
}

export default Pricing