// Filteres Apps
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { ThreeHorseLoading } from 'react-loadingg';
import { Container, Card, Text, Logo, Tags } from './styles';

import Header from '../header/Header';
import Footer from '../footer/Footer';

import api from '../../services/api';

import topicsData from '../../assets/topics/topics.json';

export default class FilteredApp extends Component {
  state = {
    data: [],
    tags: [],
    apps: [],
    tag: [],
    match: '',
    loading: false,
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.loadData();
    }
  }

  loadData = async () => {
    this.setState({ loading: true });

    const { match } = this.props;
    this.setState({ match: match.params.title });
    const title = decodeURIComponent(match.params.title);
    const response = await api.get('/sources/');
    const tagsApi = await api.get('/tags/');
    const apps = [];
    this.setState({
      data: response.data.map((a) => a),
      tags: tagsApi.data,
    });

    this.setState({ tag: topicsData.data.find((a) => a.title === title) });

    if (this.state.data.map((a) => a.tags.includes(this.state.tag.id))) {
      apps.push(this.state.data.map((a) => a.tags.includes(this.state.tag.id)));
    }
    let tagApps = [];
    for (let i = 0; i < this.state.data.length; i++) {
      if (apps[0][i] === true) {
        tagApps.push(this.state.data[i]);
        this.setState({ tags: tagApps });
      }
    }

    this.setState({ apps, loading: false });
  };

  removeVirgula = (desc) => {
    if (
      desc.substr(-1, 1) === ',' ||
      desc.substr(-1, 1) === '.' ||
      desc.substr(-1, 1) === ' '
    ) {
      return desc.slice(0, desc.indexOf(' ', 80));
    }
    return desc;
  };

  render() {
    if (this.state.loading === false && this.state.data.length !== 0) {
      const { tags } = this.state;
      return (
        <div className="container">
          <Header />

          <Container>
            <Logo>
              <img
                className="logo-app"
                src={require(`../../assets/topics/${this.state.tag.title}.svg`)}
                alt={this.state.tag.title}
              />
            </Logo>

            <div className="line"></div>
            <h1>{this.state.tag.name.toUpperCase()}</h1>

            <Tags>
              {topicsData.data.map((topic) => (
                <Link
                  key={topic.title}
                  to={`/topics/${encodeURIComponent(topic.title)}`}
                >
                  <img
                    src={require(`../../assets/topics/${topic.title}.svg`)}
                    alt={topic.name}
                  />
                </Link>
              ))}
            </Tags>

            <div className="cards">
              {tags.map((tag) => (
                <Link key={tag.title} to={`/App/${tag.title}`}>
                  <Card>
                    <div className="logo-app">
                      <img src={tag.image} alt={tag.title} />
                    </div>
                    <Text>
                      <span>{tag.title}</span>
                      <p>
                        {this.removeVirgula(
                          tag.description.slice(
                            0,
                            tag.description.indexOf(' ', 70)
                          )
                        )}
                        ...
                      </p>
                    </Text>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
          <Footer />
        </div>
      );
    } else {
      return <ThreeHorseLoading />;
    }
  }
}
