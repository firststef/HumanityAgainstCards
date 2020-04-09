import React from "react";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";

export default class Card extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            text: props.text
        }
    }

    render(){
        return (
            <Segment>
                {this.state.text}
            </Segment>
        );
    }
}