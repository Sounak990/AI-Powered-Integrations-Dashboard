import React from "react";
import { Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import EmailVerification from "../pages/auth-email-verification";
import ConfirmMail from "../pages/page-confirm-mail";
import EmailLinkVerification from "../pages/EmailLinkVerification";
import Onboarding from "../pages/onboarding";
import Dashboard from "../pages/Dashboard";
import ForgetPasswordPage from "../pages/ForgetPassword";
import Support from "../pages/Support";
import PracticeSales from "../pages/PracticeSales";
import SalesEvaluation from "../pages/Stream";
import Reports from "../pages/Reports";
// import ReportDetails from "../pages/Reports/ReportDetails";
import Scenario from "../pages/Scenario";
import AddUser from "../pages/UserManagement";
import InviteSignUp from "../pages/InviteRegister";
import Profile from "../pages/Profile";
import Playground from "../pages/Playground";
import Conversation from "../pages/Conversation";
import ConversationDetails from "../pages/Conversation/ConversationDetails/ConversationDetails";
import Navan from "../pages/Companies/Navan";
import Assignment from "../pages/Assignments";
import AssignmentDetails from "../pages/Assignments/AssignmentDetails";
import AsigneeDetails from "../pages/Assignments/AssignmentDetails/AssigneeDetails";
import KnowledgeBase from "../pages/KnowledgeBase";
import Roleplay from "../pages/RolePlay";
import ChatComponent from "@/pages/Assistant";
import Home from "@/pages/Home";
import ApiDocsComponent from "../pages/ApiDocs";
import ChatInterface from "@/pages/ChatInterface";

const publicRoutes = [
    { path: "/", component: <Login /> },
    { path: "/login", component: <Login /> },
    { path: "/register", component: <Register /> },
    { path: "/auth-email-verification", component: <EmailVerification />},
    { path: "/pages-confirm-mail", component: <ConfirmMail/>},
    { path: "/verify-email", component: <EmailLinkVerification /> },
    { path: "/forgot-password", component: <ForgetPasswordPage /> },
    { path: "/invite-register", component: <InviteSignUp /> },  
    // { path: "/playground", component: <Playground /> }, 
    // { path: "/navan", component: <Navan /> },     
	{ path: '/api-docs', component: <ApiDocsComponent />},
]

const authProtectedRoutes = [
    { path: "/onboarding", component: <Onboarding /> },
    // { path:"/dashboard", component: <SalesEvaluation /> },
    { path: "/support", component: <Support /> },  
    // { path: "/practice-sales", component: <PracticeSales /> },
    // { path: "/practice-sales/:conversationId", component: <SalesEvaluation /> },
    // { path: "/reports", component: <Reports /> },
    // { path: "/:conversationId/reportdetails", component: <ReportDetails /> },
    // { path: "/scenarios", component: <Scenario /> },
    { path: "/user-management", component: <AddUser /> },
    { path: "/profile", component: <Profile /> },
    // { path: "/conversations", component: <Conversation /> },
    // { path: "/conversation-details", component: <ConversationDetails /> },
    // { path: "/assignments", component: <Assignment /> },
    // { path: "/assignment-details/:assignmentId", component: <AssignmentDetails /> },
    // { path: "/assignments/:assignmentId/assignees/", component: <AsigneeDetails /> },
    // { path: "/knowledgebase", component: <KnowledgeBase /> },
    // { path: "/roleplay", component: <Roleplay /> },
    // { path: "/assistant", component: <ChatComponent /> },
    { path: "/home/:tab", component: <Home /> },
    { path: "/home", component: <Home /> },
	{ path: "/chat-interface", component: <ChatInterface /> },
	{ path: "/chat-interface/:chatId", component: <ChatInterface /> },
]


export { authProtectedRoutes, publicRoutes };