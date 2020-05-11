import React from "react";
import { Button, Form } from "semantic-ui-react";

export default class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.handle_register = this.handle_register.bind(this);
	}

	handle_register() {
		try {
			if (document.getElementById("auth__input--username").value.length === 0) throw "Please enter an username !";
            if (document.getElementById("auth__input--username").value.length === 0) throw "Please enter a password !";
            if (document.getElementById("auth__input--email").value.length === 0) throw "Please enter an email !";
            if (document.getElementById("auth__input--nickname").value.length === 0) throw "Please enter a nickname !";

			fetch("/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username :   document.getElementById("auth__input--username").value,
                    password :   document.getElementById("auth__input--password").value,
                    email    :   document.getElementById("auth__input--email").value,
                    nickname :   document.getElementById("auth__input--nickname").value
				}),
			})
				.then((res) => res.json())
				.then((res) => {
                    if(!res.success) { this.props.err({ msg: res.reason, err: true }); }
                    else this.props.sucess({ operation: "register", sucess: "true" });
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
					<label className='light__text'>Password</label>
					<input placeholder='Password' type='password' id='auth__input--password' />
				</Form.Field>
                <Form.Field>
					<label className='light__text'>Email</label>
					<input placeholder='Email' id='auth__input--email' />
				</Form.Field>
                <Form.Field>
					<label className='light__text'>Nickname</label>
					<input placeholder='Nickname' id='auth__input--nickname' />
				</Form.Field>
				<Form.Field>
					<label className='light__text'>
						If you are allready registered please click{" "}
						<a href='/auth/login' className='url--auth' target='blank'>
							here
						</a>{" "}
					</label>
				</Form.Field>
				<Button className='submit__button' type='submit' primary onClick={this.handle_register}>
					Submit
				</Button>
			</Form>
		);
	}
}
