import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw, Copy } from "lucide-react"; // Added Copy icon
import { slackRefresh } from "@/services/api";
import { 
  connectSlackSuccess, 
  connectSlackFailure,
  disconnectSlackSuccess
} from '@/store/integration/slack/actions';

const SlackIntegration = ({ connected, loading: propLoading }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const tenantId = useSelector(
    (state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );

  const slackCommand = `!connect-account ${tenantId || '12345'}`;

  const handleConnect = () => {
    window.open("https://off-cotton-relates-swim.trycloudflare.com/slack/install", '_blank');
  };

  const handleDisconnect = () => {
    console.log("Disconnecting from Slack...");
    dispatch(disconnectSlackSuccess());
  }

  const handleRefresh = async () => {
    if (!tenantId) {
      console.error('Tenant ID not found');
      return;
    }

    setLoading(true);
    try {
      const response = await slackRefresh(tenantId);
      console.log('Refresh response:', response);
      if (response.tenant_id) {
        dispatch(connectSlackSuccess());
      } else {
        dispatch(connectSlackFailure('Failed to refresh Slack connection'));
      }
    } catch (error) {
      dispatch(connectSlackFailure(error.message || 'Failed to refresh Slack connection'));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(slackCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          {connected ? "Manage" : "Connect"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] !bg-card-color !border-none">
        <DialogHeader className="text-left">
          <DialogTitle>{connected ? "Manage Slack Connection" : "Connect to Slack"}</DialogTitle>
        </DialogHeader>
        
        {connected ? (
          <div className="flex flex-col gap-4">
            <p>Your Slack workspace is connected.</p>
            <div className="flex gap-3">
              <Button
                type="button"
                className="bg-red-500 text-white flex-1"
                onClick={handleDisconnect}
                disabled={loading || propLoading}
              >
                {(loading || propLoading) ? <Loader className="animate-spin" /> : "Disconnect"}
              </Button>
              <Button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleRefresh}
                disabled={loading || propLoading}
              >
                <RefreshCw className={`w-5 h-5 ${loading || propLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Disconnection Instructions */}
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">
                To disconnect completely:
              </p>
              <ol className="list-decimal list-inside mt-2 text-sm text-gray-300 space-y-2">
                <li>Go to your Slack workspace</li>
                <li>Find and remove the bot from your workspace</li>
                <li>Click the "Disconnect" button above</li>
              </ol>
              <p className="mt-3 text-xs text-gray-400">
                Note: Simply clicking disconnect without removing the bot from Slack may leave residual connections.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>Connect your Slack workspace to get started.</p>
            <div className="flex gap-3">
              <Button
                onClick={handleConnect}
                className="bg-[#4A154B] text-white flex-1"
                disabled={loading || propLoading}
              >
                {(loading || propLoading) ? <Loader className="animate-spin" /> : "Connect with Slack"}
              </Button>
              <Button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleRefresh}
                disabled={loading || propLoading}
              >
                <RefreshCw className={`w-5 h-5 ${loading || propLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Slack Bot Command Section */}
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">
                After connecting, send this command to the Slack bot:
              </p>
              <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
                <code className="text-green-400 font-mono">{slackCommand}</code>
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-600"
                >
                  {copied ? (
                    <span className="text-green-400 text-sm">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SlackIntegration;