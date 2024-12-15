'use client'

import React from 'react'
import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {signIn} from '@/app/actions';


const initialState = {
    success: false,
    message: ''
}

export default function Page() {

    const [state,formAction,isPending] = useActionState(signIn, initialState);
    console.log('state message:',state.message)

  return (
    <div className='flex flex-col min-w-80 max-w-80 justify-center'>
        <form action={formAction} className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input placeholder='youe@example.com' type='email' name='email' required/>
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Password</Label>
                <Input type='password' name='password' placeholder='your password' required/>
            </div>
            <SubmitButton pendingText='Signing In...'>
                Sign-In
            </SubmitButton>
            {state.message && !state.success && 
                <div className='bg-red-300 text-red-600 p-2 text-md font-medium'>{state.message}</div>}

            {state.success && <div className='bg-green-300 text-green-600 p-2 text-md font-medium'>Login Successfully</div>}
        </form>
        
    </div>
  )
}

