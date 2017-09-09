import React, {Component} from 'react';
import Section from "./Section";

class Team extends Component {

  render() {
    const {team} = this.props;
    return (
      <Section title="Team">
        {team.map((x, i) => <div key={i}>{x.name}</div>)}
      </Section>
    );
  }

}

export default Team;