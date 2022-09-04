import React, { useState, useEffect } from 'react';
import { useHistory, Link} from 'react-router-dom';
import Moment from 'react-moment';
import img from '../../images/icon.png';

const UsersPage = ({match}) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState([]);
    const [articles, setArticle] = useState([]);
    const history = useHistory();

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    const userId = match.params.id;
    let token = "Bearer " +  storage.token;

    useEffect(() => {
      fetch("http://localhost:3001/api/users/" + userId,
        {headers: 
            {"Authorization" : token}
        })
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setUser(result);
                localStorage.setItem('userAccount', JSON.stringify(result));
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [userId, token])

    useEffect(() => {
        fetch("http://localhost:3001/api/users/" + userId + "/articles/" ,
            {headers: 
                {"Authorization" : token},
            })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setArticle(result.data);
                    localStorage.setItem('userArticles', JSON.stringify(result.data));
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [userId, token])

    
    let idUser;
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else if (storage.admin === true) {
        idUser = <div className="user-button">
            <button className="btn btn-outline-danger btn-sm" onClick={() => {history.push("/adminuserdelete/" + userId)}}>Supprimer</button>
        </div>
    }

    return (
        <React.Fragment>
            <div className="container">
            <h1> Profil de {user.name} {user.lastName}</h1>
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
                    </div>
                    
                    {idUser}
                </div>
                <div className="user-article">
                    <h2>Posts publiés par {user.name}</h2>
                    {articles.map((article) => (
                         <Link to={"/article/" + article._id} key={"article" + article._id} >
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

export default UsersPage;