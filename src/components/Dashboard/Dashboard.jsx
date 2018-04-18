import React from 'react'
import axios from 'axios'
import { Container, Button, Header, Divider, Segment } from 'semantic-ui-react';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {}
        }
        this.logout = this.logout.bind(this)
    }
    componentDidMount() {
        axios.get('/check').then(resp => {
            this.setState({ user: resp.data })
        })
    }
    logout() {
        console.log('loggin out...')
        axios.get('/logout').then(_ => {
            this.props.history.push('/')
        });
    }
    render() {
        return (
            <div>
                {
                    this.state.user.auth_id ?
                        <Segment className="profile_box" compact={false}>
                            <Header>Welcome, {this.state.user.first_name[0].toUpperCase() + this.state.user.first_name.slice(1)}</Header>
                            <Divider />
                            <div>
                                <img src={this.state.user.img_url} alt={`url: ${this.state.user.img_url}`} height="100" width="100" style={{ borderRadius: "50%" }} />
                            </div>
                            <p>
                                Commodo incididunt cupidatat fugiat eu ad ad do irure cillum reprehenderit adipisicing.
                            </p>
                            <Button primary onClick={this.logout} >Logout</Button>
                        </Segment>
                        :
                        <Container>
                            <div>Unauthorized</div>
                        </Container>
                }
            </div>
        )
    }
}