import React from 'react';
import axios from 'axios';
import { Table, Form, FormControl, ControlLabel, Button, Glyphicon, Col, Image } from 'react-bootstrap';
import './App.css';

var BASE_URL = 'http://api.maardan.com';
var interval_id = '';
var count = 1;

var Datagrid = React.createClass(
{
	getInitialState: function() 
	{ 
		return { 
			nforiginals: [], 
			titles: [],
			years: [], 
			ratings: [], 
			genres: [],     
			search_phrase: '',
			focused_category: '',
			sort_ascending: true,
			showable_indexes: [],
			spin: 0
		};
	},

	componentWillMount: function() 
	{ 
		let _this = this;
		let temp_ids = [];
		let temp_titles = [];
		let temp_years = [];
		let temp_ratings = [];
		let temp_genres = [];

		const interval_id_1 = setInterval(function(){_this.spinLogo()}, 1000);	

		axios.get(BASE_URL + '/api/v1/nforiginals.json')
		.then(function (response) 
		{ 
			response.data.map((obj, i) =>
			{
				// store columns
				temp_ids.push(obj.id);
				temp_titles.push({ id: obj.id, content: obj.title });
				temp_years.push({ id: obj.id, content: obj.year });
				temp_ratings.push({ id: obj.id, content: obj.rating });
				temp_genres.push({ id: obj.id, content: obj.genre });
			});

			_this.setState(
			{ 
				nforiginals: response.data,
				titles: temp_titles,
				years: temp_years,
				ratings: temp_ratings,
				genres: temp_genres,
				showable_indexes: temp_ids
			},
			function()
			{
				clearInterval(interval_id_1);
				interval_id = setInterval(function(){_this.spinLogo()}, 60);				
			}); 
		})
		.catch(function (error) 
		{ 
			console.log(error); 
		});
	},

	spinLogo: function()
	{
		this.setState({ spin: (this.state.spin+count) }, function()
		{
			(this.state.spin === 0 && this.state.nforiginals.length > 0) ? clearInterval(interval_id) : '';
			this.state.spin === 0 ? (count = 1) : '';
			this.state.spin === 8 ? (count = -1) : '';
		});
	},

	handleSearch: function(e)
	{
		e.preventDefault()

		this.setState({ search_phrase: e.target.value }, function()
		{
			let i = 0;
			let showable_ids = [];
			let category_array = [];

			// we need to know under which category is being searched
			switch (this.state.focused_category)
			{
				case 'title': 
					category_array = this.state.titles;
					break;
				case 'year': 
					category_array = this.state.years;
					break;
				case 'rating': 
					category_array = this.state.ratings;
					break;
				case 'genre': 
					category_array = this.state.genres;   
					break;                  
			}

			// get index(es) of array, add them to the array of showable indexes
			for (i; i < category_array.length; i++)
			{
				category_array[i].content.toLowerCase().indexOf(this.state.search_phrase) > -1 ? showable_ids.push(category_array[i].id) : '';
			}

			this.setState({ showable_indexes: showable_ids });
		})
	},

	// Sort neds to be API call because getting the new sorted indexes with respect to their original position is most efficient this way
	handleSort: function(category)
	{
		let _this = this;
		let temp_titles = [];
		let temp_years = [];
		let temp_ratings = [];
		let temp_genres = [];

		// each category has it's own unique API call per sort and so a switch 'this.state.sort_ascending ?...' is required to determine if order will be ascending or descending
		axios.get(BASE_URL + '/api/v1/nforiginals/' + category + '/' + (this.state.sort_ascending ? 'ascending' : 'descending') + '.json')
		.then(function (response) 
		{ 
			response.data.map((obj, i) =>
			{
				temp_titles.push({ id: obj.id, content: obj.title });
				temp_years.push({ id: obj.id, content: obj.year });
				temp_ratings.push({ id: obj.id, content: obj.rating });
				temp_genres.push({ id: obj.id, content: obj.genre });
			});
			
			// now we have a sorted list 
			_this.setState(
			{ 
				nforiginals: response.data,
				titles: temp_titles,
				years: temp_years,
				ratings: temp_ratings,
				genres: temp_genres,
				sort_ascending: (_this.state.sort_ascending ? false : true)
			}); 			
		})
		.catch(function (error) 
		{ 
			console.log(error); 
		});			
	},

	// show "allowable" indexes per i in key={i}
	render: function()
	{
		return (
		<div>

			{this.state.nforiginals.length > 0 ?

				<div>
					<div style={{ display: 'inline-flex' }}>
						<div style={{ display: 'inline-flex' }}>
							<h3 className={this.state.spin === 1 ? 'App-logo' : 'red'}>N</h3>
							<h3 className={this.state.spin === 2 ? 'App-logo' : 'red'}>e</h3>
							<h3 className={this.state.spin === 3 ? 'App-logo' : 'red'}>t</h3>
							<h3 className={this.state.spin === 4 ? 'App-logo' : 'red'}>f</h3>
							<h3 className={this.state.spin === 5 ? 'App-logo' : 'red'}>l</h3>
							<h3 className={this.state.spin === 6 ? 'App-logo' : 'red'}>i</h3>
							<h3 className={this.state.spin === 7 ? 'App-logo' : 'red'}>x</h3>
						</div>

						<div style={{ opacity: (1- (this.state.spin * 0.1)), paddingLeft: '10px' }}>
							<h3>Originals</h3>
						</div>
					</div>

					<div style={{ marginRight: '50px', marginLeft: '50px', borderRadius: '10px' }}>
						<Table striped bordered condensed hover responsive>
							<thead>
								<tr>
									<th>
										<Form horizontal>
											<Col componentClass={ControlLabel} md={3}>
												Title
											</Col>
											<Col md={6}>
												<FormControl type='text' bsSize='sm' placeholder='Search by title' onFocus={() => this.setState({ focused_category: 'title' })} onBlur={() => this.setState({ focused_category: '' })} onChange={this.handleSearch} />
											</Col>
											<Col md={3}>
												<Button bsSize="small" onClick={() => this.handleSort('title')}><Glyphicon glyph="sort" /></Button>
											</Col>
										</Form>
									</th>
									<th>
										<Form horizontal>
											<Col componentClass={ControlLabel} md={4}>
												Release Year
											</Col>
											<Col md={6}>
												<FormControl type='number' placeholder='Search by year' onFocus={() => this.setState({ focused_category: 'year' })} onBlur={() => this.setState({ focused_category: '' })} onChange={this.handleSearch} />
											</Col>
											<Col md={2}>
												<Button bsSize="small" onClick={() => this.handleSort('year')}><Glyphicon glyph="sort" /></Button>
											</Col>
										</Form>	
									</th>

									<th>
										<Form horizontal>
											<Col componentClass={ControlLabel} md={3}>
												Rating
											</Col>
											<Col md={6}>
												<FormControl type='text' placeholder='Search by rating' onFocus={() => this.setState({ focused_category: 'rating' })} onBlur={() => this.setState({ focused_category: '' })} onChange={this.handleSearch} />
											</Col>
											<Col md={3}>
												<Button bsSize="small" onClick={() => this.handleSort('rating')}><Glyphicon glyph="sort" /></Button>
											</Col>
										</Form>
									</th>
									<th>
										<Form horizontal>
											<Col componentClass={ControlLabel} md={3}>
												Genre
											</Col>
											<Col md={6}>
												<FormControl type='text' placeholder='Search by genre' onFocus={() => this.setState({ focused_category: 'genre' })} onBlur={() => this.setState({ focused_category: '' })} onChange={this.handleSearch} />
											</Col>
											<Col md={3}>
												<Button bsSize="small" onClick={() => this.handleSort('genre')}><Glyphicon glyph="sort" /></Button>
											</Col>
										</Form>
									</th>
								</tr>
							</thead>

							<tbody>

								{this.state.nforiginals.map((obj, i) => (this.state.showable_indexes.includes(obj.id) ? 
								<tr key={i}>
									<td style={{ textAlign: 'left' }}>{obj.title}</td>
									<td>{obj.year}</td>
									<td>{obj.rating}</td>
									<td>{obj.genre}</td>
								</tr> : ''))}

							</tbody>
						</Table>
					</div>

				</div>
				:
				<div className='netflix_logo'>
					<Image src="/netflix_logo.png" style={{ opacity: (1- (this.state.spin * 0.1)) }} />
				</div>}				
		</div>)
	}
}); 

export default Datagrid;