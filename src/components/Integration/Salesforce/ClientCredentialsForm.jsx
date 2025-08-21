import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { connectSalesforceSuccess, connectSalesforceFailure, disconnectSalesforceSuccess, disconnectSalesforceFailure } from "@/store/integration/salesforce/actions";
import { nangoService } from "@/services/api";

const FormSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
});

const ClientCredentialsForm = ({
  children,
  open,
  setOpen,
  initialValues,
  actionButtonText,
}) => {
  const dispatch = useDispatch();
  const { loading, error, connected, integrationId, connectionId } = useSelector(state => state.salesforce);

  const handleDelete = async () => {
    try {
      await nangoService.disconnectIntegration(integrationId, connectionId);
      dispatch(disconnectSalesforceSuccess());
    } catch (error) {
      console.error("Failed to disconnect Salesforce:", error);
      dispatch(disconnectSalesforceFailure("Failed to disconnect Salesforce: " + error.message));
    }
  };
  
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialValues,
  });

  const tenantId = useSelector(
    (state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const username = useSelector((state) => state.login.user?.username);

  const handleSave = async (formData) => {
    try {
      // Step 1: Integrate with Nango
      let integrationResponse;
      try {
        integrationResponse = await nangoService.integrateNango(
          tenantId, formData.clientId, formData.clientSecret, "salesforce", "api,refresh_token"
        );
      } catch (error) {
          console.error("Failed to integrate with Nango:", error);
          dispatch(connectSalesforceFailure("Failed to integrate with Nango: " + error.message));
          return; // Stop the process here
      }
  
      // Step 2: Perform Nango Auth
      try {
        await nangoService.performNangoAuth(
          integrationResponse.integration_id, integrationResponse.connection_id
        );
      } catch (error) {
        console.error("Failed to perform Nango Auth:", error);
        dispatch(connectSalesforceFailure("Failed to perform Nango Auth: " + error.message));
        return; // Stop the process here
      }
  
      // Step 3: Save Nango Integration
      try {
        await nangoService.saveNangoIntegration({
          tenant_id: tenantId,
          client_id: formData.clientId,
          client_secret: formData.clientSecret,
          provider: "salesforce",
          oauth_scopes: "",
          integration_id: integrationResponse.integration_id,
          connection_id: integrationResponse.connection_id
        });
      } catch (error) {
        console.error("Failed to save Nango Integration:", error);
        dispatch(connectSalesforceFailure("Failed to save Nango Integration: " + error.message));
        return; // Stop the process here
      }
  
      // In your handleSave function, after all API calls are successful
      dispatch(connectSalesforceSuccess(
        integrationResponse.integration_id, 
        integrationResponse.connection_id
      ));
  
    } catch (error) {
      console.error("Unexpected error while connecting Salesforce:", error);
      dispatch(connectSalesforceFailure("Unexpected error: " + error.message));
    }
  };

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (connected) {
      setOpen(false);
    }
  }, [connected, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen} className="!bg-card-color !border-none">
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px] !bg-card-color !border-none">
        <DialogHeader className="text-left">
          <DialogTitle>{connected ? "Manage Salesforce Connection" : "Connect to Salesforce"}</DialogTitle>
        </DialogHeader>
        {connected ? (
          <div className="flex flex-col gap-4">
            <p>Your Salesforce account is connected.</p>
            {error && <p className="text-red-500">{error}</p>}
            <DialogFooter>
              <Button
                type="button"
                className="bg-red-500 text-white"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : "Delete Connection"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form
              className="flex flex-col gap-7 w-full"
              onSubmit={form.handleSubmit(handleSave)}
            >
              <div className="flex flex-row items-center gap-4 justify-between w-full">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row items-center gap-4 justify-between w-full">
                <FormField
                  control={form.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="w-full h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <DialogFooter>
                <Button
                  type="button"
                  className="bg-primaryColor/15 text-primaryColor !border-none"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primaryColor flex flex-row items-center gap-3 text-white"
                  disabled={loading}
                >
                  {loading ? <Loader className="animate-spin" /> : <p>{actionButtonText}</p>}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientCredentialsForm;