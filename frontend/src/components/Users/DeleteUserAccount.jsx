import React, { useState, useCallback} from 'react';
import { Redirect, Link } from 'react-router-dom';

function DeleteUserAccount ({ match }) {

    const [redirect, setRedirect] = useState(false);

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    let token = "Bearer " +  storage.token;
    let userId = match.params.id;

    const handleSubmit = useCallback(function () {
        fetch(('http://localhost:3001/api/users/' + userId), {
            method: "delete",
            headers: 
                { "Content-type" : 'application/json',
                'Authorization': token
                },
            body: JSON.stringify({
              
                userId: storage.userId,
                admin: storage.admin
            })
        })
        .then(res => res.json())
        .then(
            (res) => {
                if (res.error) { 
                
                } else { 
                    setRedirect(true);
                }
            }
        )
        .catch(error => {
            this.setState({ Erreur: error.toString() });
            console.error('There was an error!', error);
        })
    }, [userId, storage.admin, storage.userId, token])

    return (
        <React.Fragment>
            {redirect ? <Redirect to="/articles/" /> : null}
            <div className="container">
                <h1>Souhaitez vous vraiment supprimer ce compte ?</h1>
                <div className="form-submit">
                    <Link to={'/user/' + userId} className="btn btn-outline-info btn-sm">Retour au compte utilisateur</Link>
                    <button className="btn btn-outline-danger btn-sm" onClick={handleSubmit}>Supprimer ce compte</button>
                </div>
            </div>
        </React.Fragment>
    );
}

export default DeleteUserAccount;