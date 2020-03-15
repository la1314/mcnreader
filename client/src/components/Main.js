import React, { Component } from 'react';

export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
        this.state = { postResponse: "" };
    }

    callAPI() {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            //body: JSON.stringify({ title: 'React POST Request Example' })
        };

        fetch("/api/obras")
            .then(res => res.text())
            .then(res => this.setState({ postResponse: res }));
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <div>
                <header className="App-header">
                    <p className="App-intro">{this.state.postResponse}</p>

                </header>
            </div>
        );
    }
}
