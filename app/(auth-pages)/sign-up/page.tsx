'use client'
// Change to client component to handle error state

import React from 'react';
import {useState} from 'react'
import {useFormState} from 'react-dom';
import { useActionState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/submit-button';

import { signUpAction } from '@/app/actions'; // Connect state of submit form with server action to get state from server 

type FormState = {
  success: boolean;
  message?: string; // Optional string
};

const initialState:FormState = {
  success: false ,
  message: '' ,
};

export default function Page() {

  // state => get state from server action in server action
  const [state, formAction, isPending] = useActionState(signUpAction,initialState);
  const [password, setPassword] = useState('');
  const [confirmPassword,setConfimPassword] = useState('');
  const [matchPassword, setMatchPassword ] = useState(false);

  const handleChangePassword = (event:React.ChangeEvent<HTMLInputElement>) =>{
    const newPassword = event.target.value;
      setPassword(newPassword);

  }
  const handleChangeConfirmPassword = (event:React.ChangeEvent<HTMLInputElement>) =>{
    const newConfirmPassword = event.target.value;
    setConfimPassword(newConfirmPassword);
    setMatchPassword(newConfirmPassword === password)

  }
  

  console.log('state message:',state.message);
  return (
    <div className='flex flex-col min-w-80 max-w-80 mx-auto '>
      <form action={formAction} className='flex-1 flex flex-col gap-5'>
        <h1 className='text-2xl font-medium self-center'>Sign up</h1>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input type='email' name='email' placeholder='you@example.com' required/>
        </div>
        
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password'>password</Label>
          <Input type='password' name='password' onChange={handleChangePassword} placeholder='your password' required/>
        </div>
        
        <div className='flex flex-col gap-2'>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input type='password' name='confirmPassword' onChange={handleChangeConfirmPassword} placeholder='confirm your password' required/>
          { matchPassword && confirmPassword && <div className='text-sm text-green-600'>Password match</div>}
          {!matchPassword && confirmPassword && <div className='text-sm text-red-600'>Password not match</div>}
  
        </div>
        
      <SubmitButton variant={"default"} pendingText='Submitting...' className='w-full  self-center'>
        Sign up
      </SubmitButton>
      
      {state.message && !state.success && <div className='flex justify-center w-full bg-red-300 p-2 text-lg text-red-600 font-medium'> Error: {state.message} </div>}
      {state.success && <div className='flex justify-center w-full bg-green-300 p-2 text-lg text-green-600 font-medium'>{state.message}</div>}
      
      </form>
      
    </div>
  )
}

