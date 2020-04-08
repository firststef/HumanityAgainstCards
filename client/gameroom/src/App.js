import React from 'react';
import './styles/App.css';
import './styles/game.css'
import { Segment } from 'semantic-ui-react'
import Table from "semantic-ui-react/dist/commonjs/collections/Table";
import Card from "./Card";

function App() {
  return (
    <div className="App">
      <div id="player-screen">
        <Card id="black_card" text="testcarte" />
        <div id="players_cards" className="rectangle">
          <Segment className="card"></Segment>
          <Segment className="card"></Segment>
          <Segment className="card"></Segment>
          <Segment className="card"></Segment>
        </div>
        <Table className="score-board-table" celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Nume
              </Table.HeaderCell>
              <Table.HeaderCell>
                Punctaj
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Dorin
              </Table.Cell>
              <Table.Cell>
                100p
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
      <div id="player-hand" className="rectangle">
        <Segment className="card"></Segment>
        <Segment className="card"></Segment>
        <Segment className="card"></Segment>
        <Segment className="card"></Segment>
      </div>

    </div>
  );
}

export default App;
