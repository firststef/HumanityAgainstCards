import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import "semantic-ui-css/semantic.min.css";
import "./Styles/css/index.css";

//Components
import Auth from "./Components/Auth/main";
import Contetnt from "./Components/Content/main_page"

class App extends React.Component {
	render() {
		return (
			<div className='main'>
				{ window.location.pathname.match("/auth") ? <Auth /> : <Contetnt /> }
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
