import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  submitAssignmentApi,
  updateAssignmentApi,
  fetchAssignmentsByTenant,
  fetchUsersByTenant,
  fetchPersonasByTenant,
} from "../../services/api";
import { format, parseISO, isBefore } from "date-fns";
import AssignmentsTable from "./components/AssignmentsTable";
import CreateAssignmentDialog from "./components/CreateAssignmentDialog";
import AssignmentDetilsDialog from "./components/AssignmentDetilsDialog";
import { useToast } from "@/components/ui/use-toast";

const Assignment = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [frequency, setFrequency] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [callType, setCallType] = useState("cold call");
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [title, setTitle] = useState("");
  const [rolePlaysPerDay, setRolePlaysPerDay] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [selectedAssignment, setSelectedAssignment] = useState(undefined);
  const [isAssignmentDetailModalOpen, setIsAssignmentDetailModalOpen] =
    useState(false);

  const isAdmin = useSelector((state) => state.login.user?.is_admin);
  const tenantId = useSelector(
    (state) =>
      state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const username = useSelector((state) => state.login.user?.username);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditMode && editingAssignment) {
      setTitle(editingAssignment.title || "");
      setFrequency(editingAssignment.frequency || "daily");
      setStartDate(
        format(parseISO(editingAssignment.start_date), "yyyy-MM-dd")
      );
      setEndDate(format(parseISO(editingAssignment.end_date), "yyyy-MM-dd"));
      setSelectedMulti(
        editingAssignment.assignees.map((assignee) => `${assignee.value}`)
      );
      setCallType(editingAssignment.call_type || "cold call");

      if (typeof editingAssignment.persona === "string") {
        setSelectedPersona(editingAssignment.persona);
      } else if (editingAssignment.persona) {
        setSelectedPersona(editingAssignment.persona.value);
      } else {
        setSelectedPersona(null);
      }

      setRolePlaysPerDay(editingAssignment.role_plays_per_day || "");
    }
  }, [editingAssignment, isEditMode]);

  const toggleModal = () => {
    if (isCreateDialogOpen) {
      setErrorMessage("");
      setIsEditMode(false);
      setEditingAssignment(null);
      setFrequency("daily");
      setStartDate("");
      setEndDate("");
      setSelectedMulti([]);
      setCallType("cold call");
      setSelectedPersona(null);
      setTitle("");
      setRolePlaysPerDay("");
    }
    setIsCreateDialogOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignmentsData = await fetchAssignmentsByTenant(tenantId);
        setAssignments(assignmentsData);
        const usersData = await fetchUsersByTenant(tenantId);
        const usersOptions = usersData.map((user) => ({
          label: user.name,
          value: user.email,
        }));
        setUsersData(usersOptions);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId]);

  useEffect(() => {
    const fetchPersonas = async () => {
      if (tenantId) {
        const personasData = await fetchPersonasByTenant(tenantId);
        if (personasData) {
          setPersonas(personasData);
        }
      }
    };

    fetchPersonas();
  }, [tenantId]);

  const handleMultiChange = (selectedOptions) => {
    setSelectedMulti(selectedOptions);
  };

  const handlePersonaChange = (selectedOption) => {
    setSelectedPersona(selectedOption);
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    if (
      !title ||
      !frequency ||
      !startDate ||
      !endDate ||
      !selectedMulti.length ||
      !callType ||
      !rolePlaysPerDay ||
      !selectedPersona
    ) {
      toast({
        variant: "destructive",
        description: "All fields are required.",
      });
      return;
    }

    if (isBefore(new Date(endDate), new Date(startDate))) {
      toast({
        variant: "destructive",
        description: "End date cannot be earlier than start date.",
      });
      return;
    }

    if (parseInt(rolePlaysPerDay) > 5) {
      toast({
        variant: "destructive",
        description: "Role plays per day should not exceed 5.",
      });
      return;
    }

    if (!isEditMode) {
      const isDuplicateTitle = assignments.some(
        (assignment) =>
          typeof assignment.title === "string" &&
          assignment.title.toLowerCase() === title.toLowerCase()
      );
      if (isDuplicateTitle) {
        toast({
          variant: "destructive",
          description: "Assignment name must be unique.",
        });
        return;
      }
    }

    const startDateUTC = new Date(startDate).toISOString();
    const endDateUTC = new Date(endDate).toISOString();

    const newAssignment = {
      assignment_id: isEditMode
        ? editingAssignment.assignment_id
        : `AS-${tenantId}-${String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
          )}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
      assignment: {
        title,
        frequency,
        startDate: startDateUTC,
        endDate: endDateUTC,
        assignees: selectedMulti.map((assignee) => {
          const currentAssignee = usersData.find(
            (user) => user.value === assignee
          );
          return {
            label: currentAssignee.label,
            value: currentAssignee.value,
          };
        }),
        callType,
        persona: { label: selectedPersona, value: selectedPersona },
        rolePlaysPerDay,
      },
      tenant_id: tenantId,
      username: username,
      created_at: isEditMode
        ? editingAssignment.created_at
        : new Date().toISOString(),
    };

    try {
      if (isEditMode) {
        await updateAssignmentApi(newAssignment, tenantId, username);
        setAssignments(
          assignments.map((assignment) =>
            assignment.assignment_id === newAssignment.assignment_id
              ? newAssignment
              : assignment
          )
        );
      } else {
        await submitAssignmentApi(newAssignment);
        setAssignments([...assignments, newAssignment]);
      }

      toggleModal();
      toast({
        variant: "success",
        description: isEditMode
          ? "Assignment updated successfully"
          : "Assignment submitted successfully",
      });
      setErrorMessage("");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        variant: "destructive",
        description: "Error submitting assignment.",
      });
    }
  };

  const handleEditClick = (assignment) => {
    setIsEditMode(true);
    setEditingAssignment(assignment);
    setIsCreateDialogOpen(true);
  };

  const handleRowClick = (clickedRow) => {
    setSelectedAssignment(clickedRow);
    setIsAssignmentDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-2 w-full  h-[calc(100vh-70px)] overflow-y-auto mt-[70px] font-Gilroy py-3 px-3 bg-background ">
      {/* min heading */}
      <div className="flex flex-row items-center justify-between gap-2">
        {" "}
        <h1 className="font-semibold  text-[32px] leading-[34px]">
          Assignments
        </h1>
        {isAdmin && (
          <CreateAssignmentDialog
            title={title}
            setTitle={setTitle}
            frequency={frequency}
            setFrequency={setFrequency}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedMulti={selectedMulti}
            setSelectedMulti={setSelectedMulti}
            callType={callType}
            setCallType={setCallType}
            rolePlaysPerDay={rolePlaysPerDay}
            setRolePlaysPerDay={setRolePlaysPerDay}
            selectedPersona={selectedPersona}
            setSelectedPersona={setSelectedPersona}
            assignes={usersData}
            personas={personas}
            setPersonas={setPersonas}
            onSubmit={handleSubmit}
            open={isCreateDialogOpen}
            setOpen={setIsCreateDialogOpen}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        )}
      </div>

      <AssignmentDetilsDialog
        open={isAssignmentDetailModalOpen}
        setOpen={setIsAssignmentDetailModalOpen}
        assignmentData={selectedAssignment}
      />

      <AssignmentsTable
        assignments={assignments}
        handleRowClick={handleRowClick}
        handleEditClick={handleEditClick}
      />
    </div>
  );
};

export default Assignment;
