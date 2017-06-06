import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import Navigation from 'components/Navigation';
import Footer from 'components/Footer';
import { Link } from 'react-router';
import Rodal from 'components/Rodal';
import { fetchProposals, fetchSpeakers } from 'actions/proposals';
import { fetchReversimTeam } from 'actions/users';
import { Element, Link as ScrollLink } from 'react-scroll';
import ReactDOM from 'react-dom';
import features from 'features';
import ga from 'react-ga';
import _ from 'lodash';
import homeSections from 'data/home-sections';

import styles from 'css/main';
import homeStyles from 'css/components/home';

const cxHome = classNames.bind(homeStyles);
const cx = classNames.bind(styles)

class Home extends Component {

    static need = [  // eslint-disable-line
        fetchReversimTeam,
        fetchProposals,
        fetchSpeakers
    ];

    constructor(props) {
        super(props);

        this.state = {
          isRegistrationModalOpen: false
        }
    }

    jumpToLocation() {
      const { location: { state, pathname } } = this.props;

      let pageSection = pathname.replace('/', '').trim() || (state && state.section);

      if (pageSection !== undefined && pageSection !== '') {
        let elem = ReactDOM.findDOMNode(this.refs[pageSection])
        if (elem) {
          elem.scrollIntoView();
        }
      }
    }

    startRegistrationModal(event) {
      event.preventDefault();

      ga.modalview('registration');

      this.setState({ isRegistrationModalOpen: true });
    }

    closeRegistrationModal(event) {
      event.preventDefault();

      this.setState({ isRegistrationModalOpen: false });
    }

    renderSection(section) {
      return (<Element name={section.name} ref={section.name} key={section.name}>
        {React.createElement(section.el, { name: section.name, ...section.props })}
      </Element>);
    }

    render() {
        const { reversimTweets } = this.props;
        this.jumpToLocation();

        let leftButton, rightButton;
        if (features('viewSlides', false)) {
          rightButton = <Link to="schedule" className={cx('btn', 'btn-outline')}>SLIDES</Link>;
        } else if (!features('startRegistration', false)) {

        } else {
          rightButton = <ScrollLink to={ features('publishAgenda', false) ? 'schedule' : 'timeline' } className={cx('btn', 'btn-outline')} spy={true} smooth={true} offset={-50} duration={500}>VIEW SCHEDULE</ScrollLink>;
        }

        if (features('viewSlides', false)) {
          leftButton = <a href="#" className={cx('btn')}>VIDEOS (SOON)</a>;
        } else if (features('startRegistration', false)) {
          leftButton = <a href="#" onClick={this.startRegistrationModal.bind(this)} className={cx('btn')}>GET TICKETS</a>;
        } else if (features('publishAgenda', false)) {
          leftButton = <ScrollLink to='register' className={cx('btn')} spy={true} smooth={true} offset={-80} duration={500}>REGISTER</ScrollLink>;;
        } else if (features('submission', false)) {
          leftButton = <Link to="submit" className={cx('btn')}>SUBMIT PROPOSAL</Link>;
        } else if (!features('startRegistration', false)) {

        } else {
          leftButton = <Link to="proposals" className={cx('btn')}>VIEW PROPOSALS</Link>;
        }

        let buttonsMsg;
        if (features('viewSlides', false)) {
          buttonsMsg = 'The summit is over. Thanks to all the participants! See you in Reversim Summit 2017!'
        } else if (features('startRegistration', false)) {
          buttonsMsg = 'Tickets for Reversim Summit 2016 are available!'
        } else if (features('publishAgenda', false)) {
          buttonsMsg = 'Agenda was Published!';
        } else if (!features('startRegistration', false)) {
          buttonsMsg = 'Coming soon!';
        } else {
          buttonsMsg = 'Call for papers is now ' + (features('submission', false) ? 'open!' : 'closed')
        }

        const sectionElements = homeSections(this.props).map(this.renderSection);

        return (
          <div>
              <div className={cx('home')}>
                <Navigation currentPath={this.props.location.pathname} />

                <section id="hero" className={cx('hero-section', 'bg1', 'bg-cover', 'window-height', 'light-text')}>
                  {/*<ul className={cx("socials-nav")}>
                        <li className={cx('socials-nav-item')}><a href="https://twitter.com/reversim"><span className={cx('fa', 'fa-twitter')}></span></a></li>
                        <li className={cx('socials-nav-item')}><a href="https://www.facebook.com/groups/806177629478248/"><span className={cx('fa', 'fa-facebook')}></span></a></li>
                    </ul>*/}
                    <div className={cx('heading-block', 'centered-block', 'align-center')}>
                        <div className={cx('container')}>
                            <h5 className={cx('heading-alt')} style={ {marginBottom: '8px'} }><span className={cx('fa', 'fa-calendar-o', 'base-clr-txt')}></span>15-16.Oct <span className={cx('fa', 'fa-map-marker', 'base-clr-txt')} style={ {marginLeft: '14px'} }></span>College of Management</h5>
                            <h1 className={cx('extra-heading')}>Reversim Summit 2017</h1>
                            <h5 className={cx('base-font')}>
                              {buttonsMsg}
                            </h5>
                            <div className={cx('btns-container')}>
                              {leftButton} {rightButton}
                            </div>
                        </div>
                    </div>
                </section>

                {sectionElements}

                <Footer tweets={reversimTweets} />
              </div>

              <Rodal  visible={this.state.isRegistrationModalOpen}
                      width={700}
                      height={400}
                      onClose={this.closeRegistrationModal.bind(this)}>
                <div style={ {width: '100%', textAlign: 'left'} }>
                  <iframe  src="//eventbrite.com/tickets-external?eid=26992112134&ref=etckt" frameborder="0" height="400" width="100%" vspace="0" hspace="0" marginheight="5" marginwidth="5" scrolling="auto" allowtransparency="true"></iframe>
                </div>
              </Rodal>
          </div>
        );
    }
}

Home.propTypes = {
  user: PropTypes.object,
  proposals: PropTypes.any,
  reversimTweets: PropTypes.array,
  speakers: PropTypes.array,
  acceptedProposals: PropTypes.array
};

function mapStateToProps(state) {
    return {
        user: state.user,
        proposals: !features('submission', false) ? _.chain(state.proposal.proposals).shuffle().take(4).value() : state.proposal.proposals,
        acceptedProposals: features('publishAgenda', false) ? state.proposal.accepted : [],
        reversimTweets: state.tweets.reversim,
        speakers: state.proposal.speakers
    };
}

// Read more about where to place `connect` here:
// https://github.com/rackt/react-redux/issues/75#issuecomment-135436563
export default connect(mapStateToProps)(Home);
