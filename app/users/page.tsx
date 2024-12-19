'use client'
import React from 'react'
import UserManagement from '@/components/UserManagement'

export default function Page() {
    
    return (
    <div className='w-screen min-h-screen flex flex-col items-center gap-3'>
        <h1 className='text-2xl font-bold'>User Management</h1>
        <UserManagement/>
        
    
    </div>
    )
}
