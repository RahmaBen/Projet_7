import * as React from 'react';
import {Redirect, Link} from 'react-router-dom';
// un composant des inputs d'un formulaire
// import Field from '../Form/Field';
import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button';

class CreateArticle extends React.Component {
// redirection initialisé false
    state = { redirection: false };

    constructor (props) {
        super(props)
        // recuperer l'utilisateur connecté depuis le localstorge
        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        // Initialiser un state
        this.state = {
            userId: userConnect.userId,
            content: undefined || '',
           
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


//methode de class pour publier un nouveau article
    handleSubmit (e) {
        // annuler l'événement,par defaut 
        e.preventDefault()
    // recuperer l'utilisateur connecté depuis le localstorge et le token
        const storage = JSON.parse(localStorage.getItem('userConnect'));
        let token = "Bearer " +  storage.token;
        
        //creer un objet formData pour envoyer un file
        const formData = new FormData();
        const imagedata = document.querySelector('input[type="file"]').files[0];
        // ajouter des champs avec la méthode append()
        formData.append('image', imagedata);
        formData.append('article', JSON.stringify(this.state));

        
        const requestOptions = {
            method: 'post',
            headers: { 
                'Authorization': token
            },
            body: formData
        };
         // faire la POST request avec fetch
        fetch(('http://localhost:3001/api/articles/'), requestOptions)
                .then(response => response.json())
                .then(
                    (response) => {
                        // si pas d'erreur redirection egale à true
                    if (!response.error) { 
                        this.setState({ redirection: true })
                    } 
                })
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error('There was an error!', error);
            });
    }

    render() {
        //  faire une redirection après une requête POST vers les articles
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/articles' />;
        }

        return <React.Fragment>
            <div className="container">
                <h1>Publiez un post</h1>
                <form>
                  
                    {/* un contrôle de formulaire avec le style Bootstrap grace a Form.Group */}
                    <Form.Group controlId="exampleForm.ControlTextarea1" >
                        <Form.Label>Contenu du post</Form.Label>
                        <Form.Control as="textarea" rows={8} name="content" value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    <div className="update-image2">                  
                        <input className="form-control" type="file" name="imageUrl" />                 
                    </div>

                   
                    <div className="form-submit">
                        <button className="btn btn-outline-success btn-sm" onClick={this.handleSubmit}>Publier</button>
                        <Link to='/articles' className="btn btn-outline-info btn-sm">Retour aux posts</Link>
                    </div>
                </form>
            </div>
        </React.Fragment>
    };
};

export default CreateArticle;