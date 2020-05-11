import React from "react";
import { Button, Form } from "semantic-ui-react";

export default class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.handle_login = this.handle_login.bind(this);
	}

	handle_login() {
		try {
			if (document.getElementById("auth__input--username").value.length === 0) throw "Please enter an username !";
			if (document.getElementById("auth__input--username").value.length === 0) throw "Please enter a password !";

			fetch("/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: document.getElementById("auth__input--username").value,
					password: document.getElementById("auth__input--password").value,
				}),
			})
				.then((res) => res.json())
				.then((res) => {
                    if(!res.success) { this.props.err({ msg: res.reason, err: true }); }
                    else this.props.sucess({ operation: "login", sucess: "true" });
				})
				.catch((e) => {
					throw e;
				});
		} catch (e) {
			this.props.err({ msg: e, err: true });
		}
	}

	render() {
		return (
			<Form className='auth__data'>
				<Form.Field>
					<label className='light__text'>Username</label>
					<input placeholder='Username' id='auth__input--username' />
				</Form.Field>
				<Form.Field>
					<label className='light__text'>Last Name</label>
					<input placeholder='Password' type='password' id='auth__input--password' />
				</Form.Field>
				<Form.Field>
					<label className='light__text'>
						If you forgot you'r password click{" "}
						<a href='/auth/forgot-password' className='url--auth' target='blank'>
							here
						</a>
					</label>
				</Form.Field>
				<Form.Field>
					<label className='light__text'>
						If you want to register please click{" "}
						<a href='/auth/register' className='url--auth'>
							here
						</a>{" "}
					</label>
				</Form.Field>
				<Button className='submit__button' type='submit' primary onClick={this.handle_login}>
					Submit
				</Button>
			</Form>
		);
	}
}
