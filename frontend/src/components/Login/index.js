import {Component} from "react"

import Cookies from "js-cookie"

import "./index.css"

class Login extends Component{

    state={
        username:"",
        password:"",
        error:"",
        selectType:"Log User",
        nameExist:false,
        tableError:"",
        email:"",
        mailError:false
    }

 





 

    user=(e)=>{
        this.setState({
            username:e.target.value
        })
    }

    hide=(e)=>{
        this.setState({
            password:e.target.value
        })
    }

    Done=async(e)=>{

        e.preventDefault()

        const {history}=this.props;
      
     const {username,password,selectType,email}=this.state;

     

       

        if(username==="" || password===""){
            this.setState({
                error:"Please Give Valid Credentials!"
            })
        }

        else{

         
            Cookies.set("name",username.toLocaleLowerCase(),{expires:30})
            Cookies.set("user",username,{expires:30})

            if(selectType==="New User"){
                
                const getUser=await fetch("http://localhost:4000/lists")

          

                const jsonUser=await getUser.json()

                const filter = jsonUser.find((s)=>(
                    s.name===username

              
                ))
           
               

                
                if(filter===undefined){

                    const details={"name":username,"password":password}


                    const dataStore={"name":username,"email":email,"password":password}

                    const store={

                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify(dataStore)

                    }
                  
                    const Api=await fetch("http://localhost:4000/post",store)

                    const dataApi= await Api.json()

                


                  

                  

                     if(dataApi.error==="Invalid"){

                        this.setState({
                            mailError:true,
                            email:email
                            
                        })
                        
                     }
                     else{

                 

                   



                    const options={
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify(details)
                    }
                 const apiForuser= await fetch("http://localhost:4000/userslist",options)

                 const jsonApi=await apiForuser.json()

                 const {token}=jsonApi;

                 console.log(token)
                 
                 Cookies.set("jwtToken",token,{expires:30})

                   const getTables= await fetch("http://localhost:4000/getTable")

                   const tableJson=await getTables.json()

                   const tableFilter=tableJson.find((s)=>(
                    s.name===username
                   ))

                    if(tableFilter===undefined){
                        const histTable="hist"+username.toLowerCase()
                        const apitable=await fetch(`http://localhost:4000/table/${username.toLowerCase()}/${histTable}`);
                    
                    }

                
                    


                history.replace("/")
               

                    this.setState({
                        nameExist:false,
                        username:"",
                        password:"",
                        email:"",mailError:false
                    })

                   
                }
                     
                    
                }
                else{
                   
                        this.setState({
                            nameExist:true,
                            username:"",
                            password:"",
                            mailError:false
                        })
                }
            }
            
            if(selectType==="Log User"){

                const jwtToken=Cookies.get("jwtToken")

                const getUser=await fetch("http://localhost:4000/lists")

            

               

                const jsonUser=await getUser.json()

                const LoginFilter=jsonUser.filter((s)=>(
                   s.name===username
                ))
                    if(LoginFilter.length===0){
                       this.setState({
                        error:"Ur Credentials is Wrong!"
                       })
                    }
                    else{
                      

                        const tokenOption={

                          
                            method:"GET",
                            headers:{
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${jwtToken}`
                            }
                        }

                        const apiToken= await fetch(`http://localhost:4000/token/${password}`,tokenOption)

                      

                        const jsonToken=await apiToken.json();

                        const {string}=jsonToken;

                        console.log(jsonToken)

                        if(string==="failure"){
                            this.setState({
                                error:"ur credentials is wrong!!"
                            })
                        }
                        else{
                        
                        history.replace("/")

                        }
                    }

                
           

            }


                
          

            

            
      

            
        }
        }

        newUser=(e)=>{
           
            this.setState({
                selectType:"New User",
                error:""
            })
        }

        loginUser=(e)=>{
         
            this.setState({
                selectType:"Log User",
                error:"",
               
            })
        }


        emailtext=(e)=>{
            this.setState({
                email:e.target.value,
                mailError:"",
               
            })
        }

    render(){


        const {error,selectType,nameExist,username,password,email,mailError}=this.state;

    
       
         return(
            <div className="log-main" >


                        
                        <form className="login" onSubmit={this.Done} >

                        <img src="https://t3.ftcdn.net/jpg/04/49/10/90/240_F_449109029_JufAjfMU9DnEElRJKHVJrM19iIFdyzhF.jpg" className="img-logo" alt="logo" />                    
                        <h1 className="text" >{selectType==="New User"?"Create New User":"Sign In"}</h1>
                        <div className="use" >
                            <label className="text" htmlFor="input1" >Username</label>
                            <input id="input1" type="text" value={username} placeholder="Enter Your name" className="fie" onChange={this.user}  />
                            <label className="text"  htmlFor="input2"  >Password</label>
                            <input id="input2" type="password" value={password} placeholder="Enter Your Password" className="fie" onChange={this.hide}/>
                            {selectType==="New User"?<>  <label className="text"  htmlFor="input3"  > Email</label>
                            <input id="input3" type="text" value={email} placeholder="Enter Your email" className="fie" onChange={this.emailtext}/>
                        </>:""}
                        </div>

                        <button className="sign" type="submit"  >Login</button>

                        {error!==""?<p className="er-msg" >{error}</p>:""}

                        <div className="login-sign" >

                        
                        <button className="user-log" onClick={this.newUser} type="button" >Create New User</button>

                        <button className="user-log" onClick={this.loginUser} type="button" >Sign In</button>
                        </div>

                        <p className="er-msg" >{nameExist?"Name Already exists!":""}</p>
                        <p className="er-msg" >{mailError?"Invalid Mail":""} </p>
                        
                        </form>
            </div>
        )
    }

}


export default Login