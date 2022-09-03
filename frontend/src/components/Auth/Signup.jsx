import React from 'react';
import {Redirect} from 'react-router-dom';


class Signup extends React.Component {
    // redirection initialisé false
    state = { redirection: false }

    constructor (props) {
        super(props)
         // Initialiser un state
        this.state = {
            name: undefined || '',
            lastName: undefined || '',
            email: undefined || '',
            password: undefined || ''
    
        }
         //pour transmettre les données en tant qu'argument à la fonction du composant 
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
//methode de class pour changer les champs de saisie 
    handleChange (e) {
        // annuler l'événement,par defaut 
        e.preventDefault();
        // recevoir les attributs de nom et de valeur 
        const name = e.target.name;
        const value =  e.target.value;
         // changement de champ de saisie avec setState
        this.setState({
            [name]: value
        })
    }

//methode de class pour s'inscrire
    handleSubmit (e) {
         // annuler l'événement,par defaut 
        e.preventDefault()
            console.info('Formulaire valide !')
        
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(this.state)
            };
            // faire la POST request avec fetch
            fetch('http://localhost:3001/api/auth/signup/', requestOptions)
                .then(response => response.json())
                .then((response) => {
                    if (!response.error) { 
                        this.setState({ redirection: true })
                    } 
                })
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    
                    console.error('Il y a eu une erreur :', error);
                });

    }

    render() {
         //  faire une redirection après une requête POST vers la page login
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/login'/>;
        }

        return <React.Fragment>
            <div className="container">
                <h1>Inscrivez au réseau social de votre entreprise !</h1>
                <form>

                    <div className="form-group">
                        <label htmlFor="name">Prénom</label>
                        <input type="text" value={this.state.name} onChange={this.handleChange} name="name" className="form-control" required noValidate/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input type="text" value={this.state.lastName} onChange={this.handleChange} name="lastName" className="form-control" required noValidate/>
                      
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" value={this.state.email} onChange={this.handleChange} name="email" className="form-control" required noValidate/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" value={this.state.password} onChange={this.handleChange} name="password" className="form-control" required noValidate/>
                    </div>

                    <div className="form-submit">
                        <button className="btn btn-info" onClick={this.handleSubmit} noValidate>Envoyer !</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    };
};

export default Signup;