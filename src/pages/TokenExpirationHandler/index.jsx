import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, refreshTokenRequest } from '../../store/login/actions';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { apiRefreshToken } from '@/services/api';
import Countdown from './components/Countdown';

let closeTimer;
let countdownInterval;

const TOKEN_TIMEOUT = 24 * 60 * 60 * 1000; // 1 day

const TokenExpirationHandler = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const tokenExpiresAt = useSelector((state) => state.login.tokenExpiresAt);
	const [open, setOpen] = useState(false);
	const [expired, setExpired] = useState(false);

	const handleClose = () => {
		clearTimeout(closeTimer);
		setOpen(false);
		dispatch(logoutUser());
		navigate('/login');
		setExpired(false);
	}

	useEffect(() => {
		if (!expired) return;
		setOpen(true);
		if (closeTimer) clearTimeout(closeTimer);
		closeTimer = setTimeout(() => {
			setOpen(false);
			dispatch(logoutUser());
			navigate('/login');
			setExpired(false);
		}, 10000);

		return () => {
			if (closeTimer) clearTimeout(closeTimer);
		};
	}, [expired, dispatch, navigate]);

	useEffect(() => {
		if (tokenExpiresAt) {
			const currentTime = new Date().getTime();
			const timeLeft = tokenExpiresAt - currentTime;
			console.log('Time left:', timeLeft / 1000);

			if (timeLeft <= 0) {
				setExpired(true);
				return;
			}

			let refreshTimer;

			if (timeLeft <= TOKEN_TIMEOUT) {
				dispatch(refreshTokenRequest());
			} else {
				console.log('Setting up token expiration timer for', (timeLeft - TOKEN_TIMEOUT) / 1000, 'seconds');
				refreshTimer = setTimeout(() => {
					dispatch(refreshTokenRequest());
				}, timeLeft - TOKEN_TIMEOUT);
			}

			return () => {
				if (refreshTimer) clearTimeout(refreshTimer);
			};
		}
	}, [tokenExpiresAt, dispatch, navigate]);

	// useEffect(() => {
	// 	const currentTime = new Date().getTime();
	// 	if (tokenExpiresAt && tokenExpiresAt <= currentTime) {
	// 		alert('Your session has expired. You will be redirected to the login page.');
	// 		dispatch(logoutUser());
	// 		navigate('/login');
	// 	}
	// }, [tokenExpiresAt, dispatch, navigate]);

	return (
		<Dialog
			open={open}
			onOpenChange={handleClose}
			className="!bg-card-color !border-none"
		>
			<DialogContent className="max-w-full w-[90%] sm:w-[500px] lg:w-[700px] max-h-[90vh] overflow-y-auto !bg-card-color !border-none">
				<DialogHeader className="flex flex-column items-center gap-2 text-left w-full">
					<div className="flex flex-row items-center gap-3 justify-start w-full">
						<DialogTitle className="m-0">Session Expired</DialogTitle>
					</div>
				</DialogHeader>
				<Separator className="w-full bg-slate-300" />
				<div className="text-base">Due to prolonged inactivity, your session has expired. Please log in again to continue.</div>
				<div className="text-base">Close this dialog to proceeed to login page</div>
				{expired && <Countdown />}
			</DialogContent>
		</Dialog>
	);
};

export default TokenExpirationHandler;