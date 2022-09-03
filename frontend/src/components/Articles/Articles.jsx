import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import img from '../../images/icon.png';

function Articles  ()  {
    //  Déclarer les variables d'état, passer l’état initial au Hook useState()
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState([]);
    const [users, setUsers] = useState([]);
    // le hook useHistory 
    const history = useHistory();

     // recuperer l'utilisateur connecté et le token depuis le localstorge
    const storage = JSON.parse(localStorage.getItem('userConnect'));
    let token = "Bearer " + storage.token;

    // exécution d’un effet
    useEffect(() => {
        // appeler notre API pour afficher les articles
      fetch("http://localhost:3001/api/articles", 
        {headers: {"Authorization" : token}})
        // si tout est bon 
        .then(res => res.json())
        .then(
            (result) => {
                // modifier l’état initial de isLoaded grace a setIsLoaded
                setIsLoaded(true);
                  // modifier l’état initial de Articles et afficher les aricles de la base de donnée
                setArticles(result.data);
            },
            // en cas d'erreur
            (error) => {
                // modifier l’état initial de isLoaded grace a setIsLoaded
                setIsLoaded(true);
                // modifier l’état initial de error et afficher l'erreur
                setError(error);
            }
        )
        //  N’exécute l’effet que si token a changé
    }, [token])

    // exécution d’un effet
    useEffect(() => {
        // appeler notre API pour recuperer les users
        fetch("http://localhost:3001/api/users/", 
            {headers: {"Authorization" : token}})
            // si tout est bon rendre la res en json
            .then(res => res.json())
            .then(
                (result) => {
                     // modifier l’état initial de isLoaded grace a setIsLoaded
                    setIsLoaded(true);
                     // modifier l’état initial de Users et recuperer les users de la base de donnée
                    setUsers(result.data);
                },
                 // en cas d'erreur
                (error) => {
                     // modifier l’état initial de isLoaded grace a setIsLoaded
                    setIsLoaded(true);
                      // modifier l’état initial de error et afficher l'erreur
                    setError(error);
                }
            )
             //  N’exécute l’effet que si token a changé
        }, [token]) 

        let AuthAdmin;
        // si le user est l'admin
        if(storage.admin===true){
            // afficher tous les users et l'admin aura la possibilité de voir les profil et les supprimer
            AuthAdmin=<div>
                <p>Liste des utilisateurs:</p>
                { 
                   users.map((user) => {
                    if(user.admin===false){
                        return <button className='btn bnt-outline-info btn-sm' onClick={() => {history.push("/users/"+ user._id)}}>   
                        <h2 key={"h2" + user._id}>
                        {user.name} {user.lastName}
                        </h2>
                    </button>
                    }
                  
                   })
                }
            </div>

        }

    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else {
        return (
            <React.Fragment>   
                <div className="container">
                    <h1>Tous les posts publiés</h1>
                    <div className="form-submit">
                        {/* history.push pour rediriger l'utilisateurs vers createarticle */}
                        <button className="btn btn-outline-info btn-sm" onClick={() => {history.push("/createarticle/")}}>Publier un post</button>
                    </div>
                    {/* crée un nouveau tableau des articles des avec la methode map  */}
                    {articles.map((article) => (

                        <div className="article-card" key={"articleCard" + article._id}>
                            {users.map((user) => {
                                    if (user._id === article.userId && user.imageUrl) {
                                    return <img src={"http://localhost:3001" + user.imageUrl} alt="user" key={"userImage" + article._id} />
                                    } else if (user._id === article.userId && !user.imageUrl) {
                                        return <img src={img} alt="user" key={"userImage" + article._id} />
                                    } else {
                                        return null
                                    }
                            })}
                            <div className= "show-article" key={"show" + article._id}>
                                {users.map((user) => {
                                    if(user._id === article.userId){
                                        return <h2 key={"h2" +user._id}>Publié par <Link to={"/users/" + user._id} key={user._id + article._id}className="nav-link">{user.name} {user.lastName}</Link></h2>
                                    } else {
                                        return null
                                    }
                                })}
                                <p key={article.createdAt} id="created-at"><Moment fromNow key={"date" + article._id}>{article.createdAt}</Moment></p>                       
                                < Link to={"/article/" + article._id} key={"content" + article._id}>{article.content}</Link>
                                
                                < Link to={"/article/" + article._id} key={"content" + article._id}>{ article.imageUrl !== null &&  article.imageUrl !== "" && article.imageUrl !== "None" &&
                                    <div className= "show-article2" key={"show" + article._id} >
                                        <img src={"http://localhost:3001" + article.imageUrl} alt="article image" key={"aticleImage" + article._id} />
                                    </div>
                                }</Link>                                              
                            </div>  
                        </div>
                    ))}
                    
                    <div>
                  {/* recuperer la liste de users */}
                    {AuthAdmin}
                    </div>
                </div>
            </React.Fragment>
        );
    } 
};

export default Articles;
