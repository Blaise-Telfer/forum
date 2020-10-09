import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";


class Landing extends Component{
	
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push("/dashboard");
		}
	}
	
	render(){
		return(
			<div className="landing-page">
				<h1>Welcome to Teach Meet</h1>
				<button className="btn btn-primary"><Link to="/login"> Login </Link></button>
				<button className="btn btn-primary"><Link to="/register"> Register </Link></button>
				
				<div class="description">
					<p>A forum for teachers, tutors and students alike!</p>
					<p>Find and hire a new teacher for any subject</p>
					<p>or</p>
					<p>Advertise your skills and land a new teaching gig</p>
				</div>
			</div>
		)
	}
}


Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);