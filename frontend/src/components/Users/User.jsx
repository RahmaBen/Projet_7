import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import img from '../../images/icon.png';
import AuthApi from '../AuthApi';
import Cookies from 'js-cookie';

function User ()  {
    //  Déclarer les variables d'état, passer l’état initial au Hook useState()
    // stocker l’objet qui a été retourné par l’API
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState([]);
    const [articles, setArticle] = useState([]);
     // le hook useHistory 
    const history = useHistory();

      // recuperer userId et le token depuis le localstorge
    const storage = JSON.parse(localStorage.getItem('userConnect'));
    const userId = storage.userId;
    let token = "Bearer " +  storage.token;

     // exécution d’un effet et déclencher le fetch
    useEffect(() => {
         // appeler notre API pour afficher le profil correspondant
      fetch("http://localhost:3001/api/users/" + userId,
        {headers: 
            {"Authorization" : token}
        })
         // si tout est bon 
        .then(res => res.json())
        .then(
            (result) => {
                 // modifier l’état initial de isLoaded grace a setIsLoaded
                setIsLoaded(true);
                 // modifier l’état initial de User grace a setUser
                setUser(result);
                // ajouter userAccount au localStorage
                localStorage.setItem('userAccount', JSON.stringify(result));
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
        //  N’exécute l’effet que si userId ou token change
    }, [userId, token])

     // exécution d’un effet et déclencher le fetch
    useEffect(() => {
         // appeler notre API pour afficher les articles de user
        fetch("http://localhost:3001/api/users/" + userId + "/articles/" ,
            {headers: 
                {"Authorization" : token},
            })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setArticle(result.data);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [userId, token])

    // accéder au AuthApi context
    const Auth = React.useContext(AuthApi);
        // se deconnecter
    const handleOnclick = () => {
        Auth.setAuth(false);
        Cookies.remove("user");
        localStorage.clear();
    }

    // afficher les bouttons Modifier et supprimer en fonction de userid 
    let idUser;
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else if (user._id === userId || user.admin === true) {
        idUser = <div className="user-button">
            <button className="btn btn-outline-info btn-sm" onClick={() => {history.push("/userupdate/" + userId)}}>Modifier</button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => {history.push("/userdelete/" + userId)}}>Supprimer</button>
            <button className="btn btn-outline-dark btn-sm" onClick={handleOnclick}>Déconnecter</button>  
        </div>
    }

    return (
        <React.Fragment>
            <div className="container">
                <h1>Bienvenue {user.name} !</h1>
                {storage.admin === true ?
                <p>Compte Administrateur</p> : <></>}
                <div className="user-page">
                    <div className="images">
                    {user.imageUrl ?
                    <img
                        src={"http://localhost:3001" + user.imageUrl}
                        alt="user"
                        key={"userImage" + user._id}
                    /> : 
                    <img
                        src={img}
                        alt="user"
                        key={"userImage" + user._id}
                    />
                    }
                        <button className="btn btn-outline-info btn-sm" onClick={() => {history.push("/imageupdate/" + userId)}}>Modifier</button>
                    </div>
                    <div className= "show-article">
                        <h2>{user.name} {user.lastName}</h2>
                        <p>{user.bio}</p>
                    </div>
                    {idUser}
                </div>
                <div className="user-article">
                    <h2>Vos posts</h2>
                  
                    {articles.map((article) => (
                          <Link to={"/article/" + article._id} key={"article" + article._id}>
                        <div className="user-articles" key={"user" + article._id}>
                    
                            <p key={"articlep" + article._id}>{article.content}</p>
                            <h3 key={"date" + article._id}>Publié le <Moment key={"date" + article._id} format="DD MMM YYYY" date={article.createdAt} /></h3>
                        </div>
                        </Link>
                    ))}
                    
                </div>
            </div>
        </React.Fragment>
    );
};

export default User;

