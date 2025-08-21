import { useDispatch } from "react-redux";
import React, { useEffect } from "react";

const useQuietRefresh = (connected, tenantId, integrationType, refreshFunction, connectSuccessAction) => {
    const dispatch = useDispatch();
  
    useEffect(() => {
      const refreshIntegration = async () => {
        if (!connected && tenantId) {
          try {
            const response = await refreshFunction(tenantId);
            if (response.integration_id || response.tenant_id) {
              dispatch(connectSuccessAction(response.integration_id, response.connection_id));
            }
          } catch (error) {
            console.error(`${integrationType} integration refresh failed:`, error);
          }
        }
      };
  
      refreshIntegration();
    }, [connected, tenantId, dispatch]);
  };

export default useQuietRefresh;