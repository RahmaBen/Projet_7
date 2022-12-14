//imports React
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

//imports composants
import AuthApi from './AuthApi';
import Home from './Home';
import Signup from './Auth/Signup';
import Login from './Auth/Login';
import User from './Users/User';
import UsersPage from './Users/UsersPage';
import UpdateAccount from './Users/UpdateAccount';
import DeleteAccount from './Users/DeleteAccount';
import DeleteUserAccount from './Users/DeleteUserAccount';
import Articles from './Articles/Articles';
import ArticlePage from './Articles/ArticlePage';
import CreateArticle from './Articles/CreateArticle';
import UpdateArticle from './Articles/UpdateArticle';
import DeleteArticle from './Articles/DeleteArticle';
import DeleteComment from './Comments/DeleteComment';
import ImageUpdate from './Images/ImageUpdate';

const Routes = () => {
    
    const Auth = React.useContext(AuthApi)

    return (
        <Switch>
            <ProtectedLogin path="/" exact component={Home} />
            <ProtectedLogin path="/signup" component={Signup} />
            <ProtectedLogin path="/login" auth={Auth.auth} component={Login}  />
            <ProtectedRoute path="/articles" auth={Auth.auth} component={Articles} />
            <ProtectedRoute path="/user/:id" auth={Auth.auth} component={User} />
            <ProtectedRoute path="/userdelete/:id" auth={Auth.auth} component={DeleteAccount} />
            <Route path="/userupdate/:id" auth={Auth.auth} component={UpdateAccount} />
            <Route path="/users/:id" auth={Auth.auth} component={UsersPage} />
            <Route path="/createarticle" auth={Auth.auth} component={CreateArticle} />
            <Route path="/article/:id" auth={Auth.auth} component={ArticlePage} />
            <Route path="/articleupdate/:id" auth={Auth.auth} component={UpdateArticle} />
            <Route path="/articledelete/:id" auth={Auth.auth} component={DeleteArticle} />
            <Route path="/deletecomment/:id" auth={Auth.auth} component={DeleteComment} />
            <Route path="/imageupdate/:id" auth={Auth.auth} component={ImageUpdate} />
            <Route path="/adminuserdelete/:id" auth={Auth.auth} component={DeleteUserAccount} />
        </Switch>
    )
}

const ProtectedLogin = ({auth, component: Component, ...rest}) => {
    return(
        <Route 
        {...rest}
        render = {() => !auth? (
            <>
                <Component />
            </>
        ) :
            (
                <Redirect to="/articles" />
            )
            }
        />
    )
}

const ProtectedRoute = ({auth, component: Component, ...rest}) => {
    return(
        <Route 
        {...rest}
        render = {() => auth? (
            <>
                <Component />
            </>
        ) :
            (
                <Redirect to="/login" />
            )
            }
        />
    )
}

export default Routes;

