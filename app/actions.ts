"use server";

import { createClient } from '@/utils/supabase/server'; // init supabase
import {v4 as uuid4} from 'uuid';
import { headers } from 'next/headers';
import {redirect} from 'next/navigation';
import { LogIn } from 'lucide-react';
// import { cookies, headers } from "next/headers"; // cookies already use to initialize server supabase


export interface NotificationRes {
  success?:boolean,
  message?: string,
  others?:string
}


export async function registerAction(
  prevState:any,
  formData:FormData
):Promise<NotificationRes>{
  try{
    const fullname = formData.get('name') as string;
    const email = formData.get('email') as string;
    const tel = formData.get('tel') as string;
    const attachment = formData.get('attachment') as File;

    // Validate input form
    if(!fullname || !email){
      return {success:false, message:"Fullname and email is required"}
    }
    // Validate email form
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      return {success:false, message:"Invalid email form"}
    }

    // console.log(fullname,email,tel,attachment)
    
    // Create file name with uuid4
    const fileName = uuid4();

    // initialize supabase
    const supabase = await createClient();

    // Upload attactment to supabase stroage
    const {data:uploadFile, error:uploadError} = await supabase.storage.from('attachments').upload(fileName,attachment) ;

    // Handle upload error
    if(uploadError){
      return {success:false,message:uploadError.message};
    }

    // Get public URL from Supabase storage to store in table 'user' which url ref to path data
    const {data:attachmentURL} = supabase.storage.from('attachments').getPublicUrl(fileName);

    // Insert data to table 'users'
    const {data:insertData , error:insertError} = await supabase.from('users').insert([{
      fullname,
      email,
      tel,
      attachment: attachmentURL.publicUrl
    }
    ])

    // handle insert table
    if(insertError){
      return {success:false,message:insertError.message};
    }
    // If insert success
    // console.log("insertData:",insertData);

    return {success:true, message:'Register successfully'}

  }catch(error){
    const errorRes = error instanceof Error ? error.message : error as string ;
    return {success:false, message:errorRes}
  }
}

export async function signUpAction(
  prevState:any, 
  formData:FormData):Promise<NotificationRes> {
  try{
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const origin = (await headers()).get('origin');

    console.log(email, password)
    // Validate input and password
    // if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    //   return
    // }

    // initialize supabase
    const supabase = await createClient();

    // Signup (Authentication)
    let {data:userLogin, error:signUpError} = await supabase.auth.signUp({
      email,
      password,
      options:{
        emailRedirectTo:`${origin}/auth/callback`,
      }
    })

    if(signUpError){
      console.log(signUpError.message);
    }

    console.log('Sign up successfully')
    
    return {success:true, message: 'Sign up Successfully'} ;

  }catch(error){
    if(error instanceof Error){ 
      console.log(error.message);
      return {success:false, message:error.message}
      }
    else{
      console.log(`Instance type error`)
      return {success:false, message: "An unexpected error occured"}
      }
    }
    
  }


export async function signInAction(
  prevState:any, 
  formData:FormData): Promise<NotificationRes> {

  try{
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const origin = (await headers()).get('origin');

    console.log(`email:${email} | password:${password}`);

    // Validate input Form (server side)
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      throw new Error('Invalid email format.');
    }
    if(!password || password.length < 6){
      throw new Error('Password must be at least 6 characters');
    }

    // initialize supabase client 
    const supabase = await createClient();

    // Authenticate users 
    const {data:userData,error:errorLogin} = await supabase.auth.signInWithPassword({
      email,
      password,
      
    })

    // Handle login error
    if(errorLogin){
      console.log('Error Login:',errorLogin);
      throw new Error(errorLogin.message);
    }
    
    // If Login success
    console.log(`Login Successfully`);
    
    redirect(`/protected`);
    
    // return {success:true, message:''}
    

  }catch(error){
    const errorRes = error instanceof Error ? error.message : error as string;
    return {success: false, message: errorRes }
  }
}

export async function signOutAction(){
  try{
    // Initialize supabase 
    const supabase = await createClient();
    
    // SignOut 
    let {error:SignOutError} = await supabase.auth.signOut();

    if(SignOutError){
      console.log('ERROR Signout')
    }
    redirect('/sign-in');
    

  }catch(error){
    const errorRes = error instanceof Error ? error.message : error as string;
    console.log(errorRes);
  }
}