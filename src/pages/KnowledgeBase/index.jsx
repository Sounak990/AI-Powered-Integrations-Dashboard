import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import NavTabs from "./components/NavTab";
import KnowledgeUploadTab from "./components/KnowledgeUploadTab";
import PersonaTab from "./components/PersonaTab";
import { fetchKBRequest } from "../../store/actions";
import TabBar from "@/components/gobals/TabBar";
import { knowledgebasePageTabs } from "./constants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRef } from "react";
import CompetitorTab from "./components/CompetitorTab";
import AddCompetitorsDialog from "./components/AddCompetitorsDialog";

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState(knowledgebasePageTabs[0]);
  const addPersonaButtonRef = useRef(null);
  const [isAddCompetitorsOpen, setIsAddCompetitorsOpen] = useState(false);
  const [competitors, setCompetitors] = useState([]);

  const addCompetitor = (newCompetitor) => {
    setCompetitors([...competitors, newCompetitor]);
    toggleModal();
  };
  const dispatch = useDispatch();
  const tenantId = useSelector(
    (state) =>
      state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const username = useSelector((state) => state.login.user?.username);

  useEffect(() => {
    if (tenantId) {
      dispatch(fetchKBRequest(tenantId));
    }
  }, [tenantId, dispatch]);

  return (
    <div className="flex flex-col gap-2 w-full h-[calc(100vh-70px)] overflow-y-auto mt-[70px] font-Gilroy py-3 px-3 bg-background ">
      {/* main heading */}
      <div className="flex flex-row items-center justify-between gap-2">
        <h1 className="font-semibold  text-[32px] leading-[34px]">
          Knowledge Base
        </h1>
        {knowledgebasePageTabs[1] === activeTab && (
          <Button
            className="bg-primaryColor flex flex-row items-center gap-3"
            ref={addPersonaButtonRef}
          >
            <Plus />
            <p>Add Persona</p>
          </Button>
        )}
        {knowledgebasePageTabs[2] === activeTab && (
          <AddCompetitorsDialog
            isAddCompetitorsOpen={isAddCompetitorsOpen}
            setIsAddCompetitorsOpen={setIsAddCompetitorsOpen}
            addCompetitor={addCompetitor}
          />
        )}
      </div>
      <TabBar
        menuList={knowledgebasePageTabs}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      {knowledgebasePageTabs[0] === activeTab && (
        <KnowledgeUploadTab tenantId={tenantId} username={username} />
      )}

      {knowledgebasePageTabs[1] === activeTab && (
        <PersonaTab
          tenantId={tenantId}
          username={username}
          addPersonaButtonRef={addPersonaButtonRef}
        />
      )}
      {knowledgebasePageTabs[2] === activeTab && (
        <CompetitorTab competitors={competitors} />
      )}
    </div>
  );
};

export default KnowledgeBase;
