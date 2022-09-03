import React, {useCallback} from 'react';
import { Link } from 'react-router-dom';
import AuthApi from '../AuthApi';
import Cookies from 'js-cookie';

function DeleteAccount () {
    // accéder au AuthApi context
    const Auth = React.useContext(AuthApi);

    // recuperer le token, userId et verifier s'il est un admin
    const storage = JSON.parse(localStorage.getItem('userConnect'));
    const userId = storage.userId;
    const isAdmin = storage.admin;
    let token = "Bearer " +  storage.token;

    // generer un callback qui va etre memoriser
    const handleSubmit = useCallback(function () {


        fetch(('http://localhost:3001/api/users/' + userId), {
            method: "delete",
            headers: 
                { "Content-type" : 'application/json',
                'Authorization': token
                },
            body: JSON.stringify({
                userId: userId,
                admin: storage.admin
            })
        })
        .then(res => res.json())
        .then(
            (res) => {
                if (!res.error) { 
                    Auth.setAuth(false);
                    Cookies.remove("user");
                    localStorage.clear();
                } 
            }
        )
        .catch(error => {
            this.setState({ Erreur: error.toString() });
           
            console.error('There was an error!', error);
        })
        // a exécuter lorsque Auth, isAdmin, userId, token change
    }, [Auth, isAdmin, userId, token])

    return (
        <div className="container">
            <h1>Souhaitez vous vraiment supprimer votre compte ?</h1>
            <div className="form-submit">
                <Link to={'/user/' + userId} className="btn btn-outline-info btn-sm">Retour à mon compte</Link>
                <button className="btn btn-outline-danger btn-sm" onClick={handleSubmit}>Supprimer mon compte</button>
            </div>
        </div>
    );
}

export default DeleteAccount;