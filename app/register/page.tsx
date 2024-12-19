'use client'
// Change to client component to handle error state

import React from 'react';
import {useFormState} from 'react-dom';
import { useActionState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/submit-button';

import { registerAction } from '@/app/actions'; // Connect state of submit form with server action to get state from server 

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
  // formAction => collect data to server action.
  // const [state, formAction] = useFormState(register,initialState) // Get register function from server action, initial state of form
  const [state, formAction, isPending] = useActionState(registerAction,initialState);



  console.log('state message:',state.message);
  return (
    <div className='flex flex-col min-w-80 max-w-80 mx-auto '>
      <form action={formAction} className='flex-1 flex flex-col gap-3'>
        <h1 className='text-2xl font-medium self-center'>Register Form</h1>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='name'>Fullname</Label>
          <Input type='text' name='name' placeholder='Your fullname' required/>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input type='email' name='email' placeholder='you@example.com' required/>
        </div>
        
        <div className='flex flex-col gap-2'>
          <Label htmlFor='tel'>Telephone No</Label>
          <Input type='tel' name='tel' placeholder='08x-xxx-xxx'/>
        </div>
        
        <div className='flex flex-col gap-2'>
          <Label htmlFor='file'>File Attachments</Label>
          <Input type='file' name='attachment'  />
        </div>
        
      <SubmitButton disabled = {isPending} pendingText='Submitting...' className='w-full bg-green-600 self-center'>
        Submit
      </SubmitButton>
      
      {state.message && !state.success && <div className='flex justify-center w-full bg-red-300 p-2 text-lg text-red-600 font-medium'> Error: {state.message} </div>}
      {state.success && <div className='flex justify-center w-full bg-green-300 p-2 text-lg text-green-600 font-medium'>{state.message}</div>}
      
      </form>
      
    </div>
  )
}

