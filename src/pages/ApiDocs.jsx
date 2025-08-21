import React from 'react';
import { RedocStandalone } from 'redoc';
import swaggerData from '../data/swaggerData.json'
import integrations from '../data/integrations.json'
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
	background-color: white;
	position: relative;
`;

const ApiDocsComponent = () => {
	// Sample OpenAPI Swagger file
	// const swaggerData = {
	// 	openapi: '3.0.0',
	// 	info: {
	// 		title: 'Sample API',
	// 		version: '1.0.0',
	// 		description: 'This is a sample API for demonstrating the API documentation component.'
	// 	},
	// 	paths: {
	// 		'/users': {
	// 			get: {
	// 				summary: 'List users',
	// 				responses: {
	// 					'200': {
	// 						description: 'Successful response',
	// 						content: {
	// 							'application/json': {
	// 								schema: {
	// 									type: 'array',
	// 									items: {
	// 										type: 'object',
	// 										properties: {
	// 											id: {
	// 												type: 'integer'
	// 											},
	// 											name: {
	// 												type: 'string'
	// 											},
	// 											email: {
	// 												type: 'string'
	// 											}
	// 										}
	// 									}
	// 								}
	// 							}
	// 						}
	// 					}
	// 				}
	// 			},
	// 			post: {
	// 				summary: 'Create a user',
	// 				requestBody: {
	// 					content: {
	// 						'application/json': {
	// 							schema: {
	// 								type: 'object',
	// 								properties: {
	// 									name: {
	// 										type: 'string'
	// 									},
	// 									email: {
	// 										type: 'string'
	// 									}
	// 								}
	// 							}
	// 						}
	// 					}
	// 				},
	// 				responses: {
	// 					'201': {
	// 						description: 'Successful response',
	// 						content: {
	// 							'application/json': {
	// 								schema: {
	// 									type: 'object',
	// 									properties: {
	// 										id: {
	// 											type: 'integer'
	// 										},
	// 										name: {
	// 											type: 'string'
	// 										},
	// 										email: {
	// 											type: 'string'
	// 										}
	// 									}
	// 								}
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// };

	return (
		<Container>
			<div className="z-10 fixed top-5 right-5 p-2 flex items-center justify-center rounded-full bg-[#04051B]">
				<Link to="/home" className="text-primaryColor ">
					<i className="fas fa-home h2 m-0" />
				</Link>
			</div>
			<RedocStandalone
				spec={integrations}
				options={{
					hideDownloadButton: true, // hide the download button
					theme: {
						spacing: {
							unit: 5,
							sectionHorizontal: 40,
							sectionVertical: 40,
						},
						typography: {
							fontSize: '1rem',
							lineHeight: '1.6em',
							fontWeightRegular: '400',
							fontWeightBold: '600',
							fontWeightLight: '300',
							fontFamily: 'Roboto, sans-serif',
							smoothing: 'antialiased',
							optimizeSpeed: true,
							headings: {
								fontFamily: 'Montserrat, sans-serif',
								fontWeight: '400',
								lineHeight: '1.6em',
							}
						},
						sidebar: {
							width: '300px',
							backgroundColor: '#04051B',
							textColor: '#cccccc',
							activeTextColor: '#00CC99',
							groupItems: {
								activeBackgroundColor: '#04051B',
								activeTextColor: '#00CC99',
								textTransform: 'uppercase',
							},
							level1Items: {
								activeBackgroundColor: '#00CC9920',
								activeTextColor: '#00CC99',
								textTransform: 'none',
							},
							arrow: {
								size: '1.5em',
								color: '#cccccc',
							},
							logo: {
								maxHeight: '260px',
								maxWidth: '260px',
								gutter: '2px',
							},
						},
						// rightPanel: {
						// 	backgroundColor: '#263238',
						// 	width: '40%',
						// 	textColor: '#ffffff',
						// },
						servers: {
							overlay: {
								backgroundColor: '#fafafa',
								textColor: '#263238',
							},
							url: {
								backgroundColor: '#fff',
							},
						}
					},
				}}
			/>
		</Container>
	);
};

export default ApiDocsComponent;