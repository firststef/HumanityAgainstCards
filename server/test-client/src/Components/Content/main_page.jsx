import React from "react";

export default class App extends React.Component {
	componentDidMount() {
		//Check auth state !
		fetch("/check_auth", {
			method: "POST",
        }).then(res=>res.json())
        .then(res=>{
            alert('Sucess auth check !');
            console.log(res);
        }).catch(e=>{
            alert('You are not logged in !');
            window.location.pathname = "/auth/login"
        })
	}

	render() {
		return <div>Hello sir, you have been authentificated !</div>;
	}
}
