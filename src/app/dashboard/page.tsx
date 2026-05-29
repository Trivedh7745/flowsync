"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Briefcase,
  CreditCard,
  FileText,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const [showProjectModal, setShowProjectModal] = useState(false);

  const [showClientModal, setShowClientModal] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);

  const [clients, setClients] = useState<any[]>([]);

  const [tasks, setTasks] = useState<any[]>([]);

  const [invoices, setInvoices] = useState<any[]>([]);

  const [documents, setDocuments] = useState<any[]>([]);

  const [meetings, setMeetings] = useState<any[]>([]);

  const [analytics, setAnalytics] = useState({
  clients: 0,
  projects: 0,
  tasks: 0,
  invoices: 0,
  meetings: 0,
  });

  const revenueData = [
    {
      name: "Invoices",
      value: invoices.reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount || 0),
        0
      ),
    },
  ];

  const taskChartData = [
   {
    name: "Todo",
    value: tasks.filter(
      (task) => task.status === "Todo"
    ).length,
   },
   {
    name: "In Progress",
    value: tasks.filter(
      (task) => task.status === "In Progress"
    ).length,
   },
   {
    name: "Completed",
    value: tasks.filter(
      (task) => task.status === "Completed"
    ).length,
    } ,
  ];

  const projectChartData = [
   {
    name: "Projects",
    value: projects.length,
   },
  ];

  const meetingChartData = [
   {
    name: "Scheduled",
    value: meetings.filter(
      (meeting) =>
        meeting.status === "Scheduled"
    ).length,
   },
   {
    name: "Completed",
    value: meetings.filter(
      (meeting) =>
        meeting.status === "Completed"
    ).length,
   },
   {
    name: "Cancelled",
    value: meetings.filter(
      (meeting) =>
        meeting.status === "Cancelled"
    ).length,
   },
  ];

  const clientChartData = clients.map(
   (client) => ({
    name: client.name,
    projects: projects.filter(
      (project) =>
        project.clientId === client.id
    ).length,
   })
  );

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    deadline: "",
    clientId: "",
  });

  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    company: "",
  });

  const [taskData, setTaskData] = useState({
    title: "",
    status: "Todo",
    priority: "Medium",
    projectId: "",
  });

  const [invoiceData, setInvoiceData] = useState({
    amount: "",
    status: "Pending",
    dueDate: "",
    clientId: "",
    projectId: "",
  });

  const [documentData, setDocumentData] =
  useState({
    name: "",
    file: null as File | null,
  });

  const [meetingData, setMeetingData] =
  useState({
    title: "",
    date: "",
    time: "",
    meetingLink: "",
    notes: "",
    status: "Scheduled",
    clientId: "",
    projectId: "",
  });

 
  const stats = [
    {
      title: "Active Projects",
      value: String(projects.length),
      icon: FolderKanban,
    },
    {
      title: "Clients",
      value: String(clients.length),
      icon: Users,
    },
    {
      title: "Pending Invoices",
      value: "0",
      icon: CreditCard,
    },
    {
      title: "Tasks Completed",
      value: String(
        tasks.filter((task) => task.status === "Completed").length
      ),
      icon: BarChart3,
    },
  ];

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");

      const data = await res.json();

      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");

      const data = await res.json();

      setClients(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");

      const data = await res.json();

      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");

      const data = await res.json();

      setInvoices(data);
    }  catch (error) {
    console.error(error);
    }
  };


  const fetchDocuments = async () => {
   try {
    const res = await fetch("/api/documents");

    const text = await res.text();

    if (!text) {
      setDocuments([]);
      return;
    }

    const data = JSON.parse(text);

    setDocuments(data);
   } catch (error) {
    console.error(
      "FETCH DOCUMENTS ERROR:",
      error
    );

    setDocuments([]);
   }
  };

 const fetchMeetings = async () => {
  try {
    const res = await fetch("/api/meetings");

    const text = await res.text();

    console.log(text);

    if (!text) {
      setMeetings([]);
      return;
    }

    const data = JSON.parse(text);

    setMeetings(data);
  } catch (error) {
    console.error(
      "FETCH MEETINGS ERROR:",
      error
    );

    setMeetings([]);
  }
 };
 
 const fetchAnalytics = () => {
  setAnalytics({
    clients: clients.length,
    projects: projects.length,
    tasks: tasks.length,
    invoices: invoices.length,
    meetings: meetings.length,
  });
 };

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchTasks();
    fetchInvoices();
    fetchDocuments();
    fetchMeetings();
  }, []);

  useEffect(() => {
  fetchAnalytics();
  }, [
  clients,
  projects,
  tasks,
  invoices,
  meetings,
  ]);

  
 const createProject = async () => {
  try {
    if (
      !projectData.title ||
      !projectData.clientId
    ) {
      alert("Please fill all fields");

      return;
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: projectData.title,
        description: projectData.description,
        deadline: projectData.deadline,
        status: "In Progress",
        clientId: projectData.clientId,
      }),
    });

    if (res.ok) {
      fetchProjects();

      setShowProjectModal(false);

      setProjectData({
        title: "",
        description: "",
        deadline: "",
        clientId: "",
      });
    } else {
      const error = await res.json();

      console.log(error);

      alert("Failed to create project");
    }
  } catch (error) {
    console.error(error);

    alert("Something went wrong");
  }
 };

  const createClient = async () => {
  try {
    if (
      !clientData.name ||
      !clientData.email
    ) {
      alert("Please fill all fields");

      return;
    }

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: clientData.name,
        email: clientData.email,
        company: clientData.company,
      }),
    });

    if (res.ok) {
      fetchClients();

      setShowClientModal(false);

      setClientData({
        name: "",
        email: "",
        company: "",
      });
    } else {
      const error = await res.json();

      console.log(error);

      alert("Failed to create client");
    }
  } catch (error) {
    console.error(error);

    alert("Something went wrong");
  }
};

const createTask = async () => {
  try {
    if (
      !taskData.title ||
      !taskData.projectId
    ) {
      alert("Please fill all fields");

      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: taskData.title,
        status: taskData.status,
        priority: taskData.priority,
        projectId: taskData.projectId,
      }),
    });

    if (res.ok) {
      fetchTasks();

      setShowTaskModal(false);

      setTaskData({
        title: "",
        status: "Todo",
        priority: "Medium",
        projectId: "",
      });
    } else {
      const error = await res.json();

      console.log(error);

      alert("Failed to create task");
    }
  } catch (error) {
    console.error(error);

    alert("Something went wrong");
  }
};

  const updateTaskStatus = async (
    id: string,
    status: string
  ) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createInvoice = async () => {
  try {
    if (
      !invoiceData.amount ||
      !invoiceData.clientId ||
      !invoiceData.projectId ||
      !invoiceData.dueDate
    ) {
      alert("Please fill all fields");

      return;
    }

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parseFloat(invoiceData.amount),
        status: invoiceData.status,
        dueDate: invoiceData.dueDate,
        clientId: invoiceData.clientId,
        projectId: invoiceData.projectId,
      }),
    });

    if (res.ok) {
      fetchInvoices();

      setShowInvoiceModal(false);

      setInvoiceData({
        amount: "",
        status: "Pending",
        dueDate: "",
        clientId: "",
        projectId: "",
      });
    } else {
      const error = await res.json();

      console.log(error);

      alert("Failed to create invoice");
    }
  } catch (error) {
    console.error(error);

    alert("Something went wrong");
  }
};

  const updateInvoiceStatus = async (
  id: string,
  status: string
  ) => {
    try {
     const res = await fetch("/api/invoices", {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         id,
         status,
       }),
     });

     if (res.ok) {
      fetchInvoices();
     }
    } catch (error) {
     console.error(error);
    }
  };

  const deleteInvoice = async (id: string) => {
   try {
     const res = await fetch("/api/invoices", {
       method: "DELETE",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         id,
       }),
     });

     if (res.ok) {
       fetchInvoices();
     }
    } catch (error) {
     console.error(error);
    }
  };

  const createDocument = async () => {
   try {
    if (
      !documentData.name ||
      !documentData.file
    ) {
      alert("Please fill all fields");

      return;
    }

    const formData = new FormData();

    formData.append(
      "name",
      documentData.name
    );

    formData.append(
      "file",
      documentData.file
    );

    const res = await fetch(
      "/api/documents/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      await fetchDocuments();

      setShowDocumentModal(false);

      setDocumentData({
        name: "",
        file: null,
      });
    } else {
      alert("Upload failed");
    }
   } catch (error) {
    console.error(error);

    alert("Something went wrong");
   }
  };

  const deleteDocument = async (id: string) => {
   try {
    const res = await fetch("/api/documents", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (res.ok) {
      fetchDocuments();
    }
   } catch (error) {
    console.error(error);
   }
  };

  

  const createMeeting = async () => {
  try {
    if (
      !meetingData.title ||
      !meetingData.clientId ||
      !meetingData.projectId ||
      !meetingData.date ||
      !meetingData.time
    ) {
      alert("Please fill all required fields");

      return;
    }

    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: meetingData.title,
        date: meetingData.date,
        time: meetingData.time,
        meetingLink:
          meetingData.meetingLink,
        notes: meetingData.notes,
        status: meetingData.status,
        clientId: meetingData.clientId,
        projectId: meetingData.projectId,
      }),
    });

    const text = await res.text();

    console.log(text);

    if (res.ok) {
      await fetchMeetings();

      setShowMeetingModal(false);

      setMeetingData({
        title: "",
        date: "",
        time: "",
        meetingLink: "",
        notes: "",
        status: "Scheduled",
        clientId: "",
        projectId: "",
      });
    } else {
      alert("Failed to create meeting");
    }
  } catch (error) {
    console.error(error);

    alert("Something went wrong");
  }
};

  const updateMeetingStatus = async (
  id: string,
  status: string
  ) => {
    try {
      const res = await fetch("/api/meetings", {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
        id,
        status,
       }),
      });

      if (res.ok) {
       fetchMeetings();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMeeting = async (id: string) => {
  try {
    const res = await fetch("/api/meetings", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (res.ok) {
      fetchMeetings();
    }
  } catch (error) {
    console.error(error);
  }
};

  

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 border-r border-gray-200 bg-white p-6 flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FlowSync
          </h1>
        </div>

        <nav className="space-y-3">
          <button
            onClick={() => setActiveSection("dashboard")}
            className="w-full"
          >
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeSection === "dashboard"}
            />
          </button>

          <button
            onClick={() => setActiveSection("clients")}
            className="w-full"
          >
            <SidebarItem
              icon={Users}
              label="Clients"
              active={activeSection === "clients"}
            />
          </button>

          <button
            onClick={() => setActiveSection("projects")}
            className="w-full"
          >
            <SidebarItem
              icon={FolderKanban}
              label="Projects"
              active={activeSection === "projects"}
            />
          </button>

          <button
            onClick={() => setActiveSection("tasks")}
            className="w-full"
          >
            <SidebarItem
              icon={Briefcase}
              label="Tasks"
              active={activeSection === "tasks"}
            />
          </button>

          
          <button
             onClick={() => setActiveSection("invoices")}
             className="w-full"
          >
             <SidebarItem
               icon={CreditCard}
               label="Invoices"
               active={activeSection === "invoices"}
             />
          </button>

          
          <button
            onClick={() =>
            setActiveSection("documents")
            } 
            className="w-full"
          >
            <SidebarItem
              icon={FileText}
              label="Documents"
              active={
                activeSection === "documents"
              }
            />
          </button>

          <button
            onClick={() =>
              setActiveSection("meetings")
            }
            className="w-full"
          >
            <SidebarItem
               icon={Calendar}
               label="Meetings"
               active={
                activeSection === "meetings"
               }
            />
          </button>

          <button
            onClick={() => setActiveSection("analytics")}
          > 
            <SidebarItem
              icon={BarChart3}
              label="Analytics"
              active={
               activeSection === "analytics"
              }
            />
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <>
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-900">
                Welcome back 👋
              </h2>

              <p className="text-gray-500 mt-2">
                Manage your clients, projects, invoices, and workflow in one
                place.
              </p>
            </div>

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <item.icon className="w-8 h-8 text-indigo-600" />

                    <span className="text-sm text-gray-400">
                      This Month
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900">
                    {item.value}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {item.title}
                  </p>
                </div>
              ))}
            </section>

            {/* Workflow */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8 mb-10">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Workflow Pipeline
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <WorkflowStep label="Lead" />
                <Arrow />
                <WorkflowStep label="Client" />
                <Arrow />
                <WorkflowStep label="Project" />
                <Arrow />
                <WorkflowStep label="Tasks" />
                <Arrow />
                <WorkflowStep label="Invoice" />
                <Arrow />
                <WorkflowStep label="Payment" />
                <Arrow />
                <WorkflowStep label="Analytics" />
              </div>
            </section>
          </>
        )}

        {/* CLIENTS SECTION */}
        {activeSection === "clients" && (
          <section className="flex flex-col items-center justify-center py-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Clients Workspace
            </h2>

            <button
              onClick={() => setShowClientModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition mb-12"
            >
              + Add Client
            </button>

            <div className="w-full grid gap-5">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {client.name}
                    </h3>

                    <p className="text-gray-600">
                      {client.email}
                    </p>

                    <p className="text-gray-500">
                      Company: {client.company || "No Company"}
                    </p>

                    <span className="w-fit px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                      Active Client
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {activeSection === "projects" && (
          <section className="flex flex-col items-center justify-center py-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Projects Workspace
            </h2>

            <button
              onClick={() => setShowProjectModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition mb-12"
            >
              + Create Project
            </button>

            <div className="w-full grid gap-5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {project.title}
                    </h3>

                    <p className="text-gray-600">
                      {project.description}
                    </p>

                    <p className="text-gray-500">
                      Client: {project.client?.name || "No Client"}
                    </p>

                    <p className="text-gray-500">
                      Deadline: {project.deadline}
                    </p>

                    <span className="w-fit px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TASKS SECTION */}
        {activeSection === "tasks" && (
          <section className="flex flex-col items-center justify-center py-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Tasks Workspace
            </h2>

            <button
              onClick={() => setShowTaskModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition mb-12"
            >
              + Create Task
            </button>

            <div className="w-full grid gap-5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {task.title}
                    </h3>

                    <p className="text-gray-500">
                      Project: {task.project?.title}
                    </p>

                    <div className="flex gap-3">
                      <span className="w-fit px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                        {task.status}
                      </span>

                      <span className="w-fit px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() =>
                          updateTaskStatus(task.id, "Todo")
                        }
                        className="px-3 py-2 rounded-lg bg-gray-100 text-sm"
                      >
                        Todo
                      </button>

                      <button
                        onClick={() =>
                          updateTaskStatus(task.id, "In Progress")
                        }
                        className="px-3 py-2 rounded-lg bg-yellow-100 text-sm"
                      >
                        In Progress
                      </button>

                      <button
                        onClick={() =>
                          updateTaskStatus(task.id, "Completed")
                        }
                        className="px-3 py-2 rounded-lg bg-green-100 text-sm"
                      >
                        Completed
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

       
        {/* INVOICES */}
{activeSection === "invoices" && (
  <section className="flex flex-col items-center justify-center py-16">
    <h2 className="text-4xl font-bold text-gray-900 mb-8">
      Invoices Workspace
    </h2>

    <button
      onClick={() => setShowInvoiceModal(true)}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition mb-12"
    >
      + Create Invoice
    </button>

    <div className="w-full grid gap-5">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
        >
          <h3 className="text-2xl font-bold">
            ₹ {invoice.amount}
          </h3>

          <p className="text-gray-500 mt-2">
            Client: {invoice.client?.name}
          </p>

          <p className="text-gray-500">
            Project: {invoice.project?.title}
          </p>

          <p className="text-gray-500">
            Due: {invoice.dueDate}
          </p>

          <div className="flex gap-3 mt-4">
            <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm">
              {invoice.status}
            </span>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={() =>
                updateInvoiceStatus(
                  invoice.id,
                  "Pending"
                )
              }
              className="px-3 py-2 rounded-lg bg-yellow-100 text-sm"
            >
              Pending
            </button>

            <button
              onClick={() =>
                updateInvoiceStatus(
                  invoice.id,
                  "Paid"
                )
              }
              className="px-3 py-2 rounded-lg bg-green-100 text-sm"
            >
              Paid
            </button>

            <button
              onClick={() =>
                deleteInvoice(invoice.id)
              }
              className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

      </main>
    
      {/* CREATE TASK MODAL */}
{showTaskModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">
        Create Task
      </h2>

      <div className="space-y-4">
        {/* TASK TITLE */}
        <input
          type="text"
          placeholder="Task Title"
          value={taskData.title}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              title: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        {/* SELECT PROJECT */}
        <select
          value={taskData.projectId}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              projectId: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="">
            Select Project
          </option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.title}
            </option>
          ))}
        </select>

        {/* TASK STATUS */}
        <select
          value={taskData.status}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              status: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="Todo">
            Todo
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

        {/* TASK PRIORITY */}
        <select
          value={taskData.priority}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              priority: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>
        </select>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={createTask}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Create Task
          </button>

          <button
            onClick={() => setShowTaskModal(false)}
            className="flex-1 border border-gray-300 py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* CREATE INVOICE MODAL */}
{showInvoiceModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">
        Create Invoice
      </h2>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          value={invoiceData.amount}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              amount: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <select
          value={invoiceData.clientId}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              clientId: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="">
            Select Client
          </option>

          {clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
            >
              {client.name}
            </option>
          ))}
        </select>

        <select
          value={invoiceData.projectId}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              projectId: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="">
            Select Project
          </option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.title}
            </option>
          ))}
        </select>

        <select
           value={invoiceData.status}
           onChange={(e) =>
             setInvoiceData({
               ...invoiceData,
               status: e.target.value,
             })
           }
           className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Paid">
            Paid
          </option>
          </select>

        <input
          type="date"
          value={invoiceData.dueDate}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              dueDate: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <div className="flex gap-3">
          <button
            onClick={createInvoice}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl"
          >
            Create
          </button>

          <button
            onClick={() =>
              setShowInvoiceModal(false)
            }
            className="flex-1 border border-gray-300 py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* CREATE PROJECT MODAL */}
{showProjectModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">
        Create Project
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Project Title"
          value={projectData.title}
          onChange={(e) =>
            setProjectData({
              ...projectData,
              title: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <textarea
          placeholder="Project Description"
          value={projectData.description}
          onChange={(e) =>
            setProjectData({
              ...projectData,
              description: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <select
          value={projectData.clientId}
          onChange={(e) =>
            setProjectData({
              ...projectData,
              clientId: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="">Select Client</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={projectData.deadline}
          onChange={(e) =>
            setProjectData({
              ...projectData,
              deadline: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <div className="flex gap-3 pt-2">
          <button
            onClick={createProject}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Create Project
          </button>

          <button
            onClick={() => setShowProjectModal(false)}
            className="flex-1 border border-gray-300 py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* CREATE CLIENT MODAL */}
{showClientModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">
        Add Client
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Client Name"
          value={clientData.name}
          onChange={(e) =>
            setClientData({
              ...clientData,
              name: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <input
          type="email"
          placeholder="Client Email"
          value={clientData.email}
          onChange={(e) =>
            setClientData({
              ...clientData,
              email: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <input
          type="text"
          placeholder="Company Name"
          value={clientData.company}
          onChange={(e) =>
            setClientData({
              ...clientData,
              company: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <div className="flex gap-3 pt-2">
          <button
            onClick={createClient}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Add Client
          </button>

          <button
            onClick={() => setShowClientModal(false)}
            className="flex-1 border border-gray-300 py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{/* DOCUMENTS */}
{activeSection === "documents" && (
  <section className="flex flex-col items-center justify-center py-16 w-full">
    <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
      Documents Workspace
    </h2>

    <button
      onClick={() =>
        setShowDocumentModal(true)
      }
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition mb-12"
    >
      + Upload Document
    </button>

    <div className="w-full grid gap-5">
      {documents.map((document) => (
        <div
          key={document.id}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
        >
          <h3 className="text-2xl font-bold">
            {document.name}
          </h3>

          <a
            href={document.fileUrl}
            target="_blank"
            className="text-indigo-600 mt-3 block"
          >
            Open Document
          </a>

          <button
            onClick={() =>
              deleteDocument(document.id)
            }
            className="mt-5 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </section>
)}

{/* CREATE DOCUMENT MODAL */}
{showDocumentModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">
        Upload Document
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Document Name"
          value={documentData.name}
          onChange={(e) =>
            setDocumentData({
              ...documentData,
              name: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

     
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setDocumentData({
             ...documentData,
             file: e.target.files?.[0] || null,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <div className="flex gap-3">
          <button
            onClick={createDocument}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl"
          >
            Upload
          </button>

          <button
            onClick={() =>
              setShowDocumentModal(false)
            }
            className="flex-1 border border-gray-300 py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* MEETINGS */}
{activeSection === "meetings" && (
  <section className="flex flex-col items-center justify-center py-16 w-full">
    <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
      Meetings Workspace
    </h2>

    <button
      onClick={() => setShowMeetingModal(true)}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition mb-12"
    >
      + Create Meeting
    </button>

   
    <div className="w-full flex flex-col items-center gap-6">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
        >
          <h3 className="text-2xl font-bold">
            {meeting.title}
          </h3>

          <p className="text-gray-500 mt-2">
            Client: {meeting.client?.name}
          </p>

          <p className="text-gray-500">
            Project: {meeting.project?.title}
          </p>

          <p className="text-gray-500">
            Date: {meeting.date}
          </p>

          <p className="text-gray-500">
            Time: {meeting.time}
          </p>

          <a
            href={meeting.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 block mt-2"
          >
            Join Meeting
          </a>

          <p className="text-gray-600 mt-3">
            {meeting.notes}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span
              className={`px-4 py-2 rounded-full text-sm ${
                meeting.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : meeting.status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {meeting.status}
            </span>

            <select
              value={meeting.status}
              onChange={(e) =>
                updateMeetingStatus(meeting.id, e.target.value)
              }
              className="border border-gray-300 rounded-xl px-4 py-2"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => deleteMeeting(meeting.id)}
              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

{/* CREATE MEETING MODAL */}
{showMeetingModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">
        Create Meeting
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Meeting Title"
          value={meetingData.title}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              title: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <select
          value={meetingData.clientId}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              clientId: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="">
            Select Client
          </option>

          {clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
            >
              {client.name}
            </option>
          ))}
        </select>

        <select
          value={meetingData.projectId}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              projectId: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >
          <option value="">
            Select Project
          </option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={meetingData.date}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              date: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <input
          type="time"
          value={meetingData.time}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              time: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <input
          type="text"
          placeholder="Meeting Link"
          value={meetingData.meetingLink}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              meetingLink: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <textarea
          placeholder="Notes"
          value={meetingData.notes}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              notes: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <div className="flex gap-3">
          <button
            onClick={createMeeting}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl"
          >
            Create
          </button>

          <button
            onClick={() =>
              setShowMeetingModal(false)
            }
            className="flex-1 border border-gray-300 py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{activeSection === "analytics" && (
  <section className="flex flex-col items-center py-16 w-full">
    <h2 className="text-4xl font-bold mb-10">
      Analytics Dashboard
    </h2>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-6xl mb-10">

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3>Clients</h3>
        <p className="text-3xl font-bold">
          {analytics.clients}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3>Projects</h3>
        <p className="text-3xl font-bold">
          {analytics.projects}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3>Tasks</h3>
        <p className="text-3xl font-bold">
          {analytics.tasks}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3>Invoices</h3>
        <p className="text-3xl font-bold">
          {analytics.invoices}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3>Meetings</h3>
        <p className="text-3xl font-bold">
          {analytics.meetings}
        </p>
      </div>
    </div>

    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full max-w-4xl h-80 bg-white rounded-2xl shadow p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">
          Revenue Analytics
        </h3>

        <ResponsiveContainer
         width="100%"
         height="100%"
        >
         <BarChart data={revenueData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
         </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full max-w-4xl h-96 bg-white rounded-2xl shadow p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">
           Task Analytics
        </h3>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
           <Pie
            data={taskChartData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
           />
           <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full max-w-4xl h-80 bg-white rounded-2xl shadow p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">
          Project Analytics
        </h3>

        <ResponsiveContainer
         width="100%"
         height="100%"
        >
         <BarChart data={projectChartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

         <Bar dataKey="value" />
         </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full max-w-4xl h-80 bg-white rounded-2xl shadow p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">
           Meeting Analytics
        </h3>

        <ResponsiveContainer
           width="100%"
           height="100%"
        >
         <BarChart data={meetingChartData}>
           <XAxis dataKey="name" />
           <YAxis />
           <Tooltip />

           <Bar dataKey="value" />
         </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full max-w-4xl h-96 bg-white rounded-2xl shadow p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">
         Top Clients
        </h3>

        <ResponsiveContainer
           width="100%"
           height="100%"
        >
         <BarChart data={clientChartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="projects" />
         </BarChart>
        </ResponsiveContainer>
      </div>
      </div>

  </section>
)}

    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5" />

      <span className="font-medium">
        {label}
      </span>
    </div>
  );
}

function WorkflowStep({ label }: { label: string }) {
  return (
    <div className="px-5 py-3 rounded-xl bg-white shadow-sm border border-gray-200">
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-gray-400 text-xl font-bold">
      →
    </span>
  );
}