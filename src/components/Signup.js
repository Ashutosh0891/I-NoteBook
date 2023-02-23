import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", cpassword: "", phoneNumber: "" });
    let navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const { name, password, email, phoneNumber } = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phoneNumber })
        });

        const json = await response.json();
        console.log(json);
        if (json.success) {
            localStorage.setItem('token', json.authToken)
            navigate("/");
            console.log(localStorage.getItem('token'))
            props.showAlert("User created successfully","success")
        }else{
            props.showAlert("Invalid Credentials","danger")
        }
    }
    const handleOnChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='conatiner mt-2'>
            <h2>Create your Account</h2>
            <form onSubmit={handleOnSubmit} >
                <div className="mb-3 my-2">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' onChange={handleOnChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={handleOnChange} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={handleOnChange} minLength={5} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={handleOnChange} minLength={5} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">PhoneNumber</label>
                    <input type="number" className="form-control" id="phoneNumber" name='phoneNumber' onChange={handleOnChange} minLength={10} required />
                </div>


                <button type="submit" className="btn btn-primary" >Signup</button>
                <h6 className='my-3'><Link to="/">Already a user? Login</Link></h6>
            </form>
        </div>
    )
}

export default Signup
