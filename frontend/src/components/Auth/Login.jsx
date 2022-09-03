import React, {useState, useCallback, useContext, useMemo, createContext} from 'react';
import AuthApi from '../AuthApi';
import Cookies from 'js-cookie';

const FormContext = createContext({})

function FormWithContext ({defaultValue, onSubmit, children}) {
// info de l'utilisateur
    const [data, setData] = useState(defaultValue)

    const change = useCallback(function (name, value) {
        setData(d => ({...d, [name]: value}))
    }, [])

    const value= useMemo(function () {
        return {...data, change}
    }, [data, change])

    const handleSubmit = useCallback(function (e) {
        e.preventDefault()
        onSubmit(value)
    }, [onSubmit, value])

    return <FormContext.Provider value={value}>
        <form onSubmit={handleSubmit}>
            {children}
        </form>
    </FormContext.Provider>
}

function FormField ({name, type, children}) {
    const data = useContext(FormContext)
    const handleChange = useCallback(function (e) {
        data.change(e.target.name, e.target.value)
    }, [data])

    return <div className="form-group">
        <label htmlFor={name}>{children}</label>
        <input type={type} name={name} id={name} className="form-control" value={data[name] || ''} onChange={handleChange}/>
    </div>
}

function PrimaryButton ({children}) {
    return <button className="btn btn-info">{children}</button>
}


function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function Login () {
    deleteAllCookies();
    localStorage.clear();
    const [error, setError] = useState(null);
    const Auth = React.useContext(AuthApi);

    const handleSubmit = useCallback(function (value) {

        fetch("http://localhost:3001/api/auth/login/", {
            method: "post",
            headers: { "Content-type" : 'application/json'},
            body: JSON.stringify({
                email: value.email,
                password: value.password
            })
        })
        .then(res => res.json())
        .then(
            (result) => {
                localStorage.setItem('userConnect', JSON.stringify(result));
                let storage = JSON.parse(localStorage.getItem('userConnect'));
                if (storage.token === undefined) {
                    Auth.setAuth(false)
                  
                } else {
                    
                    Auth.setAuth(true)
                    Cookies.set("user", "loginTrue")
                  
                }
            },
            (error) => {
                if(error) {
                    setError(error);
                    Auth.setAuth(false)
                }
            }
        )
    }, [Auth])

    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else {
        return (
            <React.Fragment>
                <div className="container">
                    <h1>Connectez-vous à votre compte</h1>
                    <FormWithContext onSubmit={handleSubmit}>
                        <FormField name="email" type="text">Email</FormField>
                        <FormField name="password" type="password">Mot de passe</FormField>
                        <PrimaryButton>Me connecter</PrimaryButton>
                    </FormWithContext>
                </div>
            </React.Fragment>
        );
    } 
}

export default Login;