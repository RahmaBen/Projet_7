import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import Comments from "../Comments/Comments";
import Badge from 'react-bootstrap/Badge'
import img from '../../images/icon.png';
import {FaRegThumbsUp  } from 'react-icons/fa';

// match: c'est une propriete injecté par react router
function ArticlePage ({ match }) {
    //  Déclarer les variables d'état, passer l’état initial au Hook useState()
    // stocker l’objet qui a été retourné par l’API
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [article, setArticle] = useState([]);
    const [likes, setLikes] = useState([]);
    const [users, setUsers] = useState([]);
      // le hook useHistory 
    const history = useHistory();

     // recuperer userId et le token depuis le localstorge
    const storage = JSON.parse(localStorage.getItem('userConnect'));
    let token = "Bearer " +  storage.token;
    let userId = storage.userId;
    
    let articleId = match.params.id;

     // exécution d’un effet et déclencher le fetch
    useEffect(() => {
         // appeler notre API pour afficher l'article correspondant
      fetch("http://localhost:3001/api/articles/" + articleId, 
        {headers: 
            {"Authorization" : token}
        })
        // si tout est bon 
        .then(res => res.json())
        .then(
            (result) => {
                // modifier l’état initial de isLoaded grace a setIsLoaded
                setIsLoaded(true);
                // modifier l’état initial de Article et afficher articlePage depuis le localStorge
                setArticle(result);
                localStorage.setItem('articlePage', JSON.stringify(result));
            },
             // en cas d'erreur
            (error) => {
                 // modifier l’état initial de isLoaded grace a setIsLoaded
                setIsLoaded(true);
                // modifier l’état initial de error et afficher l'erreur
                setError(error);
            }
        )
         //  N’exécute l’effet que si articleId ou token change
    }, [articleId, token])

     // exécution d’un effet 
    useEffect(() => {
          // appeler notre API pour recuperer les users
        fetch("http://localhost:3001/api/users/", 
            {headers: 
                {"Authorization" : token}
            })
            // si tout est bon
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

        // exécution d’un effet 
    useEffect(() => {
         // appeler notre API pour liker les articles
        fetch("http://localhost:3001/api/articles/" + articleId + "/likes/" ,
            {headers: 
                {"Authorization" : token},
            })
            .then(res => res.json())
            .then(
                (result) => {
                     // modifier l’état initial de isLoaded grace a setIsLoaded
                    setIsLoaded(true);
                     // modifier l’état initial de likes grace a setLikes
                    setLikes(result.data.length);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
             //  N’exécute l’effet que si articleId et token ont changé
        }, [articleId, token])


    function LikeSubmit () {
      // faire la POST request avec fetch
        fetch('http://localhost:3001/api/likes/', {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                articleId: articleId,
                userId: userId,
                like: 1
            })
        })
        .then(res => res.json())
        .then(
            (result) => {
                setLikes(result.like)
                setIsLoaded(true);
        }, (error) => {
            if(error) {
                setError(error);
            }
        })
    }    

    let userAuth;
    // en cas d'erreur
    if (error) {
        return <div>Erreur : {error.message}</div>;
        // en cas de chargement
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
        // en cas de propirietaire du l'post
    } else if (article.userId === storage.userId) {
        userAuth = <div className="article-button">
            {/* afficher un boutton qui permet de Modifier le post  */}
            <button className="btn btn-outline-info btn-sm" onClick={() => {history.push("/articleupdate/" + articleId)}}>Modifier</button>
            {/* afficher un boutton qui permet de supprimer du post  */}
            <button className="btn btn-outline-danger btn-sm" onClick={() => {history.push("/articledelete/" + articleId)}}>Supprimer</button>
        </div>
        // en cas d'admin
    } else if (storage.admin === true){
        userAuth = <div className="article-button">
            {/* afficher un boutton qui permet de supprimer du post  */}
            <button className="btn btn-outline-danger btn-sm" onClick={() => {history.push("/articledelete/" + articleId)}}>Supprimer</button>
        </div>
    }

    return (
        // afficher le post/article
        <React.Fragment>
            <div className="container">
              
                <div className="article-present">
                    {/* mapper sur le tableau de users et recuperer la photo de profil de celui qui a crée le post    */}
                    {users.map((user) => {
                        if (user._id === article.userId && user.imageUrl) {
                        return <img src={"http://localhost:3001" + user.imageUrl} alt="user" key={"userImage" + article._id} />
                        } else if (user._id === article.userId && !user.imageUrl) {
                            return <img src={img} alt="user" key={"userImage" + article._id} />
                        } else {
                            return null
                        }
                    })}
                    <div className="article-content">
                    {/* mapper sur le tableau de users et recuperer le contenu du post*/}
                        {users.map((user) =>
                            {
                            if(article.userId === user._id){
                            return <h2 key={"h2" +user._id}>Publié par <Link to={"/users/" + user._id} key={user._id + article._id} className="nav-link">{user.name} {user.lastName}</Link></h2>
                            } else {
                                return null
                            }
                        })}

                        <p><Moment fromNow key={"date" + article._id}>{article.createdAt}</Moment></p>

                        <div className="article-page">
                            <div className= "show-article">
                                <p>{article.content}</p>
                            </div>
                            {/* recuperer les bouttons necessaires */}
                            {userAuth}
                            
                        </div>

                        { article.imageUrl !== null &&  article.imageUrl !== "" && article.imageUrl !== "None" &&
                                    <div className= "show-article2" key={"show" + article._id} >
                                        <img src={"http://localhost:3001" + article.imageUrl} alt="articleImg" key={"aticleImage" + article._id} />
                                    </div>
                                }  

                        {/* boutton like */}
                        <div className="likes">
                        <button onClick={LikeSubmit}>
                            <Badge  pill variant="danger">
                                <FaRegThumbsUp/> {likes}
                            </Badge>
                        </button>
                        </div>
                    </div>
                </div>
                {/* recuperer le component comments */}
                <Comments />
            </div>
        </React.Fragment>
    );
};

export default ArticlePage;