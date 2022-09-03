import * as React from 'react';
import {Redirect, Link} from 'react-router-dom';
// un composant des inputs d'un formulaire

import Form from 'react-bootstrap/Form'

class UpdateArticle extends React.Component {
// redirection initialisé false
    state = { redirection: false };

    constructor (props) {
        super(props)
        // recuperer l'utilisateur connecté et article depuis le localstorge
        const articlePage = JSON.parse(localStorage.getItem('articlePage'));
        const storage = JSON.parse(localStorage.getItem('userConnect'));
     // Initialiser un state
        this.state = {
            userId: storage.userId,
            isAdmin: storage.userAdmin,
            content: articlePage.content,
         
        }
        //pour transmettre les données en tant qu'argument à la fonction du composant 
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
//methode de class pour changer les champs de saisie 
    handleChange (e) {
        // recevoir les attributs de nom et de valeur 
        const name = e.target.name;
        const value =  e.target.value;
         // changement de champ de saisie avec setState
        this.setState({
            [name]: value
        })
    }
//methode de class pour modifier un article existant
    handleSubmit (e) {
        // annuler l'événement,par defaut
        e.preventDefault()
        // recuperer l'utilisateur connecté et le token depuis le localstorge
        const storage = JSON.parse(localStorage.getItem('userConnect'));
        let token = "Bearer " +  storage.token;
        
         //creer un objet formData pour envoyer un file
        const formData = new FormData();
        const imagedata = document.querySelector('input[type="file"]').files[0];
        formData.append('image', imagedata);
        formData.append('article', JSON.stringify(this.state));

        const requestOptions = {
            method: 'put',
            headers: { 
                
                'Authorization': token 
            },
            body: formData
        };

        let articlePage = JSON.parse(localStorage.getItem('articlePage'));
        let articleId = articlePage._id;
        // requeter l'API avec fetch
        fetch(('http://localhost:3001/api/articles/' + articleId), requestOptions)
                .then(response => response.json())
                .then((response) => {
                    if (!response.error) { 
                        this.setState({ redirection: true })
                    } 
                }
                )
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error('There was an error!', error);
            });
    }

    render() {
        //  faire une redirection après une requête PUT vers la page d'aricle correspondant
        const { redirection } = this.state;
        const articleId = this.props.match.params.id;
        if (redirection) {
            return <Redirect to={'/article/' + articleId}/>;
        }

        return <React.Fragment>
            <div className="container">
                <h1>Modifiez ce post</h1>
                <form>
                   
                    <Form.Group controlId="exampleForm.ControlTextarea1" >
                        <Form.Label>Contenu du post</Form.Label>
                        <Form.Control as="textarea" rows={8} name="content" value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    
                    <div className="update-image2">                  
                        <input className="form-control" type="file" name="imageUrl" />                 
                    </div>
                   
                    <div className="form-submit">
                        <button className="btn btn-outline-success btn-sm" onClick={this.handleSubmit}>Enregistrer les modifications</button>
                        <Link to='/articles/' className="btn btn-outline-info btn-sm">Retour aux posts</Link>
                    </div>
                </form>
            </div>
        </React.Fragment>
    };
};

export default UpdateArticle;