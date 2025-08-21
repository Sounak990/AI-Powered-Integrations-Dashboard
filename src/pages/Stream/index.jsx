import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { submitBotData, updateBotData, fetchUserBotData } from "../../services/api";
import AddBotForm from "./components/AddBotForm";
import { useToast } from "@/components/ui/use-toast";
import BotSection from "./components/BotSection";
import { mockPreBuiltBots } from "@/components/bots/PrebuiltBot";

const SalesEvaluation = () => {
  const tenantId = useSelector(
    (state) =>
      state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const username = useSelector((state) => state.login.user?.username);

  const [botData, setBotData] = useState([]);
  const [preBuiltBots, setPreBuiltBots] = useState([]);
  const [isBotDataLoading, setIsBotDataLoading] = useState(false);
  const [isPreBuiltBotsLoading, setIsPreBuiltBotsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('yourBots'); // New state for tab switching
  const [selectedDepartment, setSelectedDepartment] = useState(''); // State for selected department

  const { toast } = useToast();

  const saveBot = async (
    title,
    companyName,
    scenario,
    botName,
    personName,
    demeanor,
    discoveryCall
  ) => {
    const botData = {
      title,
      companyName,
      scenario,
      demeanor,
      botName,
      personName,
      discoveryCall,
    };
    try {
      const response = await submitBotData(botData, tenantId, username);
      console.log("Save successful:", response);
      toast({
        variant: "success",
        title: "Bot created successfully",
      });
      fetchBots(); // Fetch the updated bot data
    } catch (error) {
      console.error("Error saving bot data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the bot data. Please try again.",
      });
    }
  };

  const updateBot = async (
    bot_id,
    title,
    companyName,
    scenario,
    demeanor,
    botName,
    personName,
    discoveryCall
  ) => {
    const botData = {
      bot_id,
      title,
      companyName,
      scenario,
      demeanor,
      botName,
      personName,
      tenantId,
      username,
      discoveryCall,
    };
    try {
      const response = await updateBotData(botData);
      console.log("Update successful:", response);
      toast({
        variant: "success",
        title: "Success",
        description: "Bot updated successfully",
      });
      fetchBots(); // Fetch the updated bot data
    } catch (error) {
      console.error("Error updating bot data:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to update the bot data. Please try again.",
      });
    }
  };

  const fetchBots = useCallback(async () => {
    try {
      setIsBotDataLoading(true);
      const bots = await fetchUserBotData(tenantId, username);
      setBotData(bots);
    } catch (error) {
      console.error("Failed to fetch bot data:", error);
    } finally {
      setIsBotDataLoading(false);
    }
  }, [tenantId, username]);

  const fetchPreBuiltBots = useCallback(async () => {
    try {
      setIsPreBuiltBotsLoading(true);
      setPreBuiltBots(mockPreBuiltBots); // Using the mock pre-built bots
    } catch (error) {
      console.error("Failed to fetch pre-built bots:", error);
    } finally {
      setIsPreBuiltBotsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBots();
    fetchPreBuiltBots();
  }, [fetchBots, fetchPreBuiltBots]);

  const uniqueDepartments = Array.from(new Set(mockPreBuiltBots.map(bot => bot.department)));

  const filteredPreBuiltBots = preBuiltBots.filter(
    (bot) => selectedDepartment === '' || bot.department === selectedDepartment
  );

  return (
    <div className="w-full h-[calc(100vh-70px)] overflow-y-auto mt-[70px] font-Gilroy py-3 px-3 bg-background text-white flex flex-col gap-4">
      {/* main heading */}
      <div className="flex flex-row items-center justify-between w-full h-max">
        <h1 className="font-semibold text-[32px] leading-10">Available Bots</h1>
        <AddBotForm onSaveBot={saveBot} />
      </div>

      {/* Tabs for switching between Your Bots and Pre-built Bots */}
      <div className="flex flex-row gap-4 border-b border-gray-700">
        <button
          className={`px-4 py-2 ${activeTab === 'yourBots' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('yourBots')}
        >
          Your Bots
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'prebuiltBots' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('prebuiltBots')}
        >
          Pre-built Bots
        </button>
      </div>

      {activeTab === 'prebuiltBots' && (
  <div className="flex flex-row gap-4 items-center">
    {/* Filter Title */}
    <h3 className="text-white font-medium text-base">Department:</h3>
      
    {/* Department Filter */}
    <select
      id="departmentFilter"
      className="bg-gray-800 text-white p-2 rounded-md text-base font-medium"
      value={selectedDepartment}
      onChange={(e) => setSelectedDepartment(e.target.value)}
    >
      <option value="">All Departments</option>
      {uniqueDepartments.map((dept) => (
        <option key={dept} value={dept}>
          {dept}
        </option>
      ))}
    </select>
  </div>
)}



      {/* Conditional rendering based on active tab */}
      <div className="flex flex-row gap-4">
        {activeTab === 'yourBots' && (
          <div className="w-full">
            <BotSection
              title="Your Bots"
              subtitle="Bots you have created for your specific needs."
              bots={botData}
              onBotEdit={updateBot}
              isBotDataLoading={isBotDataLoading}
              columns={2} // Set the number of columns to 2
            />
          </div>
        )}

        {activeTab === 'prebuiltBots' && (
          <div className="w-full">
            <BotSection
              title="Pre-built Bots"
              subtitle="Ready-to-use bots tailored for specific scenarios."
              bots={filteredPreBuiltBots}
              onBotEdit={() => {}}
              isBotDataLoading={isPreBuiltBotsLoading}
              columns={2} // Adjust as needed
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesEvaluation;
