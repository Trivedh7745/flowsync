"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Receipt } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Plus } from "lucide-react";
import crypto from "crypto";
import { ArrowUpRight } from "lucide-react";
import { generateInvoicePDF } from "@/lib/invoicePdf";
import { buildFinancialSummary } from "@/lib/invoice";
import Image from "next/image";
import {
  Send,
  AlertTriangle,
  CircleDollarSign,
  Ban,
} from "lucide-react";
import {
  X,
  Download,
  Share2,
  ChevronDown,
} from "lucide-react";
import {
    Mail,
    MailCheck,
    SendHorizonal
} from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Briefcase,
  CreditCard,
  FileText,
  Calendar,
  BarChart3,
  Pencil,
  Trash2,
  ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
CheckCircle2,
Clock3,
Circle
} from "lucide-react";
import { LabelList } from "recharts";
import { Cell } from "recharts";
import { Legend } from "recharts";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation"; 
import toast from "react-hot-toast";
import { progress } from "framer-motion/m";


export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const router = useRouter();

  const [showProjectModal, setShowProjectModal] = useState(false);

  const [showClientModal, setShowClientModal] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);

  const [selectedTask, setSelectedTask] =
useState<any>(null);

const [searchTask, setSearchTask] =
useState("");

const [taskSort, setTaskSort] =
useState("Sort By");

const [editingTask, setEditingTask] =
useState<any>(null);

const [editingSubtask,setEditingSubtask] =
useState<number | null>(null);

const [editSubtaskText,setEditSubtaskText] =
useState("");

const [showTaskDrawer, setShowTaskDrawer] =
useState(false);

const [subtasks, setSubtasks] =
useState<any[]>([]);

const [newSubtask, setNewSubtask] =
useState("");

const [activities, setActivities] = useState<any[]>([]);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [invoiceSearch, setInvoiceSearch] = useState("");

const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false);

const [paymentMenu, setPaymentMenu] =
    useState<string | null>(null);

const [fullPaymentMenu, setFullPaymentMenu] = useState(false);

const [editingInvoice, setEditingInvoice] = useState<any>(null);

const [invoiceSort, setInvoiceSort] = useState("Sort By");

const [showDeleteInvoiceModal, setShowDeleteInvoiceModal] =
  useState(false);

const [invoiceToDelete, setInvoiceToDelete] =
  useState<any>(null);

const [isSendingInvoice, setIsSendingInvoice] = useState(false);

const [showShareReceiptModal, setShowShareReceiptModal] =
    useState(false);

const canShareReceipt =
    selectedInvoice?.status === "Paid";

  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);

  const [clients, setClients] = useState<any[]>([]);

  const [editingClient, setEditingClient] = useState<string | null>(null);

  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const [editingProject, setEditingProject] = useState<any>(null);

  const [clientTab, setClientTab] = useState("overview");

  const [searchClient, setSearchClient] = useState("");

  const [searchProject, setSearchProject] =
useState("");

const [projectSort, setProjectSort] =
useState("Sort By");

  const [selectedClient, setSelectedClient] = useState<any>(null);

const [showClientProfile, setShowClientProfile] =
  useState(false);

  const [selectedProject, setSelectedProject] =
useState<any>(null);

const [showProjectDrawer, setShowProjectDrawer] =
useState(false);

const [projectTab, setProjectTab] =
useState("overview");

  const [clientProjectsCount, setClientProjectsCount] = useState(0);

const [clientInvoicesCount, setClientInvoicesCount] = useState(0);

const [clientMeetingsCount, setClientMeetingsCount] = useState(0);

const [clientDocumentsCount, setClientDocumentsCount] = useState(0);

const [projectTasks, setProjectTasks] =
useState<any[]>([]);

const [projectInvoices, setProjectInvoices] =
useState<any[]>([]);

const [selectedProjectRevenue, setSelectedProjectRevenue] = useState(0);

const [projectMeetings, setProjectMeetings] =
useState<any[]>([]);

const [projectDocuments, setProjectDocuments] =
useState<any[]>([]);

const [clientActivities, setClientActivities] = useState<any[]>([]);

const [clientRevenue, setClientRevenue] = useState(0);

const [clientActivity, setClientActivity] = useState<any[]>([]);

  const [sortBy, setSortBy] = useState("Sort By");

  const [tasks, setTasks] = useState<any[]>([]);

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [documents, setDocuments] = useState<any[]>([]);

  const [meetings, setMeetings] = useState<any[]>([]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [editingPayment, setEditingPayment] =
    useState<PaymentSchedule | null>(null);

const [paymentData, setPaymentData] = useState({

    dueDate: "",

    amount: "",

});

function isPendingPayment(invoice: Invoice) {
  return (
    invoice.status === "Sent" ||
    invoice.status === "Partially Paid" ||
    invoice.status === "Overdue"
  );
}

function isPaid(invoice: Invoice) {
  return invoice.status === "Paid";
}

function isDraft(invoice: Invoice) {
  return invoice.status === "Draft";
}

type InvoiceStatus =
  | "Draft"
  | "Sent"
  | "Partially Paid"
  | "Paid"
  | "Overdue"
  | "Cancelled";

interface PaymentSchedule {
  id: string;
  invoiceId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  createdAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string | null;
  dueDate: string | null;
  paidDate: string | null;
  paymentSchedule: boolean;
  emailSent: boolean;
  sentAt?: string | null;
  lastSentAt?: string | null;

  clientId: string;
  projectId: string;
  userId: string;

  client: any;
  project: {
    id: string;
    title: string;
    budget: number;
};

  paymentSchedules: PaymentSchedule[];
}


function calculateInvoiceProgress(invoice: Invoice) {

    const total = Number(
        invoice.project.budget
    );

    let paid = 0;

    if (invoice.paymentSchedule) {

        paid = (invoice.paymentSchedules ?? [])

            .filter(payment => payment.paidDate)

            .reduce(

                (sum, payment) =>

                    sum + Number(payment.amount),

                0

            );

    } else {

        paid = invoice.paidDate
            ? total
            : 0;

    }

    const outstanding =
        Math.max(total - paid, 0);

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (paid / total) * 100
            );

    return {

        total,

        paid,

        outstanding,

        percentage,

    };

}

const projectBudgets =
    Number(selectedInvoice?.project?.budget ?? 0);

const alreadyScheduled =
    selectedInvoice?.paymentSchedules
        ?.filter(payment =>

            editingPayment

                ? payment.id !== editingPayment.id

                : true

        )
        .reduce(

            (sum, payment) =>

                sum + Number(payment.amount),

            0

        ) || 0;

const remainingBudget =
    projectBudgets - alreadyScheduled;

const enteredAmount =
    Number(paymentData.amount || 0);

const exceedsBudget =
    enteredAmount > remainingBudget;


  const [analytics, setAnalytics] = useState({
  clients: 0,
  projects: 0,
  tasks: 0,
  invoices: 0,
  meetings: 0,
  });

  const [user, setUser] = useState<any | null>(null);

  const COLORS = [
  "#10b981", // Paid
  "#f59e0b", // Pending
  "#ef4444", // Overdue
];

const CLIENT_COLORS = [
  "#FBBF24", // Gold for #1 client
  "#7C3AED",
  "#7C3AED",
  "#7C3AED",
  "#7C3AED",
];

  const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const revenueData = months.map((month) => ({
  name: month,
  value: 0,
}));

invoices.forEach((invoice) => {

    if (!invoice.dueDate) return;

    const date = new Date(invoice.dueDate);

    const monthIndex = date.getMonth();

    revenueData[monthIndex].value += Number(
        invoice.amount
    );

});

const selectedInvoices = invoices.filter(
  (invoice:any) =>
    invoice.projectId === selectedProject?.id
);

const projectRevenue =
selectedInvoices.reduce(
  (sum:number, invoice:any) =>
    sum + Number(invoice.amount || 0),
  0
);

const revenuePercentage =
selectedProject?.budget
?
Math.round(
(projectRevenue /
selectedProject.budget) * 100
)
:
0;

const budget = selectedProject?.budget || 0;

const spentPercentage =
budget > 0
?
Math.round(
(projectRevenue / budget) * 100
)
:
0;

  const invoiceChartData = [
  {
    name: "Paid",
    value: invoices.filter(
      invoice =>
        isPaid(invoice)
    ).length,
  },

  {
    name: "Pending",
    value: invoices.filter(
      invoice =>
        isPendingPayment(invoice)
    ).length,
  },

  {
    name: "Overdue",
    value: invoices.filter(
      invoice =>
        invoice.status === "Overdue"
    ).length,
  },
];   

const selectedTasks = tasks.filter(
(task:any)=>
task.projectId===selectedProject?.id
);

const totalTasks = tasks.length;

const completedTasks =
tasks.filter(
  (task:any) => task.progress === 100
).length;

const productivityScore =
totalTasks > 0
?
Math.round(
(completedTasks / totalTasks) * 100
)
: 0;

const selectedProjectTasks = tasks.filter(
  (task:any) =>
    task.projectId === selectedProject?.id
);

const completedProjectTasks =
selectedProjectTasks.filter(
  (task:any) =>
    task.progress === 100
).length;

const selectedProjectProgress =
selectedProjectTasks.length > 0
?
Math.round(

selectedProjectTasks.reduce(
(sum:number, task:any) =>
sum + (task.progress || 0),
0
)

/

selectedProjectTasks.length

)
: 0;

const selectedProjectStatus =
selectedProjectProgress === 0
?
"Not Started"
:
selectedProjectProgress === 100
?
"Completed"
:
"In Progress";

const completedSubtasks =
subtasks.filter(
(sub:any) => sub.completed
).length;

const totalSubtasks =
subtasks.length;

const progress =
totalSubtasks > 0
?
Math.round(
(completedSubtasks / totalSubtasks) * 100
)
: 0;

const taskStatus =
progress === 100
?
"Completed"
:
progress === 0
?
"Not Started"
:
"In Progress";

const daysRemaining = selectedProject?.deadline
  ? Math.ceil(
      (
        new Date(selectedProject.deadline).getTime() -
        Date.now()
      ) /
      (1000 * 60 * 60 * 24)
    )
  : null;

let priority = "No Priority";

if (daysRemaining !== null) {

  if (daysRemaining < 0) {

    priority = "Overdue";

  } else if (daysRemaining <= 3) {

    priority = "High Priority";

  } else if (daysRemaining <= 7) {

    priority = "Medium Priority";

  } else {

    priority = "Low Priority";

  }

}

const filteredInvoices = invoices

.filter((invoice: any) => {

  return (
    (invoice.invoiceNumber || "")
      .toLowerCase()
      .includes(invoiceSearch.toLowerCase())

    ||

    (invoice.client?.name || "")
      .toLowerCase()
      .includes(invoiceSearch.toLowerCase())

  );

})

.sort((a: any, b: any) => {

  switch (invoiceSort) {

    case "Highest":
      return b.amount - a.amount;

    case "Lowest":
      return a.amount - b.amount;

    case "Oldest":
      return (
        new Date(a.issueDate).getTime() -
        new Date(b.issueDate).getTime()
      );

    default:
      return (
        new Date(b.issueDate).getTime() -
        new Date(a.issueDate).getTime()
      );

  }

});

const clientRevenueMap: Record<string, number> = {};

invoices.forEach((invoice) => {

  const clientName =
    invoice.client?.name || "Unknown";

  clientRevenueMap[clientName] =
    (clientRevenueMap[clientName] || 0) +
    Number(invoice.amount);

});

const topClientsData = Object.entries(
  clientRevenueMap
)
  .map(([name, revenue]) => ({
    name,
    revenue,
  }))
  .sort(
    (a, b) =>
      b.revenue - a.revenue
  )
  .slice(0, 5);

const rankedClients = topClientsData.map(
  (client, index) => ({
    ...client,
    name:
      index === 0
        ? `🥇 ${client.name}`
        : index === 1
        ? `🥈 ${client.name}`
        : index === 2
        ? `🥉 ${client.name}`
        : client.name,
  })
);

const handleEditClient = (client: any) => {
  setClientData({
    name: client.name,
    email: client.email,
    company: client.company,
  });

  setEditingClientId(client.id);

  setShowClientModal(true);
};

const openProject = async (project:any) => {

  try {

    setSelectedProject(project);

    setShowProjectDrawer(true);

    const tasksRes = await fetch(
`/api/tasks/project/${project.id}`
);

const invoicesRes = await fetch(
`/api/invoices/project/${project.id}`
);

const meetingsRes = await fetch(
`/api/meetings/project/${project.id}`
);

const documentsRes = await fetch(
`/api/documents/project/${project.id}`
);

const tasks =
await tasksRes.json();

const invoices =
await invoicesRes.json();

const meetings =
await meetingsRes.json();

const documents =
await documentsRes.json();

setProjectTasks(tasks);

setProjectInvoices(invoices);
const revenue = invoices.reduce(
  (sum:number, invoice:any) =>
    sum + Number(invoice.amount || 0),
  0
);
setSelectedProject({
  ...project,
  revenue
});

setSelectedProjectRevenue(revenue);

setProjectMeetings(meetings);

setProjectDocuments(documents);

  } catch (error) {

    console.error(error);

  }

};

const refreshProject = async () => {

  await fetchProjects();

  await fetchTasks();

  if (selectedProject) {

    const updatedProject = projects.find(
      (p:any) => p.id === selectedProject.id
    );

    if (updatedProject) {

      await openProject(updatedProject);

    }

  }

};

  const taskChartData = [
    {
      name: "Todo",
      value: Array.isArray(tasks)
       ? tasks.filter(
        (task:any) => task.status === "Not started"
        ).length
       : 0,
    },
    {
      name: "In Progress",
       value: Array.isArray(tasks)
    ? tasks.filter(
        (task:any) => task.status === "In Progress"
      ).length
    : 0,
    },
    {
      name: "Completed",
       value: Array.isArray(tasks)
    ? tasks.filter(
        (task:any) => task.status === "Completed"
      ).length
    : 0,
    },
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

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    deadline: "",
    clientId: "",
budget:""
  });

  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    company: "",
  });


const [taskData, setTaskData] =
useState({
  title: "",
  description: "",
  status: "Not Started",
  priority: "Medium",
  dueDate: "",
  projectId: "",
});

const [invoiceData, setInvoiceData] = useState({
  projectId: "",
  clientId: "",
  amount: "",
  issueDate: "",
  dueDate: "",
  paymentSchedule: false,
});

const selectedProjectData =
    projects.find(
        project =>
            project.id === invoiceData.projectId
    );

const canEnablePaymentSchedule =
    Number(invoiceData.amount || 0) <
    Number(selectedProjectData?.budget || 0);

const selectedInvoiceProject =
  projects.find(
    (p: any) => p.id === invoiceData.projectId
  );

const projectBudget =
  selectedInvoiceProject?.budget || 0;


  const [documentData, setDocumentData] =
  useState({
    name: "",
    file: null as File | null,
    clientId: "",
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
      value: String(
        invoices.filter(
        isPendingPayment
        ).length
      ),
      icon: CreditCard,
    },
    {
      title: "Tasks Completed",
       value: Array.isArray(tasks)
    ? tasks.filter(
        (task:any) => task.status === "Completed"
      ).length
    : 0,
      icon: BarChart3,
}
  ];

  const fetchProjects = async () => {
    try {
      const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch(
      `/api/projects?userId=${user.id}`
    );

      const data = await res.json();
      console.log("Selected Project:", selectedProject);
      console.log(data);
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClients = async () => {
    try {
      const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch(
      `/api/clients?userId=${user.id}`
    );
      const data = await res.json();
      console.log(data);
      setClients(data);
    } catch (error) {
      console.error(error);
    }
  };

  const openClientProfile = async (client: any) => {

  try {

    setSelectedClient(client);

    setShowClientProfile(true);

    // Projects
    console.log(
  "Fetching:",
  `/api/projects/client/${client.id}`
);
    const projectsRes = await fetch(
      `/api/projects/client/${client.id}`
    );

    const projects = await projectsRes.json();
    console.log("PROJECTS LENGTH:", projects.length);

    setClientProjectsCount(projects.length);
    console.log(
  "SETTING PROJECT COUNT:",
  projects.length
);


    // Invoices
    const invoicesRes = await fetch(
      `/api/invoices/client/${client.id}`
    );

    const invoices = await invoicesRes.json();

    setClientInvoicesCount(invoices.length);


    // Revenue
    const totalRevenue = invoices.reduce(
      (sum: number, invoice: any) =>
        sum + Number(invoice.amount),
      0
    );

    setClientRevenue(totalRevenue);


    // Meetings
    const meetingsRes = await fetch(
      `/api/meetings/client/${client.id}`
    );

    const meetings = await meetingsRes.json();

    setClientMeetingsCount(meetings.length);

    // Documents
    const documentsRes = await fetch(
      `/api/documents/client/${client.id}`
    );

    const documents = await documentsRes.json();

    setClientDocumentsCount(documents.length);

    const activities = [

  ...projects.map((project:any)=>({
    type:"project",
    title:project.title,
    createdAt:project.createdAt
  })),

  ...invoices.map((invoice:any)=>({
    type:"invoice",
    title:invoice.invoiceNumber,
    createdAt:invoice.createdAt
  })),

  ...meetings.map((meeting:any)=>({
    type:"meeting",
    title:meeting.title,
    createdAt:meeting.createdAt
  })),

  ...documents.map((document:any)=>({
    type:"document",
    title:document.name,
    createdAt:document.createdAt
  }))

];
activities.sort(
  (a,b)=>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime()
);
setClientActivities(
  activities.slice(0,10)
);

  } catch (error) {

    console.error(error);

  }

};

  const fetchTasks = async () => {
    try {
      const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch(
      `/api/tasks?userId=${user.id}`
    );

      const data = await res.json();
      if (!Array.isArray(data)) {
  console.error(data);
  setTasks([]);
  return;
}
      const tasksWithProgress =
data.map((task:any) => {

  const completed =
    task.subtasks?.filter(
      (s:any)=>s.completed
    ).length || 0;

  const total =
    task.subtasks?.length || 0;

  const progress =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  return {
    ...task,
    progress,
  };

});

      setTasks(tasksWithProgress);
    } catch (error) {
      console.error(error);
    }
  };

const fetchActivities = async (taskId: string) => {
  try {
    const res = await fetch(`/api/activities?taskId=${taskId}`);

    if (!res.ok) return;

    const data = await res.json();

    setActivities(data);

  } catch (err) {

    console.error(err);

  }
};  

  const fetchSubtasks = async (
  taskId: string
) => {

  const res = await fetch(
    `/api/subtasks?taskId=${taskId}`
  );

  const data = await res.json();

  setSubtasks(data);
};

const toggleSubtask = async (
  subtask:any
) => {

  try {

    await fetch(
      "/api/subtasks",
      {
        method: "PUT",

        headers: {
          "Content-Type":
          "application/json",
        },

        body: JSON.stringify({
          id: subtask.id,

          completed:
          !subtask.completed,
        }),
      }
    );

  await fetchSubtasks(selectedTask.id);

await fetchTasks();

await fetchProjects();

await fetchActivities(selectedTask.id);

  } catch (error) {

    console.error(error);

  }

};

const deleteSubtask =
async (id:string) => {

  try {

    await fetch(
      "/api/subtasks",
      {
        method:"DELETE",

        headers:{
          "Content-Type":
          "application/json",
        },

        body: JSON.stringify({
          id,
        }),
      }
    );

    await fetchSubtasks(selectedTask.id);

await fetchTasks();

await fetchProjects();

await fetchActivities(selectedTask.id);

  } catch(error){

    console.error(error);

  }

};

const updateSubtask = async (
  id:string
) => {

  try {

    await fetch(
      "/api/subtasks",
      {
        method:"PUT",

        headers:{
          "Content-Type":
          "application/json",
        },

        body: JSON.stringify({
          id,
          title:
          editSubtaskText,
        }),
      }
    );

    setEditingSubtask(null);

    await fetchSubtasks(selectedTask.id);

await fetchTasks();

await fetchProjects();

await fetchActivities(selectedTask.id);

  } catch(error){

    console.error(error);

  }

};

  const fetchInvoices = async () => {
    try {
      const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch(
      `/api/invoices?userId=${user.id}`
    );
      const data = await res.json();

if (Array.isArray(data)) {
  setInvoices(data);

if (selectedInvoice) {

    const updatedInvoice = data.find(

        (invoice: Invoice) =>

            invoice.id === selectedInvoice.id

    );

    if (updatedInvoice) {

        setSelectedInvoice(updatedInvoice);

    }

}
} else {
  console.error(data);
  setInvoices([]);
}
    }  catch (error) {
    console.error(error);
    }
  };


  const fetchDocuments = async () => {
   try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch(
      `/api/documents?userId=${user.id}`
    );

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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch(
      `/api/meetings?userId=${user.id}`
    );

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
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/");
        return;
      }

      setUser(authUser);
    };

    checkAuth();
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

useEffect(() => {
  if (!selectedTask) return;

  const latestTask = tasks.find(
    (t: any) => t.id === selectedTask.id
  );

  if (latestTask) {
    setSelectedTask(latestTask);
  }
}, [tasks]);

  
 const createProject = async () => {
  try {
    if (
      !projectData.title ||
      !projectData.clientId
    ) {
      toast.error("Please fill all fields");

      return;
    }
    
    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  toast.error("Please login first");
  return;
}
if (editingProject) {

  const res = await fetch("/api/projects", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id: editingProject.id,
      title: projectData.title,
      description: projectData.description,
      deadline: projectData.deadline,
      clientId: projectData.clientId,
      budget: Number(projectData.budget),
    }),
  });

  if (res.ok) {

    toast.success("Project updated successfully");

    fetchProjects();

    setEditingProject(null);

    setShowProjectModal(false);

    setProjectData({
      title: "",
      description: "",
      deadline: "",
      clientId: "",
      budget: "",
    });

  } else {

    toast.error("Failed to update project");

  }

  return;
}
console.log("PROJECT DATA:", projectData);
console.log("CLIENT ID:", projectData.clientId);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    
      body: JSON.stringify({
    userId: user.id,
    title: projectData.title,
    description: projectData.description,
    deadline: projectData.deadline,
    clientId: projectData.clientId,
    budget: Number(projectData.budget),
    revenue: 0
}),
    });

    if (res.ok) {
      toast.success("Project created successfully");
      fetchProjects();

      setShowProjectModal(false);

      setProjectData({
  title: "",
  description: "",
  deadline: "",
  clientId: "",
  budget: ""
});
    } else {
      const error = await res.json();

      console.log(error);

      toast.error("Failed to create project");
    }
  } catch (error) {
    console.error(error);

    toast.error("Something went wrong");
  }
 };

 const deleteProject = async (id: string) => {
  try {
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (res.ok) {
      toast.success("Project deleted");

      fetchProjects();
    } else {
      toast.error("Failed to delete project");
    }
  } catch (error) {
    console.error(error);

    toast.error("Something went wrong");
  }
 };

 const editProject = (project: any) => {

  setEditingProject(project);
setProjectData({
  title: project.title || "",
  description: project.description || "",

  deadline: project.deadline
    ? new Date(project.deadline)
        .toISOString()
        .split("T")[0]
    : "",

  clientId: project.clientId || "",

  budget: String(project.budget || ""),
});

  setShowProjectModal(true);

};


  const createClient = async () => {
  try {
    if (
      !clientData.name ||
      !clientData.email
    ) {
      toast.error("Please fill all fields");

      return;
    }
    
  const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSION:", session);

  const {
  data: { user },
} = await supabase.auth.getUser();

console.log("USER:", user);
    
   if (!user) {
  toast.error("Please login first");
  return;
}

    let res;

if (editingClientId) {

  res = await fetch(`/api/clients/${editingClientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: clientData.name,
      email: clientData.email,
      company: clientData.company,
    }),
  });

} else {

  res = await fetch("/api/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user?.id,
      name: clientData.name,
      email: clientData.email,
      company: clientData.company,
    }),
  });

}

    if (res.ok) {
        toast.success(editingClientId ? "Client updated successfully" : "Client created successfully");
      fetchClients();

      setShowClientModal(false);

      setClientData({
        name: "",
        email: "",
        company: "",
      });
      setEditingClientId(null);
    } else {
      const error = await res.json();

      console.log(error);

      toast.error(editingClientId ? "Failed to update client" : "Failed to create client");
    }
  } catch (error) {
    console.error(error);

    toast.error("Something went wrong");
  }
};

 const deleteClient = async (id: string) => {
   try {
    const res = await fetch("/api/clients", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (res.ok) {
      toast.success("Client deleted");

      fetchClients();
    } else {
      toast.error("Failed to delete client");
    }
   } catch {
    toast.error("Something went wrong");
   }
 };

const createTask = async () => {
  try {

    if (
      !taskData.title ||
      !taskData.projectId
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (editingTask) {

  const res = await fetch("/api/tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id: editingTask.id,
      title: taskData.title,
      status: taskData.status,
      priority: taskData.priority,
      projectId: taskData.projectId,
      dueDate: taskData.dueDate,
    }),

  });

  if (res.ok) {

    toast.success("Task updated successfully");

    fetchTasks();

    setEditingTask(null);

    setShowTaskModal(false);

    setTaskData({
      title: "",
      description: "",
      status: "Not Started",
      priority: "Medium",
      dueDate: "",
      projectId: "",
    });

  } else {

    toast.error("Failed to update task");

  }

  return;
}

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId: user.id,
        title: taskData.title,
        status: taskData.status,
        priority: taskData.priority,
        projectId: taskData.projectId,
        dueDate: taskData.dueDate,
      }),

    });

    if (res.ok) {

      toast.success("Task created successfully");

      fetchTasks();

      setShowTaskModal(false);

      setEditingTask(null);

      setTaskData({
        title: "",
        description: "",
        status: "Not Started",
        priority: "Medium",
        dueDate: "",
        projectId: "",
      });

    } else {

      const error = await res.json();

      console.log(error);

      toast.error("Failed to create task");

    }

  } catch (error) {

    console.error(error);

    toast.error("Something went wrong");

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
        toast.success("Task deleted successfully");
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  const editTask = (task:any) => {

  setEditingTask(task);

  setTaskData({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "Todo",
    priority: task.priority || "Medium",

    dueDate: task.dueDate
      ? new Date(task.dueDate)
          .toISOString()
          .split("T")[0]
      : "",

    projectId: task.projectId || "",
  });

  setShowTaskModal(true);

};

const openTask = async (
  task:any
) => {

  setSelectedTask(task);
  setShowTaskDrawer(true);

  await fetchSubtasks(task.id);
  await fetchActivities(task.id);

};

const addSubtask = async () => {

  if (
    !newSubtask.trim() ||
    !selectedTask
  ) return;

  try {

    const res = await fetch(
      "/api/subtasks",
      {
        method: "POST",

        headers: {
          "Content-Type":
          "application/json",
        },

        body: JSON.stringify({
          title: newSubtask,
          taskId: selectedTask.id,
        }),
      }
    );

    if (res.ok) {

      setNewSubtask("");

      await fetchSubtasks(selectedTask.id);

await fetchTasks();

await fetchProjects();

await fetchActivities(selectedTask.id);

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
      toast.error("Please fill all fields");

      return;
    }
    
      const {
       data: { user },
      } = await supabase.auth.getUser();

      console.log("USER:", user);
    
      if (!user) {
       toast.error("Please login first");
        return;
      }  
    const res = await fetch("/api/invoices", {

  method: editingInvoice
    ? "PUT"
    : "POST",

  headers: {
    "Content-Type":"application/json",
  },
body: JSON.stringify({

  id: editingInvoice?.id,   // ← Add this

  userId: user?.id,

  projectId: invoiceData.projectId,

  clientId: invoiceData.clientId,

  amount: Number(invoiceData.amount),

  issueDate: invoiceData.issueDate,

  dueDate: invoiceData.dueDate,

  paymentSchedule: invoiceData.paymentSchedule,

  status: editingInvoice
    ? editingInvoice.status
    : "Draft",

})

});

    if (res.ok) {
      toast.success(

editingInvoice

? "Invoice updated successfully"

: "Invoice created successfully"

);
      fetchInvoices();
      refreshProject();

      setShowInvoiceModal(false);
      setEditingInvoice(null);
      setInvoiceData({
  projectId: "",

  clientId: "",

  amount: "",

  issueDate: "",

  dueDate: "",

  paymentSchedule: false,
});
    } else {
      const error = await res.json();

      console.log(error);

      toast.error("Failed to create invoice");
    }
  } catch (error) {
    console.error(error);

    toast.error("Something went wrong");
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

    if (!res.ok) {
      throw new Error("Failed");
    }

    toast.success("Invoice deleted successfully");

    fetchInvoices();

  } catch (error) {

    console.error(error);

    toast.error("Failed to delete invoice");

  }

};

const openInvoice = (invoice: any) => {

  setSelectedInvoice(invoice);

  setShowInvoiceDrawer(true);

};

const editInvoice = (invoice: any) => {

  setEditingInvoice(invoice);

  setInvoiceData({

    projectId: invoice.projectId,

    clientId: invoice.clientId,

    amount: invoice.amount,

    issueDate: invoice.issueDate
      ? invoice.issueDate.split("T")[0]
      : "",

    dueDate: invoice.dueDate
      ? invoice.dueDate.split("T")[0]
      : "",

    paymentSchedule: invoice.paymentSchedule ?? false,

  });

  setShowInvoiceModal(true);

};

const handleTogglePayment = async (
    paymentId: string,
    paid: boolean
) => {
const previousInvoice = selectedInvoice;
if (selectedInvoice) {

    if (selectedInvoice.paymentSchedule) {

        // ============================
        // Existing Payment Schedule Logic
        // ============================

        const optimisticSchedules =
            selectedInvoice.paymentSchedules.map(
                payment =>
                    payment.id === paymentId
                        ? {
                              ...payment,
                              paidDate: paid
                                  ? new Date().toISOString()
                                  : null,
                          }
                        : payment
            );

        const totalPaid =
            optimisticSchedules.reduce(
                (sum, payment) =>
                    payment.paidDate
                        ? sum + Number(payment.amount)
                        : sum,
                0
            );

        const projectBudget =
            Number(selectedInvoice.project.budget);

        const outstanding =
            Math.max(projectBudget - totalPaid, 0);

        let optimisticStatus: InvoiceStatus = "Sent";

        if (totalPaid === 0) {

            optimisticStatus = "Sent";

        } else if (outstanding > 0) {

            optimisticStatus = "Partially Paid";

        } else {

            optimisticStatus = "Paid";

        }

        const optimisticPaidDate =
            optimisticStatus === "Paid"
                ? new Date().toISOString()
                : null;

        const optimisticInvoice = {

            ...selectedInvoice,

            paymentSchedules: optimisticSchedules,

            status: optimisticStatus,

            paidDate: optimisticPaidDate,

        };

        setSelectedInvoice(optimisticInvoice);

        setInvoices(previous =>
            previous.map(invoice =>
                invoice.id === optimisticInvoice.id
                    ? optimisticInvoice
                    : invoice
            )
        );

    } else {

        // ============================
        // Full Payment Logic
        // ============================

     
        const optimisticInvoice: Invoice = {

            ...selectedInvoice,

            paidDate: paid
                ? new Date().toISOString()
                : null,

            status: (
    paid
        ? "Paid"
        : "Sent"
) as InvoiceStatus,

        };

        setSelectedInvoice(optimisticInvoice);

        setInvoices(previous =>
            previous.map(invoice =>
                invoice.id === optimisticInvoice.id
                    ? optimisticInvoice
                    : invoice
            )
        );

    }

}
    try {
        let response: Response;

if (selectedInvoice?.paymentSchedule) {

    response = await fetch(
        "/api/paymentSchedule",
        {

            method: "PATCH",

            headers: {

                "Content-Type": "application/json",

            },

            body: JSON.stringify({

                paymentId,

                paid,

            }),

        }

    );

} else {

    response = await fetch(
        "/api/invoices",
        {

            method: "PATCH",

            headers: {

                "Content-Type": "application/json",

            },

            body: JSON.stringify({

                invoiceId: selectedInvoice?.id,

                paid,

            }),

        }

    );

}
        if (!response.ok) {

    const error = await response.json();
if (previousInvoice) {

    setSelectedInvoice(previousInvoice);

    setInvoices(previous =>

        previous.map(invoice =>

            invoice.id === previousInvoice.id

                ? previousInvoice

                : invoice

        )

    );

}

    toast.error(

        error.error ||

        "Failed to update payment."

    );

    return;

}

const updatedInvoice = await response.json();

setSelectedInvoice(updatedInvoice);
setInvoices(previous =>

    previous.map(invoice =>

        invoice.id === updatedInvoice.id

            ? updatedInvoice

            : invoice

    )

);

await fetchInvoices();

toast.success(
    "Payment updated successfully."
);
    } catch (error) {
if (previousInvoice) {

    setSelectedInvoice(previousInvoice);

    setInvoices(previous =>

        previous.map(invoice =>

            invoice.id === previousInvoice.id

                ? previousInvoice

                : invoice

        )

    );

}

toast.error(
    "Unable to update payment."
);

        console.error(error);

    }

};

const handleSavePayment = async () => {
  if (enteredAmount <= 0) {

    toast.error(
        "Please enter a payment amount."
    );

    return;

}

  if (exceedsBudget) {

    toast.error(

        `⚠ Exceeds remaining budget.
Maximum allowed: ₹${projectBudgets.toLocaleString("en-IN")}`,

        {
            duration: 4000,
        }

    );

    return;

}

    try {

        if (!selectedInvoice) return;

        const response = await fetch(
            "/api/paymentSchedule",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({

                    invoiceId: selectedInvoice.id,

                    dueDate: paymentData.dueDate,

                    amount: Number(paymentData.amount),

                }),

            }
        );
        if (!response.ok) {

    const error = await response.json();

    toast.error(

        error.error ||

        "Unable to create payment."

    );

    return;

}

        await fetchInvoices();
        toast.success("Payment added successfully.");
        setEditingPayment(null);

setPaymentData({

    dueDate: "",

    amount: "",

});

setShowPaymentModal(false);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {

            const res = await fetch(
                `/api/invoices?userId=${user.id}`
            );

            const invoicesData = await res.json();

            const updatedInvoice =
                invoicesData.find(
                    (invoice: Invoice) =>
                        invoice.id === selectedInvoice.id
                );

            if (updatedInvoice) {

                setSelectedInvoice(updatedInvoice);

            }

        }

        setShowPaymentModal(false);

    } catch (error) {

        console.error(error);

    }

};

const handleDownloadInvoice = async () => {
  const toastId = toast.loading("Downloading Invoice...");

    if (!selectedInvoice) return;

    try {

        const response = await fetch(
            `/api/invoices/download?id=${selectedInvoice.id}`
        );

        if (!response.ok) {
            throw new Error("Failed to download invoice.");
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download =
            `${selectedInvoice.invoiceNumber}.pdf`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
    toast.success("Invoice downloaded successfully.", {
    id: toastId,
    icon: <Download className="h-4 w-4" />,
});


    } catch (error) {

        console.error(error);
        toast.error("Failed to download Invoice.", {
    id: toastId,
});


    }

};

const handleDownloadReceipt = async () => {
  const toastId = toast.loading("Downloading receipt...");
  

    if (!selectedInvoice) return;

    const canDownloadReceipt =
        selectedInvoice.paymentSchedule
            ? selectedInvoice.status === "Paid"
            : selectedInvoice.status === "Paid";

    if (!canDownloadReceipt) {

        toast(
            "Receipt will be available after the invoice is fully paid.",
            {
                icon: "ℹ️",
            }
        );

        return;
    }

    try {

    const response = await fetch(
        `/api/invoices/receipt?id=${selectedInvoice.id}`
    );

    if (!response.ok) {
        throw new Error("Failed to generate receipt.");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    const receiptNumber =
    selectedInvoice.invoiceNumber.replace(
        "INV",
        "REC"
    );

link.download =
    `${receiptNumber}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("Receipt downloaded successfully.", {
    id: toastId,
    icon: <Download className="h-4 w-4" />,
});

} catch (error) {

    console.error(error);

    toast.error("Failed to download receipt.", {
    id: toastId,
});

}

};

const getReceiptUrl = () => {

    if (!selectedInvoice) {
        return "";
    }

    const receiptNumber =
        selectedInvoice.invoiceNumber.replace(
            "INV",
            "REC"
        );

    return `https://flowsynchub.co.in/receipt/${receiptNumber}`;

};

const handleCopyReceiptLink = async () => {

    if (!canShareReceipt) {

        toast.error(
            "Receipt sharing will be available after the payment is marked as Paid."
        );

        return;
    }

    try {

        const response = await fetch(
            "/api/invoices/share-receipt",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    invoiceId: selectedInvoice.id,
                }),
            }
        );

        const data = await response.json();

        await navigator.clipboard.writeText(
            data.publicUrl
        );

        toast.success(
            "Receipt link copied.",
            {
                icon: "📋",
            }
        );

    } catch (error) {

        console.error(error);

        toast.error(
            "Unable to copy receipt link."
        );

    }

};

const handleShareReceipt = async () => {

    if (!selectedInvoice) return;
     if (!canShareReceipt) {

        toast.error(
            "Receipt sharing will be available after the payment is marked as Paid."
        );

        return;
    }

    const toastId = toast.loading(
        "Preparing receipt..."
    );

    try {

        const response = await fetch(
            "/api/invoices/share-receipt",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    invoiceId:
                        selectedInvoice.id,
                }),

            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to share receipt."
            );

        }

        toast.success(
            "Receipt Shared successfully.",
            {
                id: toastId,
            }
        );

    } catch (error) {

        console.error(error);

        toast.error(
            "Failed to share receipt.",
            {
                id: toastId,
            }
        );

    }

};

const handleUpdatePayment = async () => {

    if (!editingPayment) return;

    try {

        const response = await fetch(

            "/api/paymentSchedule",

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    paymentId: editingPayment.id,

                    dueDate: paymentData.dueDate,

                    amount: Number(paymentData.amount),

                }),

            }

        );

        if (!response.ok) {

            const error = await response.json();

            toast.error(

                error.error ||

                "Unable to update payment."

            );

            return;

        }

        await fetchInvoices();

        toast.success(

            "Payment updated successfully."

        );

        setEditingPayment(null);

        setShowPaymentModal(false);

        setPaymentData({

            dueDate: "",

            amount: "",

        });

    }

    catch {

        toast.error(

            "Unable to update payment."

        );

    }

};

const resetPaymentModal = () => {

    setEditingPayment(null);

    setPaymentData({

        dueDate: "",

        amount: "",

    });

    setShowPaymentModal(false);

};

const handleDeletePayment = async (
    paymentId: string
) => {

    try {

        const response = await fetch(
            "/api/paymentSchedule",
            {
                method: "DELETE",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    paymentId,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {

            toast.error(
                data.error ||
                "Unable to delete payment."
            );

            return;
        }

        await fetchInvoices();

        toast.success(
            "Installment deleted successfully."
        );

        setPaymentMenu(null);

    } catch {

        toast.error(
            "Unable to delete payment."
        );

    }

};

  const createDocument = async () => {
   try {
    if (
      !documentData.name ||
      !documentData.file ||
      !documentData.clientId
    ) {
      toast.error("Please fill all fields");

      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login first");
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

    formData.append("userId", user.id);
    
    formData.append("clientId", documentData.clientId);

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
        toast.success("Document uploaded successfully");
      await fetchDocuments();

      setShowDocumentModal(false);

      setDocumentData({
        name: "",
        file: null,
        clientId: "",
      });
    } else {
      toast.error("Upload failed");
    }
   } catch (error) {
    console.error(error);

    toast.error("Something went wrong");
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
      toast.success("Document deleted successfully");
      fetchDocuments();
    }
   } catch (error) {
    console.error(error);
    toast.error("Failed to delete document");
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
      toast.error("Please fill all required fields");

      return;
    }
    
      const {
  data: { user },
} = await supabase.auth.getUser();

console.log("USER:", user);
    
   if (!user) {
  toast.error("Please login first");
  return;
   }
    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
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
      toast.success("Meeting created successfully");
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
      toast.error("Failed to create meeting");
    }
  } catch (error) {
    console.error(error);

    toast.error("Something went wrong");
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
        toast.success("Meeting updated successfully");
       fetchMeetings();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update meeting");
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
      toast.success("Meeting deleted successfully");
      fetchMeetings();
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete meeting");
  }
};

  

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
    <aside
     className="
      hidden
      md:flex
      fixed
      top-0
      left-0
      h-screen
      w-72
      border-r
      border-gray-200
      bg-white
      p-6
      flex-col
      z-50
      "
    >  
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
      <main className="flex-1
ml-72
p-8
h-screen
overflow-y-auto
">  
        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <>
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-900">
                Welcome back, {user?.user_metadata?.name || user?.email?.split("@")[0]} 👋
              </h2>

              <p className="text-gray-500 mt-2">
                Manage your clients, projects, invoices, and workflow in one
                place.
              </p>
            </div>

            {/* Stats */}
<section
  className="
  bg-gradient-to-r
  from-indigo-50
  to-purple-50
  dark:from-slate-800
  dark:to-slate-900
  border
  border-border
  rounded-3xl
  p-6
  mb-10
"
>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {stats.map((item) => {
      const Icon = item.icon;

      return (
        <div
          key={item.title}
          className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          p-6
          shadow-sm
          hover:shadow-lg
          transition-all
          "
        >
          <div className="flex items-center justify-between mb-4">
            <Icon className="w-8 h-8 text-indigo-600" />

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
      );
    })}
  </div>
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
              <section className="grid lg:grid-cols-2 gap-6 mb-10">

            {/* Workspace Summary */}
<div
  className="
  bg-gradient-to-r
  from-indigo-50
  to-purple-50
  border
  border-border
  rounded-3xl
  p-8
"
>

  <h3 className="text-2xl font-bold mb-6">
    Workspace Summary
  </h3>

  <div className="space-y-5">

    <div className="flex items-center justify-between">
      <span className="font-medium">
        👥 Clients
      </span>

      <span className="font-bold text-indigo-600">
        {clients.length}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="font-medium">
        📁 Projects
      </span>

      <span className="font-bold text-indigo-600">
        {projects.length}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="font-medium">
        ✅ Tasks
      </span>

      <span className="font-bold text-indigo-600">
        {tasks.length}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="font-medium">
        💳 Invoices
      </span>

      <span className="font-bold text-indigo-600">
        {invoices.length}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="font-medium">
        📅 Meetings
      </span>

      <span className="font-bold text-indigo-600">
        {meetings.length}
      </span>
    </div>

  </div>

</div>

            <div className="
bg-gradient-to-r
from-indigo-50
to-purple-50
border
border-border
rounded-3xl
p-8">

  <h3 className="text-2xl font-bold mb-6">
    Upcoming Meetings
  </h3>

  <div className="space-y-4">

   {meetings.length === 0 ? (

    <div className="text-center py-10">

      <div className="text-5xl mb-3">
        📅
      </div>

      <h3 className="text-xl font-semibold">
        No Meetings Yet
      </h3>

      <p className="text-muted-foreground mt-2">
        Schedule your first meeting
      </p>

    </div>

   ) : (

    meetings.slice(0,3).map((meeting) => (

      <div
        key={meeting.id}
        className="border rounded-xl p-4"
      >

        <div className="font-semibold">
          📅 {meeting.title}
        </div>

        <div className="text-muted-foreground">
          {meeting.date}
        </div>

      </div>

    ))

   )}

  </div>

</div>

</section>

 {/* Pending Invoices + Quick Actions */}
<section className="grid lg:grid-cols-2 gap-6 mb-10">

  {/* Pending Invoices */}
  <div className="
    bg-gradient-to-r
    from-indigo-50
    to-purple-50
    border
    border-border
    rounded-3xl
    p-8
  ">

    <h3 className="text-2xl font-bold mb-6">
      Pending Invoices
    </h3>

    
  <div className="space-y-4">

  {invoices.length === 0 ? (

    <div className="text-center py-10">

      <div className="text-5xl mb-3">
        💳
      </div>

      <h3 className="text-xl font-semibold">
        No Invoices Yet
      </h3>

      <p className="text-muted-foreground mt-2">
        Create your first invoice
      </p>

    </div>

  ) : invoices.filter(isPendingPayment
  ).length === 0 ? (

    <div className="text-center py-10">

      <div className="text-5xl mb-3">
        ✅
      </div>

      <h3 className="text-xl font-semibold">
        No Pending Invoices
      </h3>

      <p className="text-muted-foreground mt-2">
        Great! All invoices are paid
      </p>

    </div>

  ) : (

    invoices
  .filter(isPendingPayment)
  .slice(0,3)
  .map((invoice) => (

      <div
        key={invoice.id}
        className="border rounded-xl p-4"
      >

        <div className="font-semibold">
          💳 {invoice.invoiceNumber}
        </div>

        <div>
          ₹{invoice.amount}
        </div>

      </div>

    ))

  )}

</div>

  </div>

  {/* FlowSync AI */}
<div
className="
    bg-gradient-to-r
    from-indigo-50
    to-purple-50
    border
    border-border
    rounded-3xl
    p-8
  "
>

  <h3 className="text-2xl font-bold mb-6">
    🤖 FlowSync AI
  </h3>

  <div className="space-y-5">

    <div className="flex items-center gap-3">
      <span className="text-2xl">
        📧
      </span>

      <div>

        <p className="font-medium">
          Email → Client Extraction
        </p>

        <p className="text-sm text-muted-foreground">
          Automatically create clients from emails.
        </p>

      </div>

    </div>


    <div className="flex items-center gap-3">

      <span className="text-2xl">
        📁
      </span>

      <div>

        <p className="font-medium">
          Email → Project Detection
        </p>

        <p className="text-sm text-muted-foreground">
          Generate projects from conversations.
        </p>

      </div>

    </div>


    <div className="flex items-center gap-3">

      <span className="text-2xl">
        ✅
      </span>

      <div>

        <p className="font-medium">
          Email → Task Extraction
        </p>

        <p className="text-sm text-muted-foreground">
          Detect tasks automatically.
        </p>

      </div>

    </div>


    <div className="flex items-center gap-3">

      <span className="text-2xl">
        📝
      </span>

      <div>

        <p className="font-medium">
          Meeting Summaries
        </p>

        <p className="text-sm text-muted-foreground">
          Generate notes and action items.
        </p>

      </div>

    </div>


    <div className="mt-8 text-center">

      <div
      className="
      inline-flex
      px-4
      py-2
      rounded-full
      bg-gradient-to-r
      from-indigo-600
      to-purple-600
      text-white
      text-sm
      font-medium
      "
      >
        Coming Soon...
      </div>

    </div>

  </div>

</div>
</section>

</>
)}

        
       

        {/* CLIENTS SECTION */}
        {activeSection === "clients" && (
          <section className="w-full">
            <div className="w-full flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-bold">Clients</h2>
                <p className="text-muted-foreground mt-2">
                  Manage your customer relationships
                </p>
              </div>
              <button
                onClick={() => setShowClientModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium"
              >
                + New Client
              </button>
            </div>
            {clients.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-semibold">No Clients Yet</h3>
                <p className="text-muted-foreground mt-2">
                  Create your first client to get started
                </p>
              </div>
            ) : (
              <>
              
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative flex-1">

  <Search
    size={18}
    className="
    absolute
    left-4
    top-1/2
    -translate-y-1/2
    text-gray-400
    "
  />

  <input
    type="text"
    placeholder="Search clients..."
    value={searchClient}
    onChange={(e) =>
      setSearchClient(e.target.value)
    }
    className="
    w-full
    bg-white
    border
    border-gray-300
    rounded-2xl
    pl-12
    pr-4
    py-3
    outline-none
    shadow-sm
    transition-all
    duration-300
    hover:shadow-md
    focus:border-indigo-500
    focus:ring-4
    focus:ring-indigo-100
    focus:shadow-lg
    "
  />

</div>
                <select
  value={sortBy}
  onChange={(e) =>
    setSortBy(e.target.value)
  }
  className="
  px-6
  py-3
  rounded-2xl
  border
  border-gray-300
  bg-white
  outline-none
  shadow-sm
  transition-all
  duration-300
  hover:shadow-md
  focus:border-indigo-500
  focus:ring-4
  focus:ring-indigo-100
  focus:shadow-lg
  "
>
  <option>Sort By</option>
  <option>A-Z</option>
  <option>Z-A</option>
  <option>Newest</option>
  <option>Oldest</option>
</select>


                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {clients
                    .filter((client) =>
                      client.name
                        .toLowerCase()
                        .includes(searchClient.toLowerCase())
                    )
                    .sort((a, b) => {
                      if (sortBy === "Name A-Z") {
                        return a.name.localeCompare(b.name);
                      }

                      if (sortBy === "Name Z-A") {
                        return b.name.localeCompare(a.name);
                      }

                      return 0;
                    })
                    .map((client) => (
                      <div
                        key={client.id}
                        className="
                          bg-white
                          rounded-3xl
                          border
                          border-gray-200
                          overflow-hidden
                          shadow-sm
                          hover:shadow-xl
                          hover:-translate-y-1
                          transition-all
                          duration-300
                        "
                      >

  {/* Top section */}

  <div className="p-6">

    <div className="flex justify-between items-center">

      {/* Avatar */}

      <div
      className="
      h-14
      w-14
      rounded-full
      bg-indigo-100
      flex
      items-center
      justify-center
      text-xl
      font-bold
      text-indigo-600
      "
      >
        {client.name[0]}
      </div>

      {/* Actions */}

      <div className="flex items-center gap-4 mt-1">

      
      <button
onClick={() => handleEditClient(client)}
>

  <Pencil
  className="
  h-5
  w-5
  flex gap-3 items-center
  text-gray-500
  hover:text-indigo-600
  "
  />

</button>

      <button
onClick={() => deleteClient(client.id)}
>

  <Trash2
  className="
  h-5
  w-5
  text-gray-500
  hover:text-red-500
  "
  />

</button>

      </div>

    </div>


    <h3
    className="
    text-2xl font-bold
    font-bold
    mt-6
    "
    >
      {client.name}
    </h3>

    <p
    className="
    text-gray-500
    mt-2
    "
    >
      {client.company}
    </p>


    <div
    className="
    inline-flex
    mt-5
    px-2.5
    py-1 
    rounded-full
    bg-green-100
    text-green-700
    text-sm
    font-medium
    "
    >
      Active
    </div>

  </div>


  {/* Bottom */}

  <div
  className="
  px-7
  py-6
  flex
  justify-end
  "
  >

  <button
  onClick={() => {

    openClientProfile(client);

  }}
  className="
  text-indigo-600
  font-medium
  hover:translate-x-1
  transition
  "
>
  View Profile →
</button>

  </div>

</div>
              ))}
            </div>
              </>
)}
          </section>
        )}
{/* Add Drawer here */}
{showClientProfile && selectedClient && (
<div className="
fixed
top-0
right-0
h-full
w-[500px]
bg-white
shadow-2xl
z-50
overflow-y-auto
p-8
">

<button
onClick={() =>
setShowClientProfile(false)
}
className="absolute top-6 right-6"
>
✕
</button>

<h1 className="text-4xl font-bold">
{selectedClient.name}
</h1>

<p className="text-gray-500 mt-2">
{selectedClient.company}
</p>

<div className="flex gap-8 mt-8 border-b pb-4">

<button
onClick={() =>
setClientTab("overview")
}
className={`font-medium ${
clientTab === "overview"
? "text-indigo-600 border-b-2 border-indigo-600 pb-2"
: "text-gray-500"
}`}
>
Overview
</button>

<button
onClick={() =>
setClientTab("activity")
}
className={`font-medium ${
clientTab === "activity"
? "text-indigo-600 border-b-2 border-indigo-600 pb-2"
: "text-gray-500"
}`}
>
Activity
</button>

</div>

{clientTab === "overview" && (
  <div>
    <div className="grid grid-cols-2 gap-4 mt-8">
      <div className="bg-gray-50 rounded-2xl p-5">
        <div className="text-3xl font-bold">{clientProjectsCount}</div>
        <div className="text-gray-500">Projects</div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5">
        <div className="text-3xl font-bold">{clientInvoicesCount}</div>
        <div className="text-gray-500">Invoices</div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5">
        <div className="text-3xl font-bold">{clientMeetingsCount}</div>
        <div className="text-gray-500">Meetings</div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5">
        <div className="text-3xl font-bold">{clientDocumentsCount}</div>
        <div className="text-gray-500">Documents</div>
      </div>
    </div>

    <div className="mt-8 bg-gray-50 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-5">Client Details</h3>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div>{selectedClient.email}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Company</div>
          <div>{selectedClient.company}</div>
        </div>
      </div>
    </div>

    <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6">
      <h3 className="text-xl font-bold">Revenue Summary</h3>
      <div className="text-4xl font-bold mt-4">₹{clientRevenue}</div>
      <p className="mt-2">Lifetime value from this client</p>
    </div>
  </div>
)}

{clientTab==="activity" && (

<div className="space-y-4 mt-8">

<h2 className="text-2xl font-bold">
Recent Activity
</h2>
{
clientActivities.length === 0 ? (

<div
className="
bg-gray-50
rounded-2xl
p-8
border
border-gray-100
text-center
"
>

<h3 className="text-lg font-semibold text-gray-700">
No Activities Found
</h3>

<p className="text-gray-500 mt-2">
This client doesn't have any recent activities yet.
</p>

</div>

) : (

clientActivities.map((activity,index)=>(

<div
key={index}
className="
bg-gray-50
rounded-2xl
p-5
border
border-gray-100
"
>

<div className="font-semibold">

{activity.type==="project" &&
`📁 Project: ${activity.title}`}

{activity.type==="invoice" &&
`🧾 Invoice: ${activity.title}`}

{activity.type==="meeting" &&
`📅 Meeting: ${activity.title}`}

{activity.type==="document" &&
`📄 Document: ${activity.title}`}

</div>

<p className="text-sm text-gray-500 mt-1">

{new Date(activity.createdAt)
.toLocaleString()}

</p>

</div>

))

)
}

</div>

)}

</div>
)}



        {/* PROJECTS SECTION */}
{activeSection === "projects" && (
  <section className="w-full">

    {/* Header */}
    <div className="w-full flex justify-between items-center mb-8">
      <div>
        <h2 className="text-4xl font-bold">
          Projects
        </h2>

        <p className="text-muted-foreground mt-2">
          Track and manage your active projects
        </p>
      </div>

    <button
  onClick={() => {

    setEditingProject(null);

    setProjectData({
      title: "",
      description: "",
      deadline: "",
      clientId: "",
      budget: "",
    });

    setShowProjectModal(true);

  }}

  className="
  px-6
  py-3
  rounded-2xl
  font-semibold
  text-white
  bg-gradient-to-r
  from-indigo-600
  to-violet-600
  hover:from-indigo-700
  hover:to-violet-700
  shadow-lg
  transition
  "
>
  + New Project
</button>
    </div>

    {/* Empty State */}
    {projects.length === 0 ? (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">
          📁
        </div>

        <h3 className="text-2xl font-semibold">
          No Projects Yet
        </h3>

        <p className="text-muted-foreground mt-2">
          Create your first project to get started
        </p>
      </div>
    ) : (
      <>
<div className="flex items-center gap-2 mb-8">
  <div className="relative flex-[8]">

<Search
    size={18}
    className="
    absolute
    left-4
    top-1/2
    -translate-y-1/2
    text-gray-400
    "
  />
  <input
    type="text"
    placeholder="Search projects..."
    value={searchProject}
    onChange={(e)=>
      setSearchProject(e.target.value)
    }
    className="
w-full
bg-white
border
border-gray-200
rounded-2xl
pl-12
pr-4
py-3
shadow-sm
transition-all
duration-300
hover:shadow-md
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-100
focus:shadow-lg
outline-none
"
  />
  </div>
 
 <select
value={projectSort}
onChange={(e) =>
  setProjectSort(e.target.value)
}
className="
flex-[1.3]
px-5
py-3
rounded-2xl
border
border-gray-300
bg-white
outline-none
shadow-sm
transition-all
duration-300
hover:shadow-md
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-100
focus:shadow-lg
"
>
  <option>Sort By</option>
  <option>Newest</option>
  <option>Oldest</option>
  <option>A-Z</option>
  <option>Z-A</option>
  <option>Budget High-Low</option>
  <option>Budget Low-High</option>
</select>

</div>
      <div className="grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">


        {
[...projects]

.filter((project:any)=>
project.title
.toLowerCase()
.includes(
searchProject.toLowerCase()
)
)

.sort((a:any,b:any)=>{

if(projectSort==="A-Z")
return a.title.localeCompare(b.title);

if(projectSort==="Z-A")
return b.title.localeCompare(a.title);

if(projectSort==="Budget High-Low")
return b.budget-a.budget;

if(projectSort==="Budget Low-High")
return a.budget-b.budget;

if(projectSort==="Oldest")
return (
new Date(a.createdAt).getTime()
-
new Date(b.createdAt).getTime()
);

if (projectSort === "Newest") {
  return (
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime()
  );
}

return 0;

})

.map((project)=>{
          console.log(
  project.title,
  project.revenue,
  project.invoices
); 

const projectTasks = tasks.filter(
  (task:any) =>
    task.projectId === project.id
);

const projectProgress =
projectTasks.length > 0
?
Math.round(

projectTasks.reduce(
(sum:number, task:any) =>
sum + (task.progress || 0),
0
)

/

projectTasks.length

)
: 0;

const projectStatus =
projectProgress === 0
?
"Not Started"
:
projectProgress === 100
?
"Completed"
:
"In Progress";

const selectedInvoices = invoices.filter(
  (invoice:any) =>
    invoice.projectId === selectedProject?.id
);

const projectRevenue =
  selectedInvoices.reduce(
    (sum:number, invoice:any) =>
      sum + Number(invoice.amount || 0),
    0
  );  

 return(

         <div
  key={project.id}
  className="
bg-white
rounded-3xl
border
border-gray-100
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
p-6
flex
flex-col
"
>
  {/* Header */}
 <div className="flex items-center justify-between">

  <div
    className="
    w-12 h-12
    rounded-2xl
    bg-indigo-100
    flex
    items-center
    justify-center
    text-xl
    "
  >
    📁
  </div>

  <div className="flex gap-4">

    <button
      onClick={() => editProject(project)}
      className="
      text-gray-400
      hover:text-indigo-600
      transition
      "
    >
      <Pencil size={18}/>
    </button>

    <button
      onClick={() => deleteProject(project.id)}
      className="
      text-gray-400
      hover:text-red-600
      transition
      "
    >
      <Trash2 size={18}/>
    </button>

  </div>

</div>

  {/* Project Name */}
  <h3 className="text-xl font-bold mt-5">
    {project.title}
  </h3>

  {/* Client */}
  <p className="text-gray-500 mt-1">
    {project.client?.name}
  </p>

  {/* Progress */}
  <div className="mt-4">

    <div className="flex justify-between mb-2">
      <span className="text-sm text-gray-500">
        Progress
      </span>

      <span className="text-sm font-medium">
        {
projectProgress === 100
?
"Project Completed"
:
`${projectProgress}%`
}
      </span>
    </div>

    <div className="h-2 bg-gray-100 rounded-full">
<div
className={`
h-2 rounded-full
${
projectProgress === 100
?
"bg-green-500"
:
"bg-indigo-600"
}
`}
style={{
width:`${projectProgress}%`
}}
></div>

    </div>

  </div>

  {/* Footer */}
  <div className="mt-6 space-y-3">

    <div className="flex justify-between text-sm">

      <span className="text-gray-500">
        Deadline
      </span>

      <span>
        {project.deadline
  ? new Date(project.deadline).toLocaleDateString()
  : "Not Set"}
      </span>

    </div>

    <div className="flex justify-between text-sm">

      <span className="text-gray-500">
        Revenue
      </span>

      <span className="font-semibold text-green-600">
        ₹{
project.invoices?.reduce(
(sum:number, invoice:any) =>
sum + Number(invoice.amount || 0),
0
)
}
      </span>

    </div>

  </div>

  <div className="mt-6 flex items-center justify-between">
    <span
className={`
px-3 py-1 rounded-full text-xs font-medium
${
projectStatus === "Completed"
?
"bg-green-100 text-green-700"
:
projectStatus === "Not Started"
?
"bg-gray-100 text-gray-600"
:
"bg-blue-100 text-blue-700"
}
`}
>
{projectStatus}
</span>

<button
onClick={() => openProject(project)}
className="
text-indigo-600
font-medium
hover:translate-x-1
transition
"
>
View Project →
</button>
</div>

</div>
 );

})}

      </div>
      </>

    )}

  </section>
)}

{showProjectDrawer && (
  <div
    className="
      fixed
top-0
right-0
h-full
w-[500px]
bg-white
shadow-2xl
z-50
overflow-y-auto
p-8
">
    <div className="flex justify-between">
      <div>
        <h1 className="text-4xl font-bold">
          {selectedProject?.title}
        </h1>

        <p className="text-gray-500 mt-2">
          Client: {selectedProject?.client?.name}
        </p>
      </div>

      <button
        onClick={() => setShowProjectDrawer(false)}
        className="
      h-10
      w-10
      rounded-xl
      flex
      items-center
      justify-center
      hover:bg-gray-100
      transition
      "
>
<X
        size={22}
        className="text-gray-500"
      />
      </button>
    </div>

    <div className="flex gap-10 mt-10 border-b">
      <button
        onClick={() => setProjectTab("overview")}
        className={
          projectTab === "overview"
            ? "text-indigo-600 border-b-2 border-indigo-600 pb-3"
            : "pb-3"
        }
      >
        Overview
      </button>

      <button
        onClick={() => setProjectTab("tasks")}
        className={
          projectTab === "tasks"
            ? "text-indigo-600 border-b-2 border-indigo-600 pb-3"
            : "pb-3"
        }
      >
        Tasks
      </button>
    </div>

    {projectTab === "overview" && (
      <>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-gray-50 rounded-2xl p-5">
            <h1 className="text-3xl font-bold">
              {tasks.filter(
  (task:any) =>
    task.projectId === selectedProject?.id
).length}
            </h1>
            <p className="text-gray-500">Tasks</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h1 className="text-3xl font-bold">
              {invoices.filter(
  (invoice:any) =>
    invoice.projectId === selectedProject?.id
).length}
            </h1>
            <p className="text-gray-500">Invoices</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h1 className="text-3xl font-bold">
              {meetings.filter(
(meeting:any)=>
meeting.projectId===selectedProject?.id
).length}
            </h1>
            <p className="text-gray-500">Meetings</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h1 className="text-3xl font-bold">
              {documents.filter(
  (document:any) =>
    document.projectId === selectedProject?.id
).length}
            </h1>
            <p className="text-gray-500">Documents</p>
          </div>
        </div>

        {/* Progress + Revenue */}
<div className="grid grid-cols-2 gap-4 mt-8">

  {/* Progress Card */}
  <div className="bg-gray-50 rounded-3xl p-6">

    <h2 className="font-semibold">
      Progress
    </h2>

    <div className="flex justify-center mt-6">

      <div className={`
relative
w-28
h-28
rounded-full
border-[10px]
flex
items-center
justify-center
${
selectedProjectProgress >= 80
? "border-green-500"
: selectedProjectProgress >= 50
? "border-yellow-500"
: "border-red-500"
}
`}>

        <h1 className="text-3xl font-bold">
          {selectedProjectProgress}%
        </h1>

      </div>

    </div>

<div className="mt-5 text-center">

  <p className="text-sm text-gray-500">
    Completed Tasks
  </p>

  <h3 className="text-xl font-bold mt-1">

  {completedProjectTasks}

  <span className="text-gray-500 font-normal">
    {" "}of{" "}
  </span>

  {selectedProjectTasks.length}

</h3>

</div>

  </div>

  {/* Revenue Card */}
  <div className="bg-gray-50 rounded-3xl p-6">

    <h2 className="font-semibold">
      Revenue
    </h2>

    <h1 className="text-4xl font-bold text-green-600 mt-8">

      ₹{projectRevenue}

    </h1>

      <p
className={`
mt-4
${
revenuePercentage >= 80
?
"text-green-500"
:
revenuePercentage >= 50
?
"text-yellow-500"
:
"text-red-500"
}
`}
>

{revenuePercentage}% of budget achieved

</p>

    <div className="mt-8 h-12 flex items-end gap-1">

      <div className="w-3 h-4 bg-green-300 rounded"></div>
      <div className="w-3 h-6 bg-green-400 rounded"></div>
      <div className="w-3 h-5 bg-green-300 rounded"></div>
      <div className="w-3 h-8 bg-green-500 rounded"></div>
      <div className="w-3 h-6 bg-green-400 rounded"></div>
      <div className="w-3 h-10 bg-green-600 rounded"></div>

    </div>

  </div>

</div>

{/* Deadline + Status */}
<div className="grid grid-cols-2 gap-4 mt-4">

  {/* Deadline */}
  <div className="
bg-gray-50
rounded-3xl
p-6
min-h-[220px]
flex
flex-col
justify-between
">

    <h2 className="font-semibold">
      Deadline
    </h2>

    <h1 className="text-3xl font-bold mt-5">

      {
        selectedProject?.deadline
          ? new Date(selectedProject.deadline).toLocaleDateString()
          : "Not Set"
      }

    </h1>

    <p
className={`
text-sm mt-6 font-medium
${
daysRemaining === null
?
"text-gray-500"

: daysRemaining < 0
?
"text-red-600"

: daysRemaining <= 3
?
"text-red-500"

: daysRemaining <= 7
?
"text-yellow-600"

:
"text-green-600"
}
`}
>
{
daysRemaining === null
?
"No Deadline"

: daysRemaining < 0
?
"Deadline is Over"

: daysRemaining === 0
?
"Due Today"

: daysRemaining === 1
?
"Due Tomorrow"

:
`Due in ${daysRemaining} days`
}


</p>
<div className="mt-10">
    <span
    className={`
inline-block
px-3
py-1
rounded-full
text-sm
${
priority === "Overdue"
? "bg-red-200 text-red-700"

: priority === "High Priority"
? "bg-red-100 text-red-600"

: priority === "Medium Priority"
? "bg-yellow-100 text-yellow-600"

: priority === "Low Priority"
? "bg-green-100 text-green-600"

: "bg-gray-100 text-gray-600"
}
`}
    >
      
{
priority === "Overdue"
?
"🔴 Overdue"

: priority === "High Priority"
?
"🔴 High Priority"

: priority === "Medium Priority"
?
"🟡 Medium Priority"

: priority === "Low Priority"
?
"🟢 Low Priority"

:
"⚪ No Priority"
}

    </span>
    </div>

  </div>

  {/* Status */}
  <div className="bg-gray-50 rounded-3xl p-6">

    <h2 className="font-semibold">
      Status
    </h2>

  <div className="flex items-center justify-center h-full">

<span
className={`
flex
items-center
gap-2
px-5
py-3
rounded-full
text-sm
font-medium
${
selectedProjectProgress === 100
? "bg-green-100 text-green-700"
: selectedProjectTasks.length === 0
? "bg-gray-100 text-gray-600"
: "bg-blue-100 text-blue-700"
}
`}
>

{
selectedProjectProgress === 100
?
<>
<CheckCircle2 size={16}/>
Completed
</>
:
selectedProjectTasks.length === 0
?
<>
<Circle size={16}/>
Not Started
</>
:
<>
<Clock3 size={16}/>
In Progress
</>
}

</span>

</div>
</div>

</div>
{/* Description Card */}
<div className="bg-gray-50 rounded-3xl p-6 mt-4">

  <h2 className="font-semibold mb-4">
    Project Description
  </h2>

  <p className="text-gray-600 leading-7">

    {
      selectedProject?.description ||
      "No description available"
    }

  </p>

</div>
<div className="grid grid-cols-2 gap-4 mt-6 items-stretch">
  {/* Client Details */}
<div className="bg-gray-50 rounded-3xl p-6 min-h-[220px]">

  <h2 className="font-semibold">
    Client Details
  </h2>

 <div className="flex items-center gap-3 mt-6">

    {/* Text */}
    <div className="flex-1 min-w-0">

        <h3 className="font-bold text-lg truncate">
            {selectedProject?.client?.name}
        </h3>

        <p className="text-gray-500 text-sm truncate">
            {selectedProject?.client?.email}
        </p>

        <button className="text-indigo-600 mt-5 font-medium hover:translate-x-1 transition">
            View Client →
        </button>

    </div>

</div>

</div>

{/* Budget Card */}
<div className="bg-gray-50 rounded-3xl p-6 min-h-[220px]">

  <h2 className="font-semibold">
    Budget
  </h2>

  <h1 className="text-3xl font-bold mt-6">

    ₹{selectedProject?.budget || 0}

  </h1>

  <p className="text-gray-500 mt-2">
    Project Budget
  </p>

  <div className="w-full h-2 bg-gray-200 rounded-full mt-8">

    <div
      className="h-2 bg-green-500 rounded-full"
      style={{
width: `${spentPercentage}%`
}}
    ></div>

  </div>
  <div className="mt-4">

  <div className="flex justify-between text-sm text-gray-500">

    <span>
      ₹{projectRevenue} used
    </span>

    <span>
      {spentPercentage}% utilized
    </span>

  </div>

</div>

</div>

</div>
      </>
    )}


{projectTab === "tasks" && (

<section className="mt-8">

<h2 className="text-3xl font-bold mb-8">
Recent Tasks
</h2>

<div className="space-y-5">

{
projectTasks.length === 0 ? (

<div className="bg-gray-50 rounded-3xl p-8 text-center">

<p className="text-gray-500">
No tasks found
</p>

</div>

) : (

projectTasks.map((task:any) => (

<div
key={task.id}
className="
bg-gray-50
rounded-3xl
p-6
"
>

<div className="flex justify-between items-start">

<div>

<h3 className="font-semibold text-lg">
{task.title}
</h3>

<p className="text-gray-500 text-sm mt-2">
{task.priority} Priority
</p>

<p className="text-gray-400 text-sm mt-4">
{
new Date(
task.createdAt
).toLocaleString()
}
</p>

</div>

<div>

<span
className={`
px-4
py-2
rounded-full
text-sm
font-medium
${
task.status === "Completed"
?
"bg-green-100 text-green-600"
:
task.status === "In Progress"
?
"bg-blue-100 text-blue-600"
:
"bg-red-100 text-red-600"
}
`}
>

{task.status}

</span>

</div>

</div>

</div>

))

)

}

</div>

</section>

)}
  </div>
)}

        {/* TASKS SECTION */}
        {activeSection === "tasks" && (
          <section className="w-full">
            <div className="w-full flex justify-between items-center mb-8">
  <div>
    <h2 className="text-4xl font-bold">
      Tasks
    </h2>

    <p className="text-gray-500 mt-2">
       Manage and track all your tasks
    </p>
  </div>

  <button
onClick={() => {

  setEditingTask(null);

  setTaskData({
    title: "",
    description: "",
    status: "Not Started",
    priority: "Medium",
    dueDate: "",
    projectId: "",
  });

  setShowTaskModal(true);

}}
className="
  px-6
  py-3
  rounded-2xl
  font-semibold
  text-white
  bg-gradient-to-r
  from-indigo-600
  to-violet-600
  hover:from-indigo-700
  hover:to-violet-700
  shadow-lg
  transition
  "
>
+ New Task
</button>
</div>

           {tasks.length === 0 ? (
  <div className="text-center py-20">
    <div className="text-6xl mb-4">
      ✅
    </div>

    <h3 className="text-2xl font-semibold">
      No Tasks Yet
    </h3>

    <p className="text-muted-foreground mt-2">
      Create your first task
    </p>
  </div>
) : (
  <>
  <div className="flex gap-4 mb-8">
  <div className="relative flex-[8]">

<Search
size={18}
className="
absolute
left-4
top-1/2
-transform
-translate-y-1/2
text-gray-400
"
/>

<input
type="text"
placeholder="Search tasks..."
value={searchTask}
onChange={(e)=>
setSearchTask(e.target.value)
}
className="
w-full
bg-white
border
border-gray-300
rounded-2xl
pl-12
pr-4
py-3
outline-none
shadow-sm
transition-all
duration-300
hover:shadow-md
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-100
focus:shadow-lg
"
/>

</div>

<select
value={taskSort}
onChange={(e)=>
setTaskSort(e.target.value)
}
className="
flex-[1.3]
px-5
py-3
rounded-2xl
border
border-gray-300
bg-white
outline-none
shadow-sm
transition-all
duration-300
hover:shadow-md
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-100
focus:shadow-lg
"
>
<option>Sort By</option>
<option>Newest</option>
<option>Oldest</option>
<option>A-Z</option>
<option>Z-A</option>
<option>High Priority</option>
<option>Low Priority</option>
</select>
</div>

<div
className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
"
>

{
[...tasks]

.filter((task:any)=>
task.title
.toLowerCase()
.includes(
searchTask.toLowerCase()
)
)

.sort((a:any,b:any)=>{

if(taskSort==="A-Z")
return a.title.localeCompare(b.title);

if(taskSort==="Z-A")
return b.title.localeCompare(a.title);

if(taskSort==="High Priority")
return a.priority.localeCompare(b.priority);

if(taskSort==="Low Priority")
return b.priority.localeCompare(a.priority);

if(taskSort==="Oldest")
return (
new Date(a.createdAt).getTime()
-
new Date(b.createdAt).getTime()
);

if(taskSort==="Newest")
return (
new Date(b.createdAt).getTime()
-
new Date(a.createdAt).getTime()
);

return 0;

})

.map((task:any)=>{
  const completedSubtasks =
task.subtasks?.filter(
(sub:any)=>sub.completed
).length || 0;

const totalSubtasks =
task.subtasks?.length || 0;

const progress =
totalSubtasks > 0
?
Math.round(
(completedSubtasks / totalSubtasks) * 100
)
: 0;

const taskStatus =
progress === 100
?
"Completed"
:
progress === 0
?
"Not Started"
:
"In Progress";

return (
<div
key={task.id}
className="
bg-white
rounded-3xl
border
border-gray-100
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
p-6
flex
flex-col
"
>

{/* Header */}

<div className="flex items-center justify-between">

<div
className="
w-12 h-12
rounded-2xl
bg-indigo-100
flex
items-center
justify-center
text-xl
"
>
📋
</div>

<div className="flex gap-3">

<button
onClick={() => editTask(task)}
className="
text-gray-400
hover:text-indigo-600
transition
"
>
<Pencil size={18}/>
</button>

<button
onClick={() => deleteTask(task.id)}
className="
text-gray-400
hover:text-red-500
transition
"
>
<Trash2 size={18}/>
</button>

</div>

</div>

{/* Task Title */}

<h3 className="text-2xl font-bold mt-5">
{task.title}
</h3>

{/* Project */}

<p className="text-gray-500 mt-1">
{task.project?.title || "No Project"}
</p>

{/* Priority + Status */}

<div className="flex gap-3 mt-5">

<span
className={`
px-3 py-1 rounded-full text-xs font-medium
${
task.priority==="High"
?
"bg-red-100 text-red-600"
:
task.priority==="Medium"
?
"bg-yellow-100 text-yellow-700"
:
"bg-green-100 text-green-600"
}
`}
>
{task.priority}
</span>

<span
className={`
px-3 py-1 rounded-full text-xs font-medium
${
taskStatus==="Completed"
?
"bg-green-100 text-green-700"
:
taskStatus==="In Progress"
?
"bg-blue-100 text-blue-700"
:
"bg-gray-100 text-gray-600"
}
`}
>
{taskStatus}
</span>

</div>

{/* Due Date */}

<div className="mt-5">

<p className="text-gray-500 text-sm">

📅 Due:

{
task.dueDate
?
new Date(task.dueDate)
.toLocaleDateString()
:
"Not Set"
}

</p>

</div>

{/* Footer */}


<div className="mt-auto pt-6 flex justify-end">
<button

onClick={() => openTask(task)}

className="
text-indigo-600
font-medium
hover:translate-x-1
transition
"
>

View Task →

</button>

</div>

</div>

);

})

}

</div>
            </>
)}
          </section>
        )}

{showTaskDrawer && selectedTask && (

  <>

{(() => {

const priorityConfig =
selectedTask.priority === "High"
? {
    icon: "🔥",
    title: "High Priority",
    subtitle: "Requires immediate attention",
    bg: "bg-red-100",
    text: "text-red-600",
  }
: selectedTask.priority === "Medium"
? {
    icon: "⚡",
    title: "Medium Priority",
    subtitle: "Important but not urgent",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  }
: {
    icon: "🌿",
    title: "Low Priority",
    subtitle: "Can be completed later",
    bg: "bg-green-100",
    text: "text-green-600",
  };

const today = new Date();

const dueDate =
selectedTask?.dueDate
?
new Date(selectedTask.dueDate)
:
null;

const daysLeft =
dueDate
?
Math.ceil(
(
dueDate.getTime()
-
today.getTime()
)
/
(1000*60*60*24)
)
:
null;  

return (

<div
className="
fixed
top-0
right-0
h-screen
w-[500px]
max-w-2xl
bg-white
shadow-2xl
z-50
overflow-y-auto
p-8
"
>
  <div className="flex justify-between items-start">
    <div className="flex gap-4">

    <div
      className="
      w-14
      h-14
      rounded-2xl
      bg-indigo-100
      flex
      items-center
      justify-center
      text-2xl
      "
    >
      📋
    </div>

<div>

<h2 className="text-3xl font-bold">

{selectedTask.title}

</h2>
<div className="flex items-center gap-3 mt-3">

  <span
    className={`
      px-3 py-1 rounded-full text-xs font-medium
      ${
        selectedTask.priority === "High"
          ? "bg-red-100 text-red-600"
          : selectedTask.priority === "Medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-600"
      }
    `}
  >
    {selectedTask.priority}
  </span>

  <span
    className={`
      px-3 py-1 rounded-full text-xs font-medium
      ${
        taskStatus === "Completed"
          ? "bg-green-100 text-green-700"
          : taskStatus === "In Progress"
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-700"
      }
    `}
  >
    {taskStatus}
    
  </span>

</div>

</div>
</div>

<button
onClick={() =>
setShowTaskDrawer(false)
}
className="
      h-10
      w-10
      rounded-xl
      flex
      items-center
      justify-center
      hover:bg-gray-100
      transition
      "
>
<X
        size={22}
        className="text-gray-500"
      />

</button>

</div>
<div
className="
bg-gray-50
rounded-2xl
p-6
mt-8
"
>
<div className="flex items-center gap-2 mb-4">
    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
        📝
    </div>

    <div>
        <h3 className="font-semibold">
            Description
        </h3>

        <p className="text-gray-600 leading-7">
  {selectedTask.description?.trim()
    ? selectedTask.description
    : "No description"}
</p>
    </div>
</div>
</div>
<div
className="
grid
grid-cols-2
gap-4
mt-6
"
>
<div className="bg-gray-50 rounded-2xl p-6">
  <div className="flex items-center gap-3 mb-4">

<div
    className="
    w-12
    h-12
    rounded-2xl
    bg-indigo-100
    flex
    items-center
    justify-center
    text-xl
    "
  >
    📁
  </div>

  <div>

    <p className="text-sm text-gray-500">
      Project
    </p>

    <h3 className="font-bold text-lg">
      {selectedTask.project?.title}
    </h3>

    <p className="text-xs text-gray-400 mt-1">
      Active Workspace
    </p>

  </div>
  </div>


</div>

<div className="bg-gray-50 rounded-2xl p-6">

<div className="flex items-center gap-4">

  <div
    className={`
      w-12
      h-12
      rounded-2xl
      flex
      items-center
      justify-center
      text-2xl
      ${priorityConfig.bg}
    `}
  >
    {priorityConfig.icon}
  </div>

  <div>

    <p className="text-sm text-gray-500">
      Priority
    </p>

    <h3
      className={`
        text-lg
        font-bold
        ${priorityConfig.text}
      `}
    >
      {priorityConfig.title}
    </h3>

    <p className="text-xs text-gray-400 mt-1">
      {priorityConfig.subtitle}
    </p>

  </div>

</div>

</div>

<div className="bg-gray-50 rounded-2xl p-5">

<h3 className="font-semibold mb-5">

🎯 Progress

</h3>

<h2 className="text-2xl font-bold">

{progress}%

</h2>

<div
className="
w-full
h-3
bg-gray-200
rounded-full
overflow-hidden
mt-5
"
>

<div
className="
h-full
rounded-full
bg-gradient-to-r
from-indigo-500
to-violet-600
transition-all
duration-500
"
style={{
width:`${progress}%`
}}
/>

</div>

<p className="text-sm text-gray-500 mt-4">

{completedSubtasks} of {subtasks.length} subtasks completed

</p>

</div>
<div className="bg-gray-50 rounded-2xl p-6">

<h3 className="font-semibold mb-3">
📅 Due Date
</h3>

<p className="text-2xl font-bold">

{
dueDate
?
dueDate.toLocaleDateString(
"en-US",
{
month:"short",
day:"numeric",
year:"numeric"
}
)
:
"Not Set"
}

</p>

<p className="text-sm text-gray-500 mt-3">

{
daysLeft===null
?
"No deadline"

:
daysLeft<0

?
`${Math.abs(daysLeft)} days overdue`

:
daysLeft===0

?
"Due Today"

:
`${daysLeft} days remaining`
}

</p>

</div>
</div>
<div
className="
bg-gray-50
rounded-2xl
p-6
mt-6
"
>
  <div className="flex justify-between items-center">

<h3 className="font-semibold text-lg">
Subtasks
</h3>

<button
className="
text-indigo-600
font-medium
"
>
+ Add Subtask
</button>

</div>
<div className="flex gap-3 mt-4">

<input
type="text"
placeholder="Add new subtask..."
value={newSubtask}
onChange={(e)=>
setNewSubtask(e.target.value)
}
className="
flex-1
border
border-gray-300
rounded-xl
px-4
py-3
"
/>

<button
onClick={addSubtask}
className="
bg-indigo-600
text-white
px-5
rounded-xl
"
>
Add
</button>

</div>
<div className="mt-5 space-y-3">

{subtasks.map((subtask:any) => (

<div
key={subtask.id}
className="
flex
items-center
justify-between
bg-white
p-3
rounded-xl
"
>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={subtask.completed}
onChange={() =>
toggleSubtask(subtask)
}
/>

{
editingSubtask === subtask.id
?
<input
value={editSubtaskText}
onChange={(e)=>
setEditSubtaskText(
e.target.value
)
}
className="
border
rounded-lg
px-2
py-1
text-sm
"
/>
:
<span>
{subtask.title}
</span>
}

</div>

<div className="flex gap-2">

<button
onClick={() => {

  setEditingSubtask(
    subtask.id
  );

  setEditSubtaskText(
    subtask.title
  );

}}
className="
text-gray-400
hover:text-indigo-600
transition
"
>
<Pencil size={16}/>
</button>

<button
onClick={() =>
deleteSubtask(subtask.id)
}
className="
text-gray-400
hover:text-red-500
transition
"
>
<Trash2 size={16}/>
</button>
{
editingSubtask === subtask.id &&
(
<button
onClick={() =>
updateSubtask(
subtask.id
)
}
className="
text-green-600
font-medium
text-sm
"
>
Save
</button>
)
}

</div>

</div>

))}

</div>
</div>
<div className="mt-8">

<h2 className="text-xl font-bold mb-6">

🕒 Recent Activity

</h2>

<div className="space-y-4">

{activities.length === 0 ? (

<div className="bg-gray-50 rounded-2xl p-6 text-gray-500">

No recent activity

</div>

) : (

activities.map((activity:any) => (

<div
key={activity.id}
className="
flex
gap-4
items-start
bg-gray-50
rounded-2xl
p-4
"
>

<div
className="
w-10
h-10
rounded-full
bg-indigo-100
flex
items-center
justify-center
text-lg
"
>

{activity.icon}

</div>

<div className="flex-1">

<p className="font-medium">

{activity.title}

</p>

<p className="text-sm text-gray-500">

{activity.description}

</p>

<p className="text-xs text-gray-400 mt-1">

{new Date(activity.createdAt).toLocaleString()}

</p>

</div>

</div>

))

)}

</div>

</div>


</div>

);

})()}

</>

)}        


       
        {/* INVOICES */}
{activeSection === "invoices" && (
  <section className="w-full">
<div className="w-full flex justify-between items-center mb-8">

  <div>

    <h1 className="text-4xl font-bold">
      Invoices
    </h1>

    <p className="text-gray-500 mt-2 text-lg">
      Create and manage all project invoices
    </p>

  </div>

  <button
    onClick={() => {

  setEditingInvoice(null);

  setInvoiceData({

    projectId: "",

    clientId: "",

    amount: "",

    issueDate: "",

    dueDate: "",

    paymentSchedule: false,

  });

  setShowInvoiceModal(true);

}}
    className="
      bg-gradient-to-r
      from-indigo-600
      to-purple-600
      text-white
      px-6
      py-3
      rounded-2xl
      font-semibold
      shadow-lg
      hover:shadow-xl
      transition
    "
  >
    + New Invoice
  </button>

  </div>

  <div className="flex gap-4 mb-8">

  <div className="relative flex-[8]">

    <Search
      size={20}
className="

absolute
left-4
top-1/2
-transform
-translate-y-1/2
text-gray-400
"
        
    />

    <input
      type="text"
      placeholder="Search invoices..."
      value={invoiceSearch}
      onChange={(e)=>setInvoiceSearch(e.target.value)}
      className="
      w-full
bg-white
border
border-gray-300
rounded-2xl
pl-12
pr-4
py-3
outline-none
shadow-sm
transition-all
duration-300
hover:shadow-md
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-100
focus:shadow-lg
"
    />

  </div>

  <select
    value={invoiceSort}
    onChange={(e)=>setInvoiceSort(e.target.value)}
    className="
      flex-[1.3] 
px-5
py-3
rounded-2xl
border
border-gray-300
bg-white
outline-none
shadow-sm
transition-all
duration-300
hover:shadow-md
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-100
focus:shadow-lg
"
>

    <option value="Newest">
      Sort By
    </option>

    <option value="Newest">
      Newest
    </option>

    <option value="Oldest">
      Oldest
    </option>

    <option value="Highest">
      Highest Amount
    </option>

    <option value="Lowest">
      Lowest Amount
    </option>

  </select>

</div>


    {filteredInvoices.length === 0 ? (
  <div className="text-center py-20">
    <div className="py-24 flex flex-col items-center">

  <div
    className="
      w-24
      h-24
      rounded-full
      bg-indigo-100
      flex
      items-center
      justify-center
      text-5xl
      mb-6
    "
  >
    💳
  </div>

  <h2 className="text-3xl font-bold">
    No Invoices Yet
  </h2>

  <p className="text-gray-500 mt-3">

    Create your first invoice for a project.

  </p>

  <button

    onClick={()=>setShowInvoiceModal(true)}

    className="
      mt-8
      bg-indigo-600
      hover:bg-indigo-700
      text-white
      px-6
      py-3
      rounded-xl
      font-medium
    "

  >

    + {editingInvoice
? "Create Invoice"
: "Update Invoice"}

  </button>

</div>
  </div>
) : (

      <div
  className="
    grid
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-3
    2xl:grid-cols-4
    gap-6
  "
>
      {filteredInvoices.map((invoice) => {
        const displayStatus =
    invoice.paymentSchedule
        ? invoice.status === "Paid"
            ? "Paid"
            : "Pending"
        : invoice.status;
        console.log("INVOICE:", invoice);
       return (

<div
  key={invoice.id}
  className="
bg-white
rounded-3xl
border
border-gray-100
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
p-6
flex
flex-col
"
>

  {/* Header */}

  <div className="flex justify-between items-start">
    <div
className="
w-14
h-14
rounded-2xl
bg-gradient-to-br
from-indigo-100
to-violet-100
flex
items-center
justify-center
shadow-sm
"
>
<Receipt
size={28}
className="text-indigo-600"
/>
</div>

    <div className="flex gap-3">

      <button
        onClick={() => editInvoice(invoice)}
        className="
          text-gray-400
          hover:text-indigo-600
          transition
        "
      >
        <Pencil size={18}/>
      </button>

<button
  onClick={() => deleteInvoice(invoice.id)}
  className="
    text-gray-400
    hover:text-red-500
    transition
  "
>
  <Trash2 size={18}/>
</button>

    </div>

  </div>

  {/* Invoice Number */}

  <h3 className="text-2xl font-bold mt-5">

    {invoice.invoiceNumber}

  </h3>

  {/* Client */}
  <p className="text-xs text-gray-400">
Client
</p>

<p className="font-medium">
{invoice.client?.name}
</p>

  {/* Amount */}
<div className="mt-5 flex items-center gap-2">
    <h2 className="text-3xl font-bold">
        ₹{Number(invoice.amount).toLocaleString("en-IN")}
    </h2>

    {invoice.paymentSchedule && (
        <img
            src="/emi.png"
            alt="Installment Plan"
            width={34}
            height={34}
            className="ml-2 object-contain self-center"
        />
    )}
</div>

  {/* Due */}

  <div className="mt-4 text-gray-500 text-sm">

    📅

    {

      invoice.dueDate
? new Date(invoice.dueDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )
: "Not Set"

    }

  </div>

  {/* Footer */}

  <div
    className="
      mt-auto
      pt-6
      flex
      justify-between
      items-center
    "
  >

    <span
      className={`
        inline-flex
items-center
gap-1.5
rounded-full
px-3
py-1
text-xs
font-semibold

${
displayStatus==="Paid"
?"bg-green-100 text-green-700"

:displayStatus==="Sent"
?"bg-blue-100 text-blue-700"

:displayStatus === "Partially Paid"
? "bg-orange-100 text-orange-700"

:displayStatus==="Overdue"
?"bg-red-100 text-red-700"

:displayStatus==="Cancelled"
?"bg-gray-200 text-gray-700"

:"bg-yellow-100 text-yellow-700"
}

      `}
      
    >
      {displayStatus==="Paid" && (
<CheckCircle2 size={13}/>
)}

{displayStatus==="Sent" && (
<Send size={13}/>
)}

{displayStatus === "Partially Paid" && (
    <CircleDollarSign size={13}/>
)}

{displayStatus==="Overdue" && (
<AlertTriangle size={13}/>
)}

{displayStatus==="Cancelled" && (
<Ban size={13}/>
)}

{displayStatus==="Draft" && (
<Clock3 size={13}/>
)}

{displayStatus === "Pending" && (
    <Clock3 size={13} />
)}

      {displayStatus}

    </span>

    <button

      onClick={()=>openInvoice(invoice)}

      className="
        text-indigo-600
        font-medium
        hover:translate-x-1
        transition
      "

    >

      View Invoice →

    </button>

  </div>

</div>

);
})}
    </div>
)}
  </section>
)}

{showInvoiceDrawer && selectedInvoice && (() => {
 

 const invoiceStatus =
    selectedInvoice.status as InvoiceStatus;
 const paymentSummary = calculateInvoiceProgress(selectedInvoice); 
 const progressPercentage =
  paymentSummary.total === 0
    ? 0
    : Math.round(
        (paymentSummary.paid / paymentSummary.total) * 100
      );
const canDownloadReceipt =
    selectedInvoice.paymentSchedule
        ? selectedInvoice.status === "Paid"
        : selectedInvoice.status === "Paid";

  return( 
  

<div
className="
fixed
top-0
right-0
h-full
w-[500px]
bg-white
shadow-2xl
border-l
border-gray-200
z-50
overflow-y-auto
"
>
  <div className="p-6">
{/* ================= HEADER ================= */}

<div className="pb-4 mb-2">

  {/* Top Row */}

  <div className="flex items-center justify-between">

    <h2 className="text-[28px] font-bold leading-none">
      Invoice Details
    </h2>

    <button
      onClick={() => {
        setShowInvoiceDrawer(false);
        setSelectedInvoice(null);
      }}
      className="
      h-10
      w-10
      rounded-xl
      flex
      items-center
      justify-center
      hover:bg-gray-100
      transition
      "
    >
      <X
        size={22}
        className="text-gray-500"
      />
    </button>

  </div>

  {/* Status */}

  <div className="mt-4">
    <span
className={`
inline-flex
items-center
gap-1.5
rounded-full
px-3
py-1
text-xs
font-semibold

${
invoiceStatus==="Paid"
?"bg-green-100 text-green-700"

:invoiceStatus==="Sent"
?"bg-blue-100 text-blue-700"

:invoiceStatus === "Partially Paid"
? "bg-orange-100 text-orange-700"

:invoiceStatus === "Overdue"
?"bg-red-100 text-red-700"

:invoiceStatus ==="Cancelled"
?"bg-gray-200 text-gray-700"

:"bg-yellow-100 text-yellow-700"
}
`}
>

{invoiceStatus==="Paid" && (
<CheckCircle2 size={13}/>
)}

{invoiceStatus==="Sent" && (
<Send size={13}/>
)}

{invoiceStatus === "Partially Paid" && (
    <CircleDollarSign size={13}/>
)}

{invoiceStatus==="Overdue" && (
<AlertTriangle size={13}/>
)}

{invoiceStatus==="Cancelled" && (
<Ban size={13}/>
)}

{invoiceStatus==="Draft" && (
<Clock3 size={13}/>
)}

{invoiceStatus}

</span>

  </div>

  {/* Invoice Number */}

  <h1
    className="
    text-3xl
    font-bold
    tracking-tight
    mt-5
    "
  >
    {selectedInvoice.invoiceNumber}
  </h1>

  {/* Buttons */}

  <div className="grid grid-cols-2 gap-3 mt-5">

    <button
    disabled={
    isSendingInvoice ||
    selectedInvoice?.status === "Paid"
}
    onClick={async () => {

    setIsSendingInvoice(true);

    const loadingToast = toast.loading(
    selectedInvoice?.emailSent
        ? "Resending invoice...\nPlease wait while we deliver the email."
        : "Sending invoice...\nPlease wait while we deliver the email."
);

    try {

        const response = await fetch("/api/invoices/send", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                invoiceId: selectedInvoice?.id,
            }),
        });

        const data = await response.json();

        toast.dismiss(loadingToast);

        if (!response.ok) {

            toast.error(
                data.error ?? "Failed to send invoice."
            );

            return;
        }
        if (data.resend) {

    toast.success(
        "Invoice resent successfully.\nA new copy has been delivered to the client."
    );

} else {

    toast.success(
        "Invoice sent successfully.\nThe client has received the invoice email."
    );

}
        await fetchInvoices();
        console.log(data);

    } catch (error) {

        toast.dismiss(loadingToast);

        toast.error(
            "Unable to send invoice. Please try again."
        );

        console.error(error);

    } finally {

        setIsSendingInvoice(false);

    }

}}

className={`
col-span-0.5
h-10
rounded-xl
text-white
text-sm
font-semibold
shadow-md
transition-all
duration-200
disabled:cursor-not-allowed
disabled:hover:scale-100
disabled:hover:shadow-md

${
    selectedInvoice?.status === "Paid"
        ? "bg-green-600 hover:bg-green-600"
        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.01]"
}
`}
    >
{
isSendingInvoice

? selectedInvoice?.emailSent
    ? "Resending..."
    : "Sending..."

: selectedInvoice?.status === "Paid"
? "Invoice Paid"

: selectedInvoice?.emailSent

? "Resend Invoice"

: "Send Invoice"
}
    </button>


    <button
    onClick={handleDownloadInvoice}

    className="
        col-span-0.5
        h-10
        rounded-xl
        border
        border-gray-300
        text-indigo-600
        text-sm
        font-medium
        hover:bg-gray-50
        transition
    "
>
    📄 Download Invoice
</button>


  </div>

  <div className="grid grid-cols-3 gap-3 mt-4">

  {/* Download Receipt */}
  

 <button
    onClick={handleDownloadReceipt}
    className={`
        col-span-2
        h-10
        rounded-xl
        border
        text-sm
        font-medium
        flex
        items-center
        justify-center
        gap-2
        transition

        ${
            canDownloadReceipt
                ? `
                    border-indigo-300
                    text-indigo-600
                    hover:bg-indigo-50
                    cursor-pointer
                  `
                : `
                    border-gray-200
                    text-gray-400
                    bg-gray-50
                    cursor-not-allowed
                  `
        }
    `}
>
    <Download size={16} />
    Download Receipt
</button>

  {/* Share */}

  <button
   onClick={() =>
        setShowShareReceiptModal(true)
    }
    className="
      h-10
      rounded-xl
      border
      border-gray-300
      text-sm
      flex
      items-center
      justify-center
      gap-2
      hover:bg-gray-50
      transition
    "
  >
    <Share2 size={16} />
    Share
  </button>

</div>

</div>
<div className="grid grid-cols-2 gap-5 items-stretch">
{/* ================= CLIENT ================= */}

  <div
    className="
      rounded-3xl
      bg-gray-50
      p-4
      h-full
      flex
      flex-col
    "
  >

    {/* Title */}

    <h3 className="text-lg font-semibold text-slate-900 mb-5">
      Client Details
    </h3>

    {/* Name */}

    <h4 className="mt-4 text-2xl font-bold text-gray-900">
      {selectedInvoice.client?.name || "No Client"}
    </h4>

    {/* Email */}

    <p className="mt-1 text-sm text-gray-500">
      {selectedInvoice.client?.email || "No Email"}
    </p>

    {/* Company */}

    {selectedInvoice.client?.company && (

      <p className="mt-4 text-gray-700 font-medium">
        {selectedInvoice.client.company}
      </p>

    )}

    {/* View Client */}

    <button
      onClick={() => {
        setActiveSection("clients");
        setShowInvoiceDrawer(false);
      }}
      className="text-indigo-600 mt-7 font-medium hover:translate-x-1 transition"
    >

       View Client →


    </button>

  </div>

{/* ================= Email Delivery ================= */}

<div
    className="
    rounded-3xl
    bg-gray-50
    p-6
    h-full
    flex
    flex-col
    "
>

    {/* Header */}

    <div className="flex items-center gap-2 mb-5">

        <MailCheck className="w-5 h-5 text-indigo-600" />

        <h3 className="text-xl font-semibold text-slate-900">
            Email Delivery
        </h3>

    </div>

    <div className="flex flex-col gap-5 flex-1">

        {/* Status */}

        <div>

            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-2">
                Status
            </p>

            {selectedInvoice?.emailSent ? (

                <span
                    className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-green-100
                    text-green-700
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    "
                >

                    <CheckCircle2 className="w-3.5 h-3.5" />

                    Sent

                </span>

            ) : (

                <span
                    className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-slate-100
                    text-slate-600
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    "
                >

                    <Mail className="w-3.5 h-3.5" />

                    Not Sent

                </span>

            )}

        </div>

        {/* First Sent */}

        <div>

            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-1">
                First Sent
            </p>

            <p className="text-slate-700 text-sm">

                {selectedInvoice?.sentAt
                    ? new Date(selectedInvoice.sentAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                      })
                    : "—"}

            </p>

        </div>

        {/* Last Sent */}

        <div>

            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-1">
                Last Sent
            </p>

            <p className="text-slate-700 text-sm">

                {!selectedInvoice?.lastSentAt
                    ? "—"
                    : selectedInvoice.lastSentAt === selectedInvoice.sentAt
                    ? "Not resent yet"
                    : new Date(selectedInvoice.lastSentAt).toLocaleString(
                          "en-IN",
                          {
                              dateStyle: "medium",
                              timeStyle: "short",
                          }
                      )}

            </p>

        </div>

    </div>

</div>
</div>

{/* ================= INVOICE SUMMARY ================= */}

<div className="mt-6">

  <div
    className="
      rounded-3xl
      bg-gradient-to-r
      from-indigo-600
      via-violet-600
      to-purple-600
      p-5
      text-white
      shadow-lg
    "
  >

    {/* Heading */}

    <h3 className="text-xl font-semibold">
      Invoice Summary
    </h3>

    <p className="text-indigo-100 text-sm mt-1">
      Payment overview of this invoice
    </p>

    {/* Three Stats */}

    <div className="grid grid-cols-3 gap-5 mt-6">

      {/* Total */}

      <div>

        <p className="text-xs uppercase tracking-wide text-indigo-200">
          Total
        </p>

        <h2 className="text-2xl font-bold mt-2">
          ₹{paymentSummary.total.toLocaleString("en-IN")}
        </h2>

      </div>

      {/* Paid */}

      <div className="text-center">

        <p className="text-xs uppercase tracking-wide text-indigo-200">
          Paid
        </p>

        <h2 className="text-2xl font-bold text-green-300 mt-2">
          ₹{paymentSummary.paid.toLocaleString("en-IN")}
        </h2>

      </div>

      {/* Outstanding */}

      <div className="text-right">

        <p className="text-xs uppercase tracking-wide text-indigo-200">
          Outstanding
        </p>

        <h2 className="text-2xl font-bold text-red-300 mt-2">
          ₹{paymentSummary.outstanding.toLocaleString("en-IN")}
        </h2>

      </div>

    </div>

  </div>

</div>
{/* ================= DATES ================= */}

<div className="grid grid-cols-3 gap-4 mt-6">

  {/* Issue Date */}

  <div
    className="
      rounded-2xl
      bg-gray-50
      p-5
      border
      border-gray-100
    "
  >

    <p className="text-sm text-gray-500">
      Issue Date
    </p>

    <h3 className="text-xl font-bold mt-3">
      {selectedInvoice.issueDate
        ? new Date(selectedInvoice.issueDate).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }
          )
        : "--"}
    </h3>

  </div>

  {/* Due Date */}

  <div
    className="
      rounded-2xl
      bg-gray-50
      p-5
      border
      border-gray-100
    "
  >

    <p className="text-sm text-gray-500">
      Due Date
    </p>

    <h3 className="text-xl font-bold mt-3">
      {selectedInvoice.dueDate
        ? new Date(selectedInvoice.dueDate).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }
          )
        : "--"}
    </h3>

  </div>

  {/* Paid Date */}

  <div
    className="
      rounded-2xl
      bg-gray-50
      p-5
      border
      border-gray-100
    "
  >

    <p className="text-sm text-gray-500">
      Paid Date
    </p>

    <h3 className="text-xl font-bold mt-3">

      {selectedInvoice.paidDate
        ? new Date(selectedInvoice.paidDate).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }
          )
        : "Not Paid"}

    </h3>

  </div>

</div>

{/* ================= PAYMENT SECTION ================= */}

{selectedInvoice?.paymentSchedule ? (

    <div className="mt-7 rounded-3xl bg-white border border-gray-200 shadow-sm">
         {/* Header */}

    <div className="flex items-center justify-between p-6 pb-4">

        <div>

            <h2 className="text-lg font-semibold">
                Payment Schedule
            </h2>

            <p className="text-sm text-gray-500 mt-0.5">
            {selectedInvoice?.paymentSchedules?.length ?? 0} Installments
            </p>

        </div>

<button
onClick={() => {

    setEditingPayment(null);

    setPaymentData({

        dueDate: "",

        amount: "",

    });

    setShowPaymentModal(true);

}}
  className="
inline-flex
items-center
gap-2
px-3
py-2
rounded-xl
text-indigo-600
font-semibold
cursor-pointer
transform-gpu
transition-all
duration-300
ease-[cubic-bezier(0.34,1.56,0.64,1)]
hover:scale-110
hover:text-indigo-700
active:scale-90
"
>
  <Plus size={16}/>
  Add Payment
</button>

    </div>

    {/* Table */}

    <table className="w-full fixed-table">
        <thead>

<tr className="border-b text-sm text-gray-500">

    <th className="w-[6%] py-3 text-center">
        #
    </th>

    <th className="w-[20%] py-3 text-center">
        Due Date
    </th>

    <th className="w-[18%] py-3 text-center">
        Amount
    </th>

    <th className="w-[18%] py-3 text-center">
        Mark Paid
    </th>

    <th className="w-[14%] py-3 text-center">
        Status
    </th>

    <th className="w-[18%] py-3 text-center">
        Paid On
    </th>

    <th className="w-[6%] py-3 text-center">
    </th>

</tr>

</thead>

        <tbody>

{selectedInvoice?.paymentSchedules?.length ? (

    selectedInvoice.paymentSchedules.map((payment, index) => (

        <tr
            key={payment.id}
            className="border-t"
        >

            {/* Serial Number */}

            <td className="text-center py-5">

                {index + 1}

            </td>

            {/* Due Date */}

            <td className="text-center">

                {new Date(payment.dueDate).toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                    }
                )}

            </td>

            {/* Amount */}

            <td className="text-center font-semibold">

                ₹{Number(payment.amount).toLocaleString("en-IN")}

            </td>

            {/* Toggle */}
            <td className="text-center">

    <button
        onClick={() =>
    handleTogglePayment(
        payment.id,
        !payment.paidDate
    )
}
        className={`
            relative
            w-12
            h-7
            rounded-full
            transition-all
            duration-500
            ease-in-out
            ${
                !!payment.paidDate
                    ? "bg-green-500"
                    : "bg-gray-300"
            }
        `}
    >

        <span
            className={`
                absolute
                top-1
                left-1
                w-5
                h-5
                bg-white
                rounded-full
                shadow-md
                transition-all
                duration-300
                ${
                    !!payment.paidDate
                        ? "translate-x-5"
                        : ""
                }
            `}
        />

    </button>

</td>

            {/* Status */}

            <td className="text-center">

    {payment.paidDate ? (

        <CheckCircle2
            size={20}
            className="mx-auto text-green-600"
        />

    ) : (

        <Clock3
            size={18}
            className="mx-auto text-blue-400"
        />

    )}

</td>

            {/* Paid Date */}
            <td className="text-center">

    {payment.paidDate ? (

        new Date(payment.paidDate).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "2-digit",
            }
        )

    ) : (

        "--"

    )}

</td>

            {/* Menu */}

            <td className="text-center">

                <div className="relative inline-block">

                    <button
                        onClick={() =>
                            setPaymentMenu(
                                paymentMenu === payment.id
                                    ? null
                                    : payment.id
                            )
                        }
                        className="
                            p-2
                            rounded-lg
                            hover:bg-gray-100
                            transition
                        "
                    >

                        <MoreVertical
                            size={18}
                            className="text-gray-500"
                        />

                    </button>

                    {paymentMenu === payment.id && (

                        <div
                            className="
                                absolute
                                right-0
                                top-10
                                w-44
                                bg-white
                                rounded-xl
                                shadow-xl
                                border
                                border-gray-200
                                overflow-hidden
                                z-50
                            "
                        >

                         
                            <button

    onClick={() => {

        setEditingPayment(payment);
setPaymentData({

    dueDate:
        payment.dueDate
            ?.split("T")[0] || "",

    amount:
        payment.amount.toString(),

});

        setShowPaymentModal(true);

        setPaymentMenu(null);

    }}

    className="
        w-full
        px-4
        py-3
        flex
        items-center
        gap-3
        hover:bg-gray-50
        transition
    "

>

    <Pencil size={16}/>

    Edit Payment

</button>

                            <button
                            onClick={() => handleDeletePayment(payment.id)}
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    flex
                                    items-center
                                    gap-3
                                    text-red-600
                                    hover:bg-red-50
                                "
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>

                        </div>

                    )}

                </div>

            </td>

        </tr>

    ))

) : (

    <tr>

        <td
            colSpan={7}
            className="py-10 text-center text-gray-400"
        >

            No payment schedule found.

        </td>

    </tr>

)}

</tbody>

    </table>


    </div>

) : (

    <div className="mt-7 rounded-3xl bg-white border border-gray-200 shadow-sm">

        <div className="flex items-center justify-between px-6 pt-6 pb-4">

    <div>

        <h2 className="text-lg font-semibold">
            Payment Information
        </h2>

        <p className="text-sm text-gray-500 mt-1">
            Full payment 
        </p>

      <table className="w-full table-fixed">
    <thead>

<tr className="border-b text-sm text-gray-500">

    <th className="w-[22%] px-4 py-3 text-left">
        Amount
    </th>

    <th className="w-[16%] py-3 text-center">
        Mark Paid
    </th>

    <th className="w-[18%] py-3 text-center">
        Status
    </th>

    <th className="w-[22%] py-3 text-center">
        Paid Date
    </th>

    <th className="w-[20%] py-3 text-center">
        Outstanding
    </th>

    <th className="w-[6%] py-3 text-right pr-6">
    </th>

</tr>

</thead>

    <tbody>

        <tr className="border-b">

    <td className="px-4 py-5 font-semibold">
        ₹{Number(selectedInvoice.amount).toLocaleString("en-IN")}
    </td>

    <td>
      <button
    onClick={() =>
    handleTogglePayment(
        selectedInvoice.id,
        !selectedInvoice.paidDate
    )
}
    className={`
        relative
        w-12
        h-7
        rounded-full
        transition-all
        duration-300
        ${
            selectedInvoice.paidDate
    ? "bg-green-500"
    : "bg-gray-300"
        }
    `}
>

    <span
        className={`
            absolute
            top-1
            left-1
            w-5
            h-5
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-300
            ${
                selectedInvoice.paidDate
                    ? "translate-x-5"
                    : ""
            }
        `}
    />

</button>

    </td>

 <td className="text-center">

    {selectedInvoice.paidDate ? (

        <CheckCircle2
            size={20}
            className="mx-auto text-green-600"
        />

    ) : (

        <Clock3
            size={18}
            className="mx-auto text-blue-400"
        />

    )}

</td>

    <td className="text-center">
      {selectedInvoice.paidDate

    ? new Date(
        selectedInvoice.paidDate
      ).toLocaleDateString(
          "en-GB",
          {
              day: "2-digit",
              month: "short",
              year: "2-digit",
          }
      )

    : "--"
}

    </td>

    <td className="text-center font-semibold">

        ₹{
Number(
selectedInvoice.paidDate
? 0
: selectedInvoice.amount
).toLocaleString("en-IN")
}

    </td>


</tr>

    </tbody>
    

</table>  

    </div>
    

</div>

    </div>

)}
</div>


</div>
);

})()}

{showPaymentModal && (

<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">

  <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">

    {/* Header */}

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-3xl font-bold">
        
    {editingPayment

        ? "Edit Payment"

        : "Add Payment"}

      </h2>

      <button
    onClick={resetPaymentModal}
    className="text-gray-400 hover:text-gray-700"
>
        <X size={24}/>
      </button>


    </div>

    <div className="mb-5 rounded-2xl bg-gray-50 border border-gray-200 p-4">

    <div className="flex justify-between text-sm">

        <span className="text-gray-500">
            Project Budget
        </span>

        <span className="font-semibold">
            ₹{projectBudgets.toLocaleString("en-IN")}
        </span>

    </div>

    <div className="flex justify-between text-sm mt-2">

        <span className="text-gray-500">
            Already Scheduled
        </span>

        <span className="font-semibold">
            ₹{alreadyScheduled.toLocaleString("en-IN")}
        </span>

    </div>

    <div className="border-t mt-3 pt-3 flex justify-between">

        <span className="font-medium">
            Remaining Budget
        </span>

        <span className="font-bold text-indigo-600">
            ₹{remainingBudget.toLocaleString("en-IN")}
        </span>

    </div>

</div>

    {/* Due Date */}
    <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
      Due Date
    </label>

    <input
      type="date"
      value={paymentData.dueDate}
      onChange={(e)=>
        setPaymentData({
          ...paymentData,
          dueDate:e.target.value
        })
      }
      className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        mb-4
      "
    />
    </div>


    {/* Amount */}
    <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
      Installment Amount
    </label>

    <input
      type="number"
      placeholder="Amount"
      value={paymentData.amount}
      onChange={(e)=>
        setPaymentData({
          ...paymentData,
          amount:e.target.value
        })
      }
      className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        mb-4
      "
    />
    {exceedsBudget && (

    <p className="mt-2 text-sm font-medium text-red-500">
    ⚠ Amount exceeds remaining budget.
</p>

)}
    </div>



    {/* Footer */}

    <div className="flex gap-3 mt-8">
<button
  onClick={

    editingPayment

        ? handleUpdatePayment

        : handleSavePayment

}

  disabled={
    exceedsBudget ||
    enteredAmount <= 0
}

  className={`
    flex-1
    py-3
    rounded-xl
    font-semibold
    transition

    ${
      exceedsBudget || enteredAmount <= 0
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] active:scale-95"
    }
  `}
>
  {editingPayment

    ? "Update Payment"

    : "Save Payment"}
</button>

      <button
        onClick={resetPaymentModal}
        className="
          flex-1
          border
          border-gray-300
          py-3
          rounded-xl
        "
      >
        Cancel
      </button>

    </div>

  </div>

</div>

)}

{
showShareReceiptModal && (

<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">

<div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
<div className="p-8">

  <div className="flex items-start justify-between">

<div className= "flex-1">

<h2
className="
text-4xl
font-bold
"
>
Share Receipt
</h2>

<p
className="
text-gray-500
mt-2
"
>

Share this payment receipt securely.

</p>

</div>

<button
onClick={() =>
setShowShareReceiptModal(false)
}
>

<X
size={22}
className="text-gray-400"
/>

</button>

</div>
<div className="mt-8 space-y-5">
  <button
  onClick={handleCopyReceiptLink}
className="
w-full
border
border-gray-200
rounded-2xl
p-5
text-left
group
transition-all
duration-300
hover:border-indigo-300
hover:bg-indigo-50
hover:shadow-md
hover:-translate-y-0.5
"
>

<div
className="
flex
justify-between
items-start
"
>

<div
className="
flex
gap-4
items-start
"
>

<div
className="
w-12
h-12
rounded-xl
bg-gray-100
flex
items-center
justify-center
"
>

{/* Icon */}
<div
className="
w-12
h-12
rounded-xl
bg-gray-100
flex
items-center
justify-center
group-hover:bg-white
transition
"
>

<img
    src="/copy.png"
    alt="Copy"
    className="w-6 h-6 object-contain"
/>

</div>

</div>

<div>

<h3
className="
font-semibold
text-lg
"
>

Copy Receipt Link

</h3>

<p
className="
text-sm
text-gray-500
mt-1
"
>

Copy receipt link to clipboard.

</p>

</div>

</div>

<ChevronRight
size={20}
className="
text-gray-400
transition-all
duration-300
group-hover:text-indigo-600
group-hover:translate-x-1
group-hover:-translate-y-1

"
/>

</div>

</button>
<button
onClick={handleShareReceipt}
className="
w-full
border
border-gray-200
rounded-2xl
p-5
text-left
group
transition-all
duration-300
hover:border-indigo-300
hover:bg-indigo-50
hover:shadow-md
hover:-translate-y-0.5
"
>

<div
className="
flex
justify-between
items-start
"
>

<div
className="
flex
gap-4
items-start
"
>

<div
className="
w-12
h-12
rounded-xl
bg-gray-100
flex
items-center
justify-center
"
>

{/* Icon */}
<div
className="
w-12
h-12
rounded-xl
bg-gray-100
flex
items-center
justify-center
group-hover:bg-white
transition
"
>

<img
    src="/Share.png"
    alt="Copy"
    className="w-6 h-6 object-contain"
/>

</div>

</div>

<div>

<h3
className="
font-semibold
text-lg
"
>

Share to Client

</h3>

<p
className="
text-sm
text-gray-500
mt-1
"
>

Send receipt directly to client Email.

</p>

</div>

</div>

<ChevronRight
size={20}
className="
text-gray-400
 transition-all
  duration-300
  group-hover:text-indigo-600
  group-hover:translate-x-1
  group-hover:-translate-y-1
"
/>

</div>
</button>
<div className="mt-8">

<button
onClick={() =>
setShowShareReceiptModal(false)
}
className="
w-44
h-12
rounded-xl
border
border-gray-300
bg-white
hover:bg-gray-50
transition-all
duration-200
font-medium
mx-auto
block
"
>

Cancel

</button>

</div>
</div>

</div>


</div>

</div>

)
}

{/* DOCUMENTS */}
{activeSection === "documents" && (
  <section className="w-full space-y-6 pt-8">
    <div className="w-full flex max-w-5xl justify-between items-center mb-8">
  <div>
    <h2 className="text-4xl font-bold">
      Documents
    </h2>

    <p className="text-muted-foreground mt-2">
      Manage your files and attachments
    </p>
  </div>

  <button
    onClick={() => setShowDocumentModal(true)}
    className="
      bg-gradient-to-r
      from-indigo-600
      to-purple-600
      text-white
      px-5
      py-3
      rounded-xl
      font-medium
      hover:opacity-90
      transition
    "
  >
    + Upload Document
  </button>
</div>

{documents.length === 0 ? (
  <div className="text-center py-20">
    <div className="text-6xl mb-4">
      📄
    </div>

    <h3 className="text-2xl font-semibold">
      No Documents Yet
    </h3>

    <p className="text-muted-foreground mt-2">
      Upload your first document
    </p>
  </div>
) : (

    <div className="w-full max-w-5xl space-y-4">
      {documents.map((document) => (
        <div
  key={document.id}
  className="
    bg-gradient-to-r
    from-indigo-50
    to-purple-50
    dark:from-slate-800
    dark:to-slate-900
    border
    border-border
    rounded-2xl
    p-5
    shadow-sm
    hover:shadow-md
    hover:-translate-y-0.5
    transition-all
    duration-300
  "
>
  <div className="flex justify-between items-start">

    <div>
      <h3 className="text-xl font-semibold">
        📄 {document.name}
      </h3>

      <p className="text-muted-foreground mt-2">
        Uploaded {
          new Date(document.createdAt)
            .toLocaleDateString()
        }
      </p>

      <a
  href={document.fileUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="
    inline-flex
    items-center
    mt-3
    text-green-600
    hover:text-green-700
    font-medium
    transition
  "
>
  Open File
</a>
    </div>

    <div className="flex items-center gap-2">

  <a
    href={document.fileUrl}
    download
    className="
      bg-green-600
      text-white
      px-4
      py-2
      rounded-xl
      font-medium
      hover:bg-green-700
      transition
    "
  >
    Download
  </a>

  <button
    onClick={() =>
      toast("Edit feature coming soon")
    }
    className="
      p-2
      rounded-lg
      bg-primary/10
      text-primary
      hover:bg-primary/20
      transition
    "
  >
    ✏️
  </button>

  <button
    onClick={() => {
      if (
        confirm(
          `Delete "${document.name}"?`
        )
      ) {
        deleteDocument(document.id);
      }
    }}
    className="
      bg-gradient-to-r
      from-indigo-600
      to-purple-600
      text-white
      px-4
      py-2
      rounded-xl
      font-medium
      hover:opacity-90
      transition
    "
  >
    Delete
  </button>

</div>

  </div>
</div>
      ))}
    </div>
)}
  </section>
)}

{/* MEETINGS */}
{activeSection === "meetings" && (
  <section className="w-full space-y-6 pt-8">
    <div className="w-full flex max-w-5xl justify-between items-center mb-8">
  <div>
    <h2 className="text-4xl font-bold">
      Meetings
    </h2>

    <p className="text-muted-foreground mt-2">
      Schedule and track appointments
    </p>
  </div>

  <button
    onClick={() => setShowMeetingModal(true)}
    className="
      bg-gradient-to-r
      from-indigo-600
      to-purple-600
      text-white
      px-5
      py-3
      rounded-xl
      font-medium
      hover:opacity-90
      transition
    "
  >
    + New Meeting
  </button>
</div>

    {meetings.length === 0 ? (
  <div className="text-center py-20">

    <div className="text-6xl mb-4">
      📅
    </div>

    <h3 className="text-2xl font-semibold">
      No Meetings Yet
    </h3>

    <p className="text-muted-foreground mt-2">
      Schedule your first meeting
    </p>

  </div>
) : (

   
    <div className="w-full max-w-5xl space-y-4">
      {meetings.map((meeting) => (
        <div
  key={meeting.id}
  className="
    bg-gradient-to-r
    from-indigo-50
    to-purple-50
    dark:from-slate-800
    dark:to-slate-900
    border
    border-border
    rounded-2xl
    p-5
    shadow-sm
    hover:shadow-md
    hover:-translate-y-0.5
    transition-all
    duration-300
  "
>
  <div className="flex justify-between items-start">

    <div>

      <h3 className="text-xl font-semibold">
        📅 {meeting.title}
      </h3>

      <p className="text-muted-foreground mt-2">
        Client: {meeting.client?.name || "No Client"}
      </p>

      <p className="text-muted-foreground mt-2">
        Date: {meeting.date}
      </p>

      <p className="text-muted-foreground mt-2">
        Time: {meeting.time}
      </p>

    </div>

    
  <div className="flex items-center gap-2">

     {meeting.meetingLink && (
      <a
       href={meeting.meetingLink}
       target="_blank"
       rel="noopener noreferrer"
       className="
        bg-green-600
        text-white
        px-4
        py-2
        rounded-xl
        hover:bg-green-700
        transition
       "
      >
       Join Meeting
      </a>
     )}

     <button
       onClick={() =>
         toast("Edit feature coming soon")
       }
       className="
        p-2
        rounded-lg
        bg-primary/10
        text-primary
        "
      > 
      ✏️
     </button>

      <button
        onClick={() => {
          if (
            confirm(
              `Delete meeting "${meeting.title}"?`
            )
          ) {
            deleteMeeting(meeting.id);
          }
        }}
        className="
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          text-white
          px-4
          py-2
          rounded-xl
          font-medium
          hover:opacity-90
          transition
        "
      >
      Delete
     </button>

   </div>
    

  </div>
</div>
      ))}
    </div>
)}
  </section>
)}

{/** ANALYTICS SECTION */}
{activeSection === "analytics" && (
  <section className="w-full">
    <h2 className="text-4xl font-bold mb-10">
      Analytics Dashboard
    </h2>

    {/* KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-7xl mb-10">

  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border rounded-3xl p-6 shadow-sm">
    <h3 className="text-muted-foreground">
      Revenue
    </h3>

    <p className="text-4xl font-bold mt-3">
      ₹{
        invoices.reduce(
          (sum, invoice) =>
            sum + Number(invoice.amount),
          0
        )
      }
    </p>
  </div>

  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border rounded-3xl p-6 shadow-sm">
    <h3 className="text-muted-foreground">
      Clients
    </h3>

    <p className="text-4xl font-bold mt-3">
      {clients.length}
    </p>
  </div>

  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border rounded-3xl p-6 shadow-sm">
    <h3 className="text-muted-foreground">
      Projects
    </h3>

    <p className="text-4xl font-bold mt-3">
      {projects.length}
    </p>
  </div>

  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border rounded-3xl p-6 shadow-sm">
    <h3 className="text-muted-foreground">
      Completed Tasks
    </h3>

    <p className="text-4xl font-bold mt-3">
      {
        tasks.filter(
          task =>
            task.status === "Completed"
        ).length
      }
    </p>
  </div>

</div>
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full max-w-4xl h-80 bg-white rounded-2xl shadow p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">
          Revenue Trend
        </h3>
        
        <ResponsiveContainer
         width="100%"
         height="100%"
        >
         <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
          />
         </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-7xl mb-10">
        <div className="bg-white rounded-3xl shadow p-6 h-96">

  <h3 className="text-xl font-bold mb-4">
    Invoice Health
  </h3>

  
  <ResponsiveContainer
  width="100%"
  height="100%"
>
  <PieChart>

    <Pie
      data={invoiceChartData}
      dataKey="value"
      nameKey="name"
      cx="40%"
      cy="45%"
      outerRadius={100}
    >
      {invoiceChartData.map(
        (_, index) => (
          <Cell
            key={index}
            fill={
              COLORS[
                index % COLORS.length
              ]
            }
          />
        )
      )}
    </Pie>

    <Tooltip />

    <Legend
      layout="vertical"
      align="right"
      verticalAlign="middle"
      iconType="circle"
    />

  </PieChart>
</ResponsiveContainer>

</div>

<div
className="
bg-gradient-to-r
from-indigo-50
to-purple-50
border
rounded-3xl
p-8
shadow-sm
h-96
flex
flex-col
justify-center
"
>

<h3 className="text-2xl font-bold mb-8">
⭐ Productivity Score
</h3>

<div className="text-center">

<div className="text-7xl font-bold text-indigo-600">
 {productivityScore}
</div>

<div className="mt-3 text-xl">
<p className="mt-3 text-xl">
  {productivityScore >= 80
    ? "Excellent 🚀"
    : productivityScore >= 60
    ? "Good 👍"
    : "Needs Attention ⚡"}
</p>
</div>

<p className="text-muted-foreground mt-6">
Based on tasks, projects,
invoices and meetings.
</p>

</div>

</div>
      </div>

<div className="bg-white rounded-3xl shadow p-8 w-full">

  <h3 className="text-2xl font-bold mb-8">
    🏆 Top Clients
  </h3>

  <div className="h-80">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart
        data={rankedClients}
        layout="vertical"
        margin={{
          top: 20,
          right: 100,
          left: 40,
          bottom: 20,
        }}
        barCategoryGap="40%"
      >

        <defs>

          <linearGradient
            id="clientGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >

            <stop
              offset="0%"
              stopColor="#7c3aed"
            />

            <stop
              offset="100%"
              stopColor="#4f46e5"
            />

          </linearGradient>

        </defs>

        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          hide

        />

        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}

        />

        <Tooltip
  cursor={{
    fill: "transparent"
  }}
/>

        <Bar
          dataKey="revenue"
          radius={[0, 15, 15, 0]}
          animationDuration={1500}
          stroke="none"
        >
           {rankedClients.map((entry, index) => (
    <Cell
      key={index}
      fill={
    index === 0
      ? "#FBBF24"
      : "url(#clientGradient)"
  }
    />
  ))}
          <LabelList
            dataKey="revenue"
            position="right"
            formatter={(value) => `₹${value}`}
          />
        </Bar>
        </BarChart>

    </ResponsiveContainer>

  </div>

</div>
      </div>

  </section>
)}

      </main>
    
      {/* CREATE TASK MODAL */}
{showTaskModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
    className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
   <div className="flex items-center justify-between mb-6">

<h2 className="text-2xl font-bold">

{
editingTask
?
"Update Task"
:
"Create Task"
}

</h2>

<button
onClick={() => {
setShowTaskModal(false);
setEditingTask(null);
}}
className="text-gray-400 hover:text-red-500"
>
✕
</button>

</div>

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
    className="
      w-full
      border
      border-gray-300
      rounded-xl
      px-4
      py-3
    "
  />

  <textarea
    placeholder="Task Description"
    value={taskData.description}
    onChange={(e)=>
      setTaskData({
        ...taskData,
        description:e.target.value
      })
    }
    rows={3}
    className="
      w-full
      border
      border-gray-300
      rounded-xl
      px-4
      py-3
      resize-none
    "
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
            Low Priority
          </option>

          <option value="Medium">
            Medium Priority
          </option>

          <option value="High">
            High Priority
          </option>
        </select>


        <input
type="date"
value={taskData.dueDate}
onChange={(e)=>
setTaskData({
...taskData,
dueDate:e.target.value
})
}
className="
w-full
border
border-gray-300
rounded-xl
px-4
py-3
"
/>
        {/* ACTION BUTTONS */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={createTask}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {
editingTask
?
"Update Task"
:
"Create Task"
}
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

<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

<div
className="
bg-white
rounded-3xl
shadow-2xl
w-full
max-w-md
p-8
"
>

{/* Header */}
<div className="flex items-center justify-between mb-8">

  <div>

    <h2 className="text-3xl font-bold">
    {editingInvoice
    ? "Edit Invoice"
    : "Create Invoice"}
    </h2>

    <p className="text-gray-500 mt-1">
 {editingInvoice
    ? "Update this Invoice"
    : "Create this Invoice"}
    </p>

  </div>

  <button
    onClick={() => {

    setEditingInvoice(null);

    setShowInvoiceModal(false);

}}
    className="
      text-gray-400
      hover:text-gray-700
      transition
    "
  >
    ✕
  </button>

</div>

<div className="space-y-4">

{/* Project */}
<select
value={invoiceData.projectId}
onChange={(e)=>{

const project=projects.find(
(p:any)=>p.id===e.target.value
);

if(!project)return;

setInvoiceData({

...invoiceData,

projectId:project.id,

clientId:project.clientId,

amount:"",

});

}}
className="
w-full
border
border-gray-300
rounded-xl
px-4
py-3
"
>

<option value="">
Select Project
</option>

{projects.map((project:any)=>(

<option
key={project.id}
value={project.id}
>

{project.title}

</option>

))}

</select>

{/* Client */}
<input

readOnly

value={
clients.find(
(c:any)=>c.id===invoiceData.clientId
)?.name || ""
}

placeholder="Auto selected Client"

className="
w-full
border
border-gray-300
rounded-xl
px-4
py-3
bg-gray-50
"
/>

{/* Budget + Amount */}

<div className="grid grid-cols-2 gap-3">

<input

readOnly


value={`₹${Number(projectBudget||0).toLocaleString("en-IN")}`}

className="
border
border-gray-300
rounded-xl
px-4
py-3
bg-gray-50
font-semibold
"
/>

<input

type="number"

placeholder="Invoice Amount"

value={invoiceData.amount}
onChange={(e) => {

    const amount = e.target.value;

    const budget =
        Number(selectedProjectData?.budget || 0);

    setInvoiceData({

        ...invoiceData,

        amount,

        paymentSchedule:

    Number(amount) < budget

        ? invoiceData.paymentSchedule

        : false,

    });

}}

className="
border
border-gray-300
rounded-xl
px-4
py-3
"
/>

</div>

{/* Dates */}
<div className="grid grid-cols-2 gap-3">
   <div>

    <label className="block text-sm font-medium text-gray-700 mb-2">
      Issue Date
    </label>

<input

type="date"

value={invoiceData.issueDate}

onChange={(e)=>

setInvoiceData({

...invoiceData,

issueDate:e.target.value

})

}

className="
border
border-gray-300
rounded-xl
px-4
py-3
"
/>
</div>
<div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
      Due Date
    </label>

<input

type="date"

value={invoiceData.dueDate}

onChange={(e)=>

setInvoiceData({

...invoiceData,

dueDate:e.target.value

})

}

className="
border
border-gray-300
rounded-xl
px-4
py-3
"
/>

</div>
</div>

{/* Payment Schedule */}

<label
className="
flex
items-center
justify-between
border
border-gray-300
rounded-xl
px-4
py-3
cursor-pointer
"
>


<div
    onClick={() => {

        if (!canEnablePaymentSchedule) {

            toast.error(
    "Payment Schedule is available only for partial invoices.",
    {
        id: "payment-schedule-disabled",
    }
);

        }

    }}
    className="inline-flex items-center gap-2 cursor-pointer"
>

    <input
        type="checkbox"
        checked={invoiceData.paymentSchedule}
        disabled={!canEnablePaymentSchedule}
        onChange={(e) =>
            setInvoiceData({
                ...invoiceData,
                paymentSchedule: e.target.checked,
            })
        }
    />
    <span className="text-gray-700">

Enable Payment Schedule

</span>

</div>
</label>


{/* Footer */}
<div className="flex gap-3 pt-2">

<button

onClick={createInvoice}

disabled={
!invoiceData.projectId||
!invoiceData.issueDate||
!invoiceData.dueDate||
!invoiceData.amount
}

className="
flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
>
{editingInvoice
    ? "Update Invoice"
    : "Create Invoice"}

</button>

<button

onClick={() => {

  setEditingInvoice(null);

  setInvoiceData({

    projectId: "",

    clientId: "",

    amount: "",

    issueDate: "",

    dueDate: "",

    paymentSchedule: false,

  });

  setShowInvoiceModal(false);

}}

className="
flex-1
border
border-gray-300
py-3
rounded-xl
"

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
type="number"
placeholder="Budget"
value={projectData.budget}
onChange={(e)=>
setProjectData({
...projectData,
budget:e.target.value
})
}
className="w-full border rounded-xl p-3"
/>

<div className="space-y-2">

<label className="text-sm font-medium">
Deadline
</label>

<input
type="date"
value={projectData.deadline}
onChange={(e)=>
setProjectData({
...projectData,
deadline:e.target.value
})
}
className="
w-full
border
border-border
rounded-xl
px-4
py-3
bg-background
"
/>

</div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={createProject}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {
editingProject
?
"Update Project"
:
"Create Project"
}
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
         {editingClientId
    ? "Edit Client"
    : "Add Client"}
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
             {editingClientId
    ? "Update Client"
    : "Add Client"}
          </button>

          <button
            onClick={() => {

  setShowClientModal(false);

  setEditingClientId(null);

  setClientData({
    name: "",
    email: "",
    company: "",
  });

}}
            className="flex-1 border border-gray-300 py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
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
      <select
  value={documentData.clientId}
  onChange={(e) =>
    setDocumentData({
      ...documentData,
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
    <div className="px-5 py-3 rounded-xl bg-white shadow-sm border border-gray-200 text-gray-900 font-medium">
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-gray-600 text-xl font-bold">
      →
    </span>
  );
}