import React from "react";
import { Segment, Message } from "semantic-ui-react";

import Background from "./Comps/background";

import Login from "./Comps/login";
import Register from "./Comps/register"

import Logo from "../../Props/logo.png";

export default class Auth extends React.Component {
	state = {
		auth_status: {
			ok: true,
			msg: "",
		},
	};

	constructor() {
		super();
		this.sucess = this.sucess.bind(this);
		this.err = this.err.bind(this);
	}

	sucess(obj) {
		//operation: "login", sucess: "true"
		switch (obj.operation) {
			case "login":
				//at this poitn the cookie problem shpuld be fixed so we can proceed to the next component !
				alert("You have beeen authentificated !");
                break;
            case "register":
                this.setState({
                    auth_status: {
                        ok: obj.err ? false : true,
                        msg: "You have been sucessfully registered ! Please check you'r email for the confirmation link !",
                    },
                });
                break;
			default:
				break;
		}
	}

	err(obj) {
		this.setState({
			auth_status: {
				ok: obj.err ? false : true,
				msg: obj.msg,
			},
		});
	}

	render() {
		return (
			<div className='auth__form'>
				<Background />
				<Segment className='form__segment'>
					<img src={Logo} className='auth__logo' alt='logo' />
					{this.state.auth_status.msg.length > 0 ? (
						<Message negative={!this.state.auth_status.ok} warning={this.state.auth_status.ok}>
							{!this.state.auth_status.ok ? <Message.Header>We're sorry there has been an error</Message.Header> : null }
							<p>{this.state.auth_status.msg}</p>
						</Message>
					) : null}
					{ window.location.pathname === "/auth/login" ? <Login err={this.err} sucess={this.sucess} /> : null} {/**Lazy Router */}
                    { window.location.pathname === "/auth/register" ? <Register err={this.err} sucess={this.sucess} /> : null}
				</Segment>
			</div>
		);
	}
}
