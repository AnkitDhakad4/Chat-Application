
import authStore from '../store/userAuth.store.js';
function Login() {
    const {user,isLogin,login}=authStore();
    console.log("User is :- ",user);
    console.log("Is loading :- ",isLogin);

  return (

    <div>Login
        <button className='btn btn-primary' onClick={login}>Dabao na</button>
    </div>
  )
}

export default Login