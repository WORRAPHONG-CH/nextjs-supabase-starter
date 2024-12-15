"use server";

import { createClient } from '@/utils/supabase/server'; // init supabase
import {v4 as uuid4} from 'uuid';
// import { cookies, headers } from "next/headers"; // cookies already use to initialize server supabase


export interface NotificationRes {
  success:boolean,
  message: string
}


export async function signUp(
  prevState:any, 
  formData:FormData):Promise<NotificationRes> {
  try{
    const fullname = formData.get('name') as string;
    const email = formData.get('email') as string;
    const tel = formData.get('tel') as string;

    // Get file from formData type file name 'attachment'
    const attachment = formData.get('attachment') as File; 

    // Validate required fields
    if(!fullname || !email){
      throw new Error('Missing required fields: fullname,email ')
    }

    console.log('fullname:', fullname);
    console.log('email:', email);
    console.log('tel:', tel);
    console.log('fileName:', attachment.name);

    // Initialize Supabase client
    const supabase = await createClient(); 
    // console.log(supabase);

    // Use uuid4 for file name because supabase storage cannot upload same file name
    const fileName = uuid4();

    // Upload file to storage supabase (standard upload)
    const {data:dataFile, error:uploadError} = await supabase.storage.from('attachments').upload(fileName,attachment);
    
    if(uploadError){
      console.log(uploadError.message);
      throw new Error('Fail to upload file');
    }
    console.log(dataFile);

    // Get public URL to store path in table 'users' which ref to supabase storage 
    const {data:attachmentURL} = supabase.storage.from('attachments').getPublicUrl(fileName);
    console.log(attachmentURL);

    // Insert data to supabase table with 4 fields
    const {data:dataInsert,error:insertError} = await supabase.from('users').insert([
      {
        fullname,
        email,
        tel,
        attachment: attachmentURL.publicUrl,
      }
    ]);

    if(insertError){
      console.log(insertError.message);
      throw new Error(insertError.message);
    };

    return {success:true, message: 'Register Successfully'} ;

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


export async function signIn(
  prevState:any, 
  formData:FormData): Promise<NotificationRes> {

  try{
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
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
      password
    })

    // Handle error if login fail
    if(errorLogin){
      console.log('Error Login:',errorLogin);
      throw new Error(errorLogin.message);
    }
    
    // If Login success
    console.log("user:",userData);


    return {success:true, message:''}

  }catch(error){
    const errorRes = error instanceof Error ? error.message : error as string;
    return {success: false, message: errorRes }
  }
}