import React from "react";

export default class App extends React.Component {
	render() {
		return (
			<div class='waveWrapper waveAnimation background'>
				<div class='waveWrapperInner bgTop'>
					<div class='wave waveTop' style={{ backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-top.png')" }}></div>
				</div>
				<div class='waveWrapperInner bgMiddle'>
					<div class='wave waveMiddle' style={{ backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-mid.png')" }}></div>
				</div>
				<div class='waveWrapperInner bgBottom'>
					<div class='wave waveBottom' style={{ backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-bot.png')" }}></div>
				</div>
			</div>
		);
	}
}
