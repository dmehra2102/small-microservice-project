import axios from 'axios';
import React, { useState } from 'react'

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const onSubmit = async (e)=>{
        e.preventDefault();
        await axios.post("http://posts.com/posts", {
            title
        })

        setTitle('');
    }
  return (
    <div>
        <form onSubmit={onSubmit}>
            <div className='form-group'>
                <label>Title</label>
                <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className='form-control' />
            </div>
            <button className='btn btn-primary'>Submit</button>
        </form>
    </div>
  )
}

export default CreatePost