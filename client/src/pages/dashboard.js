import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../authorization/actions";
import axios from "axios";
import _ from "lodash";
import PropTester from "../filter/prop";
import Loading from "../components/loading";


class Dashboard extends Component{
	
	constructor() {
        super();
        this.state = {
			loading: true,
			currentPage: 1,
			postsPerPage: 5,
			posts: [],
			filteredPosts: [],
			categories: ["Teacher Seeking Pupil", "Pupil Seeking Teacher"],
			authors: [],
			cities: []
        };
		
		this.handleFilter = this.handleFilter.bind(this);
    }
	
	componentDidMount(){
		axios.get(`api/posts/`).then(res => {
			this.setState({
				loading: false,
				posts: res.data.posts.reverse().map(post => ({ title: (post.title), id: (post._id), category: (post.category), city: (post.city), author: (post.author), body: (post.body), date: (post.date) }) ),
				filteredPosts: res.data.posts.map(post => ({ title: (post.title), id: (post._id), category: (post.category), city: (post.city), author: (post.author), body: (post.body), date: (post.date) }) ),
				authors: res.data.posts.map((post) => post.author).sort().filter(function(value, index, array){
					return (index === 0) || (value !== array[index-1]);
				}),
				cities: res.data.posts.map((post) => post.city).sort().filter(function(value, index, array){
					return (index === 0) || (value !== array[index-1]);
				})
            });
			console.log(res.data.posts);
		});
    }
	
	handleFilter(event) {
      const inputValue = event.currentTarget.value.toString().toLowerCase();
      const newFilteredPosts = this.state.posts.filter(item => {
		  const itemNameLowerCase = item.title.toLowerCase();
		  return itemNameLowerCase.includes(inputValue);
      });
      
      if (newFilteredPosts.length === 0) {
        newFilteredPosts.push({id: 0, title: ''});
      }
      
      this.setState({filteredPosts: newFilteredPosts });
    }
	
	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
	};
	
	render(){
		const { user } = this.props.auth;
		const yesAdmin = this.props.auth.user.role == "admin";
		const {loading, posts, currentPage, postsPerPage, filteredPosts, authors, categories, cities} = this.state;
		
		return(
			<div className="App">
				
				<div className="welcome">
					<h1>Hello, {user.username}</h1>
					<h2>Welcome to Teach Meet</h2>
					
					<button className="btn btn-primary"><Link to={`/account/${user.username}`}>Your Profile</Link></button>
					<button className="btn btn-primary"><Link to="/newPost">Make new post</Link></button>
					
					{yesAdmin ? 
						 (<button className="btn btn-primary"><Link to={`/profile`}>Go to admin board</Link></button>) 
						 : 
						 (null)
					}
				</div>
				<hr/>
				
				
				<div className="dashboard-container">
                    <h1 style={{textAlign:"center"}}>Job Posts</h1>
					
					<div>
					{loading ?
						(<Loading />)
						:
						(<div>
						
						<div className="searchbar">
							<h3>Search</h3>
							<input 
								type="text" 
								placeholder="Filter" 
								onInput={this.handleFilter} 
							/>
						</div>
						
						<PropTester 
						posts={filteredPosts} 
						categories={categories} 
						authors={authors}
						cities={cities}
						/>
						
						</div>)
					}
					</div>
                </div>
				
			</div>
		)
	}
}

Dashboard.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(Dashboard);

