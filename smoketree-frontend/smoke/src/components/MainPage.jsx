import React from "react";
import './MainPage.css';
import { useState ,useContext,useEffect} from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";


const MainPage = () => {

    const [isFormVisible,setIsFormVisible]=useState(false);
    const [tableVisible,setTableVisible]=useState(false)
    const [name,setName]=useState('');
    const [address,setAddress]=useState('');
    const [redirect,setRedirect]=useState(false);
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [employees,setEmployees]=useState([])
    const { token } = useContext(UserContext);
    // const [isEditing,setIsEditing]=useState(false);
    // const [editingForm,setEditingForm]=useState(null)

    const handleCreateEmp=()=>{
        setIsFormVisible(true);
        setTableVisible(false)
    }
    
    const handleTable=()=>{
        setIsFormVisible(false)
        setTableVisible(true)
    }
    
    const handleFormData = async (e) => {
        e.preventDefault();
        
        const formData = {
            name: name,
            address: address
        };
    
        const response = await fetch('http://localhost:4000/formpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData), 
            credentials: 'include',
        });
    
        if (response.ok) {
            setIsFormVisible(false);
            setTableVisible(true);
            fetchTasks();
        } else {
            console.error('Failed to submit form');
        }
    };

      const fetchTasks=async()=>{
        const response=await fetch('http://localhost:4000/employee',{
            method:'GET',
            headers:{
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials:'include',
        })
        
        if(response.ok){
            const data=await response.json()
            console.log(data)
            setEmployees(data)
            // console.log(data);
            console.log(fetchTasks);
        }else{
            console.error('Failed to fetch tasks',await response.json())
        }
        console.log(employees)
    }
    useEffect(()=>{
        if (token) {
            fetchTasks();
        }
    },[token]);
    const handleLogout = () => {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
            })
            .then(() => setUserInfo(null))
            .catch(error => {
                console.error('Error logging out', error);
            });
            setRedirect(true)
    };
    const resetForm=()=>{
        setName('');
        setAddress('');
        setIsFormVisible(false)
    }
       if(redirect){
        return <Navigate to={'/login'}/>
       }
 




return (
        <div className="total">
            <div className="main">
                {/* <a className="logo" href="#"><img src={assets.user_icon} alt="User Icon" /></a> */}
                <span>{userInfo ? userInfo.userName : ''}</span>
                <ul className="navbar">
                    <li><a href="#home">HOME</a></li>
                    <li><a href="#employee-list" onClick={handleTable}>USER TABLE</a></li>
                    <li><a href="#create" onClick={handleCreateEmp}>FILL FORM</a></li>
                </ul>
                <div className="header-btn">
                    <a href="#" className="logout" onClick={handleLogout}>Logout</a>
                </div>
            </div>
            <div className="second">
                <div className="heading">
                    <h2>USER TABLE</h2>
                </div>
                {isFormVisible && (<div className="list">
                <form onSubmit={handleFormData} encType="multipart/form-data">
                    <div className="formdata">
                        <label>UserName</label>
                        <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
                        <label>Address</label>
                        <input type="address" value={address} onChange={(e)=>setAddress(e.target.value)}/>
                        <button type="submit">Submit</button>
                    </div>
                </form>
                {/* <div>
                
                </div> */}


                </div>
            )}
            </div>
            {tableVisible &&(<div className="tablebox">
            <table>
                    <tr>
                        <thead>
                            <th>UserName</th>
                            <th>Address</th>

                        </thead>
                        <tbody>
                            {employees.length>0?(
                                employees.map((employee,index)=>(
                                    <tr key={index}>
                                        <td>{employee.name}</td>
                                        <td>{employee.address}</td>

                                    </tr>
                                ))
                            ):(
                                <tr>
                                    <td>No data available</td>
                                </tr>
                            )}
                            

                        </tbody>
                        
                        
                    </tr>
                </table>

            </div>)}
        </div>
    );
}


export default MainPage;
