import React from 'react'
import SettingsLayout from '../Component/SettingsLayout'
import { Services } from './components'
import 'boxicons'
import './index.scss'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})


const Plan = props => {

    const showToast = (type, content) => {
        if(type === 'success') {
            iziToast.success({
                title: 'Success',
                message: content
            })
        } else if(type === 'error') {
            iziToast.error({
                title: 'Error',
                message: content
            })
        }
    }

    return (
        <SettingsLayout selectedIndex = {"3"} {...props}>
            <Services {...props} showToast={showToast} />
        </SettingsLayout>
    )
}

export default Plan