import React,{useState,useEffect} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
    Button,
    TextField
} from '@material-ui/core';

let baseUrl="https://jsonplaceholder.typicode.com";
const FetchPosts = () => {
    const [postJsonData, setPostJsonData]=useState([]);
    const [showAddButton, setShowAddButton]=useState(true);
    const [showSaveButton, setShowSaveButton]=useState(false);
    const [showRowTextField,setShowRowTextField]=useState(false); 
    const [showEditSaveButton,setShowEditSaveButton]=useState(false); 
    const [title,setTitle]=useState("");
    const [body,setBody]=useState("");
    const [selectedIdEdit,setSelectedIdEdit]=useState(null);
    const [selectedUserIdEdit,setSelectedUserIdEdit]=useState(null);
    const [id,setId]=useState(100);
    const handleRowButton=()=>{
        setShowRowTextField(true);
        setShowSaveButton(true); 
        setShowAddButton(false);
      }
      useEffect(()=>{
        getPost();
       
     },[]);
     const getPost=()=>{
       fetch(baseUrl+"/posts").then((response)=>{
           return response.json();
       }).then((result)=>{
           setPostJsonData(result);
       }).catch((error)=>{
           console.log("error",error);
       });  
   }
      const addNewRow=()=>{
        if(title || body !==""){
          let data={
            id:setId(id+1),
            title: title,
            body: body,
            userId: 1
          }
          fetch(baseUrl+'/posts', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json; charset=UTF-8"          
          }
        })
        .then(response => response.json())
        .then(json => {console.log(json);
        setPostJsonData(oldArray => [...oldArray, json]);
        })
      
        setTitle('');
        setBody('');
        }else{
          alert("please fill atleast one record")
        }
      }
      const getIdForEdit=(selectedId,userId, title,body)=>{
        setSelectedIdEdit(selectedId);
        setSelectedUserIdEdit(userId);
        setShowRowTextField(true);
        setShowEditSaveButton(true);
        setShowSaveButton(false);
        setShowAddButton(false)
        setTitle(title);
        setBody(body);
      }
      const SaveEdit=()=>{
        let EditedData={
          id: selectedIdEdit,
          title: title,
          body: body,
          userId:selectedUserIdEdit
        }
        if(title && body !==""){
        fetch(`${baseUrl}/posts/${selectedIdEdit}`, {
          method: 'PUT',
          body: JSON.stringify(EditedData),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
        .then(response => response.json())
        .then(json => {
          postJsonData.map((e)=>{ 
           if(e.id===selectedIdEdit){
               let oldArrayAfterFilter=postJsonData.filter((item)=>{return item.id !==selectedIdEdit})
             return setPostJsonData([...oldArrayAfterFilter,json]);
           }
          })  
        }); 
      }else {
        alert("title, body should not empty");
      }
      }
      const getUserIdForDelete=(selectedId)=>{
        setShowEditSaveButton(false);
        setShowRowTextField(false);
        setShowAddButton(true);
        setShowSaveButton(false);
        setTitle('');
        setBody('');
        fetch(`${baseUrl}/posts?userId=${selectedId}`)
        .then((response) => response.json())
        .then((json) => {
          let filteredArray=postJsonData.filter((item)=>{return item.id !==selectedId})
          setPostJsonData(filteredArray) ;
        })
      } 
    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="header">
                            Id
            </TableCell>
                        <TableCell className="header">
                            Title
            </TableCell>
                        <TableCell className="header">
                            Body
            </TableCell>
                        <TableCell className="header">
                            User Id
            </TableCell>
                        <TableCell className="header" style={{ textAlign: "center" }} colSpan={2}>
                            Action
            </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {postJsonData.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    {item.id}
                                </TableCell>
                                <TableCell>
                                    {item.title}
                                </TableCell>
                                <TableCell>
                                    {item.body}
                                </TableCell>
                                <TableCell>
                                    {item.userId}
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => { getIdForEdit(item.id, item.userId, item.title, item.body) }} >Edit</Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => { getUserIdForDelete(item.id) }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {showRowTextField &&
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell><TextField label="Title" placeholder="Enter title" onChange={(e) => { setTitle(e.target.value) }} value={title}></TextField></TableCell>
                            <TableCell><TextField label="Body" placeholder="Enter body" onChange={(e) => { setBody(e.target.value) }} value={body}></TextField></TableCell>
                        </TableRow>
                    }
                    <TableRow>
                        <TableCell colSpan={2}>
                            {showSaveButton && <Button color="primary" variant="contained" size="large" onClick={addNewRow}>SAVE</Button>}
                            {showAddButton && <Button color="primary" variant="contained" size="large" onClick={handleRowButton} >+ ADD</Button>}
                            {showEditSaveButton && <Button color="primary" variant="contained" size="large" onClick={SaveEdit}>SAVE EDIT</Button>}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default FetchPosts;