import * as React from 'react';
import {Redirect, Link} from 'react-router-dom';

class DeleteComment extends React.Component {
    // redirection initialisé false
    state = { redirection: false };

    constructor (props) {
        super(props)
          // recuperer l'utilisateur connecté depuis le localstorge
        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        // Initialiser un state
        this.state = {
            userId: userConnect.userId,
            isAdmin: userConnect.userAdmin
        }
        //pour transmettre les données en tant qu'argument à la fonction du composant 
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //methode de class pour changer les champs de saisie 
    handleSubmit (e) {
        // annuler l'événement,par defaut 
        e.preventDefault()
        // recuperer l'utilisateur connecté depuis le localstorge et le token
        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        let token = "Bearer " +  userConnect.token;
        
        const requestOptions = {
            method: 'delete',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(this.state)
        };
         // recuperer le commentId
         const commentId = this.props.match.params.id;
             // faire la POST request avec fetch
        fetch(('http://localhost:3001/api/comments/' + commentId), requestOptions)
                .then(response => response.json())
                .then((response) => {
                    if (response.error) { 
                        this.setState({ redirection: true })
                       
                    } else { 
                        this.setState({ redirection: true })
                       
                    }
                })
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error('There was an error!', error);
        });
    }

    render () {
        const articlePage = JSON.parse(localStorage.getItem('articlePage'));
        const articleId = articlePage._id;
        
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to={'/article/' + articleId}/>;
        }

        return <React.Fragment>
            <div className="container">
                <h1>Souhaitez vous vraiment supprimer ce commentaire ?</h1>
                <div className="form-submit">
                    <Link to={'/articles/'} className="btn btn-outline-info btn-sm">Retour aux posts</Link>
                    <button className="btn btn-outline-danger btn-sm" onClick={this.handleSubmit}>Supprimer ce commentaire</button>
                </div>
            </div>
        </React.Fragment>
    };
};

export default DeleteComment;