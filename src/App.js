import {contractETH, contractMATIC} from './contract';
import './App.css';
import React, {Component} from "react";
import {Input, Button, Container, Card, Grid, Header, Icon, Menu, Image} from 'semantic-ui-react';
import namehash from "./namehash";

class App extends Component {
    state = {domain: '', data: [], loading: false};

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading: true});

        const interestedKeys = [
            "ipfs.html.value",
            "crypto.BTC.address",
            "crypto.ETH.address",
            "crypto.ADA.address",
            "crypto.MATIC.version.MATIC.address"
        ];
        const tokenId = namehash(this.state.domain);

        let data = await contractETH.getData(interestedKeys, tokenId);
        if (data['owner'] === "0x0000000000000000000000000000000000000000") {
            data = await contractMATIC.getData(interestedKeys, tokenId);
        }

        this.setState({data: data});
        this.setState({loading: false});
    };

    showResults() {
        if (this.state.data.length > 0) {
            let items = [];

            if (this.state.data['owner'] === "0x0000000000000000000000000000000000000000") {
                const item = {};
                item.header = 'Not Available!';
                item.description = 'Not found!';

                items.push(item);
            } else {
                if (this.state.data[2][0] !== "") {
                    const item = {};
                    item.header = 'Website';
                    item.description = 'https://dweb.link/ipfs/' + this.state.data[2][0];
                    item.href = 'https://dweb.link/ipfs/' + this.state.data[2][0];

                    items.push(item);
                }

                if (this.state.data['owner'] !== "0x0000000000000000000000000000000000000000") {
                    const item = {};
                    item.header = 'Owner';
                    item.description = this.state.data['owner'];

                    items.push(item);
                }

                if (this.state.data['resolver'] !== "0x0000000000000000000000000000000000000000") {
                    const item = {};
                    item.header = 'Resolver';
                    item.description = this.state.data['resolver'];

                    items.push(item);
                }

                if (this.state.data[2][1] !== "") {
                    const item = {};
                    item.header = 'BTC Address';
                    item.description = this.state.data[2][1];

                    items.push(item);
                }

                if (this.state.data[2][2] !== "") {
                    const item = {};
                    item.header = 'ETH Address';
                    item.description = this.state.data[2][2];

                    items.push(item);
                }

                if (this.state.data[2][3] !== "") {
                    const item = {};
                    item.header = 'ADA Address';
                    item.description = this.state.data[2][3];

                    items.push(item);
                }

                if (this.state.data[2][4] !== "") {
                    const item = {};
                    item.header = 'MATIC Address';
                    item.description = this.state.data[2][4];

                    items.push(item);
                }
            }

            return (
                <Card.Content>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <Card centered>
                                    <Image src={'https://metadata.unstoppabledomains.com/image-src/' + this.state.domain + '.svg'}
                                           wrapped ui={false}/>
                                    <Card.Content>
                                        <Card.Header>{this.state.domain}</Card.Header>
                                        <Card.Meta className='cardAddress'>
                                            <Card.Meta>{this.state.data['owner']}</Card.Meta>
                                        </Card.Meta>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <a href={'https://opensea.io/assets?search[query]=' + this.state.domain}
                                           target='_blank'><Icon name='linkify'/>View OpenSea</a>
                                    </Card.Content>
                                </Card>
                                <Card.Group centered itemsPerRow={1} items={items}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            );
        }
    }

    render() {
        return (
            <div className='App'>
                <Container>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>
                                            <Menu>
                                                <Menu.Item
                                                    href='https://kesarawimal.github.io/unstoppable-domains-resolver'>
                                                    <Header as='h2'>
                                                        <Icon name='cogs'/>
                                                        <Header.Content>
                                                            Unstoppable Domains Resolver
                                                            <Header.Subheader>Resolve any NFT domain to view wrapped
                                                                content</Header.Subheader>
                                                        </Header.Content>
                                                    </Header>
                                                </Menu.Item>

                                                <Menu.Menu position='right'>
                                                    <Menu.Item
                                                        href='https://github.com/kesarawimal/unstoppable-domains-resolver'>
                                                        <Button secondary icon='github' content='Repository'/>
                                                    </Menu.Item>
                                                </Menu.Menu>
                                            </Menu>

                                        </Card.Header>
                                    </Card.Content>
                                    <Card.Content>
                                        <Grid centered>
                                            <Grid.Row>
                                                <form onSubmit={this.onSubmit}>
                                                    <Input size='huge' type='text' placeholder='Search for NFT domains'
                                                           action>
                                                        <input
                                                            onChange={event => this.setState({domain: event.target.value})}/>
                                                        <Button loading={this.state.loading} size='big' secondary
                                                                type='submit'>Resolve</Button>
                                                    </Input>
                                                </form>
                                            </Grid.Row>
                                        </Grid>
                                    </Card.Content>
                                    {this.showResults()}
                                </Card>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default App;
