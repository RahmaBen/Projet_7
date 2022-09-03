import * as React from 'react';
import {Redirect, Link} from 'react-router-dom';

class DeleteArticle extends React.Component {
    // redirection initialisé false
    state = { redirection: false };

    constructor (props) {
        super(props)
         // recuperer l'utilisateur connecté depuis le localstorge
        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        // Initialiser un state
        this.state = {
            userId: userConnect.userId,
            admin: userConnect.admin
        }
         //pour transmettre les données en tant qu'argument à la fonction du composant
        this.handleSubmit = this.handleSubmit.bind(this);
    }
//methode de class pour supprimer un article
    handleSubmit (e) {
         // annule l'événement 
        e.preventDefault()
// recuperer l'utilisateur connecté depuis le localstorge et le token
        const storage = JSON.parse(localStorage.getItem('userConnect'));
        let token = "Bearer " +  storage.token;
      
        const requestOptions = {
            method: 'delete',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(this.state)
        };

        // recuperer l'id de l'article
        let articleId = this.props.match.params.id;

        fetch(('http://localhost:3001/api/articles/' + articleId), requestOptions)
                .then(response => response.json())
                .then(
                    (response) => { 
                        
                         this.setState({ redirection: true })
                        if (response.error) { 
                            this.setState({ redirection: true })
                          
                        } else { 
                            this.setState({ redirection: true })
                          
                            
                        }
                    }
                )
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error('There was an error!', error);
                }
            );
    }

    render () {
        //  faire une redirection après une requête DELETE vers les articles
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/articles' />;
        }

        return <React.Fragment>
            <div className="container">
                <h1>Souhaitez vous vraiment supprimer ce post ?</h1>
                <div className="form-submit">
                    <Link to={'/articles/'} className="btn btn-outline-info btn-sm">Retour aux posts</Link>
                    <button className="btn btn-outline-danger btn-sm" onClick={this.handleSubmit}>Supprimer ce post</button>
                </div>
            </div>
        </React.Fragment>
    };
};

export default DeleteArticle;