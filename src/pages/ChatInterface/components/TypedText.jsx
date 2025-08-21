/* eslint-disable react/prop-types */
import React, { useEffect } from "react";

let timeout;

const TypedText = ({ text }) => {
	function typeAnimate(txt) {
		if (txt) {
			document.getElementById("typed").innerHTML += txt.charAt(0);
			timeout = setTimeout(() => typeAnimate(txt.slice(1)), 50);
		}
	}

	useEffect(() => {
		typeAnimate(text);
		return () => {
			if (timeout) clearTimeout(timeout);
		}
	}, []);

	return (
		<div id="typed" className="text-lg text-center"></div>
	);
}

export default TypedText;