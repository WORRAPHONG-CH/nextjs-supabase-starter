'use client'
import React from 'react'
import {useState,useEffect} from 'react';
import { createClient } from '@/utils/supabase/client';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Link from 'next/link';
import { count } from 'console';

interface NotificationType{
  success:boolean,
  message:string
}

const initNotification:NotificationType = {
  success: false,
  message: ''
}

export default function UserManagement() {
  // Initialize supabase 
  const supabase = createClient();
  const itemsPerPage = 4; // 4 items per each

  const [users,setUsers] = useState<any>([]); // For get users data from select and filter
  const [searchValue,setSearchValue] = useState<string>('') // store search value
  const [totalPages,setTotalPages] = useState<number>(1); // use with pagination
  const [page, setPage] = useState<number>(1) // represent current page

  const [notiFetch, setNotiFetch] = useState<NotificationType>(initNotification) // For get notification
  const [notiSearch, setNotiSearch] = useState<NotificationType>(initNotification)


  // const userSupabaseQuery = async () =>{
  //   // Filter => "exact": Exact but slow count algorithm. Performs a COUNT(*) under the hood.
  //     let {data:query,error:queryError} = await supabase.from('users').select('*',{count:'exact'})
      
  //     // If seach function call 
  //     if(searchValue){
  //       query = query>.like('fullname')
  //     }

  //     // Handle error cases
  //     if(!query){
  //       throw new Error('Query error: null data')
  //     }
  //     if(queryError){
  //       console.log('Query error:',queryError.message);
  //       throw new Error(queryError.message);
  //     }

  //     // Query Successfully
  //     return {query,queryError}

  // }

  const fetchUsers = async () => {
    try{
      
      let {data:query,error:fetchError,count} = await supabase.from('users')
      .select('*',{count:'exact'})
      .range((page-1)*itemsPerPage, (itemsPerPage*page)-1) // range => index range of items (1st => 0-3, 2nd -> 4-7) 
      
      // console.log('count:',count)
      // Error Handling
      if(!query){
        throw new Error('Fail to fetch data');
      }
      if(fetchError){
        throw new Error(fetchError.message);
      }

      // Fetch data successfully 
      setUsers(query);// Set users state
      count = count || 1 // if fetch success it should have data, if no data just let =1 for cal pages (atleast should have 1 page)
      const calTotalPages = Math.ceil(count/itemsPerPage) // round up
      console.log('total page:',calTotalPages);
      setTotalPages(calTotalPages);
      
      setNotiFetch({
        success:true,
        message:'Fetch data successfully'
      })
      

    }catch(error){
      const resError = error instanceof Error ? error.message : "Something wrong" ;
      setNotiFetch({
        success:false,
        message:resError
      })
    }
  }

  const searchUser = async () =>{
    try{
      // Like search => Match only rows where column matches pattern case-sensitively.
      let {data:result,error:errorSearch,count} = await supabase.from('users')
      .select('*',{count:'exact'})
      .ilike('fullname',`%${searchValue}%`)
      .range((page-1)*itemsPerPage,(itemsPerPage*page)-1) // range index per page (1st 0-3, 2nd 4-7)
    
      
      // Error handling 
      if(!result){
        throw new Error('Fail to search data');
      }
      if(errorSearch){
        throw new Error(errorSearch.message);
      }

      // Seacrh Successfully
      count = count || 1 ; // if search success it should have data, if no data just let =1 for cal pages (atleast should have 1 page)
      console.log("search count:",count)
      setUsers(result);
      setPage(1); // set page to 1st because number of items will count again according to search filter
      const calTotalPages = Math.ceil(count/itemsPerPage);
      setTotalPages(calTotalPages);
      setNotiSearch({success:true, message:'Search Successfully'});


    }catch(error){
      const errorRes = error instanceof Error ? error.message : 'Error occured during search'
      setNotiSearch({success:false, message:errorRes});
    }
    

  }

  const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) =>{
    const search = event.target.value;
    setSearchValue(search);
    // searchUser();
    
  }


  // Fetch data every state page changes
  useEffect(()=>{
    fetchUsers();
  },[page]) // array dependencies fetch data only first time render

  // Fetch data at the first time
  // useEffect(()=>{
  //   fetchUsers();
  // },[])
  
  // console.log('search:',searchValue);

  return (
    <div className='flex flex-col w-8/12 mx-auto p-3 gap-10'>
        
        <div className='flex flex-col gap-2'>
            <Label htmlFor='search'>Seach bar</Label>
            <div className='flex flex-row gap-3'>
                <Input name="search" type='text' onChange={handleSearch} placeholder='Search name/email'/>    
                <Button onClick={searchUser}>Search</Button>
            </div>
        </div>
        
        <main className='w-full flex flex-col justify-center '>
          <div className='h-60'>
          <table className='w-full ' >
              <thead className=''>
                <tr>
                  <th className='border border-gray-600 px-4 py-2'>ID</th>
                  <th className='border border-gray-600 px-4 py-2'>Name</th>
                  <th className='border border-gray-600 px-4 py-2'>Email</th>
                  <th className='border border-gray-600 px-4 py-2'>Telephone</th>
                  <th className='border border-gray-600 px-4 py-2'>Attachment</th>
                </tr>
              </thead>
            
            <tbody className=' border border-gray-300'>
              {users?.map((user:any)=>{
                return(
                  <tr key={user.id} className=''>
                    <td className='p-2 border border-grey-800'>{user.id}</td>
                    <td className='p-2 border border-grey-800'>{user.fullname}</td>
                    <td className='p-2 border border-grey-800'>{user.email}</td>
                    <td className='p-2 border border-grey-800'>{user.tel}</td>
                    {user.attachment && <td className='flex flex-row justify-center border border-grey-800'>
                      <Button size={'sm'}>
                        <a href={user.attachment}>Download</a>
                      </Button>
                    </td>}
                  </tr>
                )
              })}
            </tbody>
            </table>
          </div>
            

            <div className='my-5 flex flex-col items-center gap-3'>

                  <div className='flex flex-row justify-center'>

                    {page > 1 ?
                      <Button size={'sm'} variant={'ghost'} onClick={() => setPage(page-1)}>Previous</Button>
                      :
                      <Button size={'sm'} variant={'ghost'} disabled onClick={() => setPage(page-1)}>Previous</Button>
                    }

                    {page < totalPages ? 
                      <Button size={'sm'} variant={'ghost'} onClick={()=>setPage(page+1)}>Next</Button>
                      :
                      <Button size={'sm'} variant={'ghost'} disabled onClick={()=>setPage(page+1)}>Next</Button>
                    }
                    
                    
                  </div>
                  <h1 className='text-sm font-light'>Page {page}/{users && <span>{totalPages}</span>}</h1>
                
              
              
            </div>
        </main>

    </div>
  )
}
