import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class ImageUpdate extends React.Component {
     // redirection initialisé false
    state = { redirection: false }
    constructor(props) {
        // recuperer l'utilisateur connecté depuis le localstorge
        const storage = JSON.parse(localStorage.getItem('userConnect'));

        super(props)
          // Initialiser un state
        this.state = {
            userId: storage.userId,
            isAdmin: storage.userAdmin,
            redirect: false
        }
        //pour transmettre les données en tant qu'argument à la fonction du composant 
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //methode de class pour changer les champs de saisie 
    handleSubmit(e) { 
          // annuler l'événement,par defaut
        e.preventDefault();
         //creer un objet formData pour envoyer un file
        const formData = new FormData();
        const imagedata = document.querySelector('input[type="file"]').files[0];
        formData.append('image', imagedata);

        const storage = JSON.parse(localStorage.getItem('userConnect'));
        const userId = storage.userId;
        let token = "Bearer " +  storage.token;
        // requeter l'API avec fetch
        fetch("http://localhost:3001/api/users/" + userId,
        {
            method: 'put',
            headers: {"Authorization" : token}, 
            body: formData 
        })
        .then((res) => { 
            this.setState({ redirect: true })
            if (res.ok) { 
            alert("Votre image à bien été modifiée !"); 
            } else if (res.status === 401) { 
                alert("Une erreur s'est produite, rententez ! "); 
            } 
            }, function (e) { 
                alert("Une erreur s'est produite : " + e); 
            }); 
        } 

    render() {
        const storage = JSON.parse(localStorage.getItem('userConnect'));
        const userId = storage.userId;

        const { redirect } = this.state;
        if (redirect) {
         return <Redirect to={'/user/' + userId}/>;
      }

    return <div className="container">
                <h1>Modifiez votre photo de profil</h1>
                <div className="update-image">
                    <form className="addPhotoForm" onSubmit={this.handleSubmit}>
                        <input className="form-control" type="file" name="imageUrl" />
                        <Button color="success" type="Submit">Add</Button>
                    </form>
                    <Link to={'/user/' + userId} className="btn btn-outline-info btn-sm">retour à mon compte</Link>
                </div>
        </div>
    }
}

export default ImageUpdate;