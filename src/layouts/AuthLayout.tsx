import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <Outlet/>
    </div>
  )
}

export default AuthLayout