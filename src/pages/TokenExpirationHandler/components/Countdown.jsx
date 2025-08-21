import React, { useState } from "react";

// make a countdown component that will count down from 10 to 0 and stop after that
import { useEffect } from "react";

const Countdown = () => {
	const [count, setCount] = useState(10);

	useEffect(() => {
		if (count > 0) {
			const timer = setTimeout(() => setCount(count - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [count]);

	return <div className="text-sm text-mutedtext">This dialog will automatically close after {count} seconds</div>;
};

export default Countdown;