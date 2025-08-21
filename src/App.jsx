import PropTypes from "prop-types";
import React from "react";

import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import { useLocation } from 'react-router-dom';

import { useSelector } from "react-redux";

// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";

// // Import all middleware
import Authmiddleware from "./routes/route";

// // layouts Format
import VerticalLayout from "./components/VerticalLayout/";
// import HorizontalLayout from "./components/HorizontalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import ApiDocsComponent from "./pages/ApiDocs";
import TokenExpirationHandler from "./pages/TokenExpirationHandler";



const App = (props) => {
	console.log("Redux State: ", useSelector((state) => state));
	const { layoutType } = useSelector((state) => state.Layout);
	function getLayout(layoutType) {
		let layoutCls = VerticalLayout;
		switch (layoutType) {
			case "horizontal":
				layoutCls = HorizontalLayout;
				break;
			default:
				layoutCls = VerticalLayout;
				break;
		}
		return layoutCls;
	}

	const Layout = getLayout(layoutType);

	const location = useLocation();

	return (
		<React.Fragment>
			<TokenExpirationHandler />
			<Routes>
				{/* <Route path="/test-resume" element={<ResumeDetailsComponent jobId="JD-XX7952" />} /> */}
				{publicRoutes.map((route, idx) => (
					<Route
						path={route.path}
						element={<NonAuthLayout>{route.component}</NonAuthLayout>}
						key={idx}
					/>
				))}

				{authProtectedRoutes.map((route, idx) => (
					route.path === "/onboarding" ? (
						<Route
							path={route.path}
							element={<Authmiddleware>{route.component}</Authmiddleware>}
							key={idx}
						/>
					) : (
						<Route
							path={route.path}
							element={
								<Authmiddleware>
									<Layout>{route.component}</Layout>
								</Authmiddleware>
							}
							key={idx}
						/>
					)
				))}
			</Routes>
		</React.Fragment>
	);
};

App.propTypes = {
	layout: PropTypes.any,
};

const mapStateToProps = (state) => {
	return {
		layout: state.Layout,
	};
};

export default connect(mapStateToProps, null)(App);
