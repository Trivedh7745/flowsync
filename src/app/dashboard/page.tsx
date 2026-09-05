"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Folder, Kanban, LinkIcon, Search, ShoppingBasket } from "lucide-react";
import { Receipt } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Plus } from "lucide-react";
import crypto from "crypto";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { generateInvoicePDF } from "@/lib/invoicePdf";
import { buildFinancialSummary } from "@/lib/invoice";
import Image from "next/image";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { parse } from "pptxtojson";
import dynamic from "next/dynamic";
import {
  ClipboardList,
  Bell,
  Settings,
  CircleHelp,
  LogOut,
  Astroid,
  Mail,
  Zap,
  Target
} from "lucide-react";
import {
  ListTodo,
  Wallet,
  Gauge,
} from "lucide-react";
import {
  FileSpreadsheet,
  FileImage,
  File,
  Copy,
  Link,
  FileType,
  SortAscIcon,
  CalendarDays,
  User,
  Building2,
  HardDrive,
  Calendar,
  Maximize2
} from "lucide-react";
import {
  Send,
  AlertTriangle,
  CircleDollarSign,
  Link as linkIcon,
  Ban,
} from "lucide-react";
import {
  X,
  Download,
  Share2,
  ShareIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
    MailCheck,
    SendHorizonal
} from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Video,
  Briefcase,
  CreditCard,
  FileText,
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
Circle,
Clock
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

  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);

  const [showNotificationHistory, setShowNotificationHistory] =
  useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const [documentSearch, setDocumentSearch] = useState("");

  const [documentSort, setDocumentSort] = useState("");

  
  const [meetingSearch, setMeetingSearch] = useState("");

  const [meetingSort, setMeetingSort] = useState("");


  const [editingDocument, setEditingDocument] =
  useState<any>(null);

  const [selectedDocument, setSelectedDocument] =
  useState<any>(null);

const [showDocumentDetails, setShowDocumentDetails] =
  useState(false);

const [showFullFile, setShowFullFile] = useState(false);

const [csvData, setCsvData] = useState<string[][]>([]);
const [csvLoading, setCsvLoading] = useState(false);

const [excelData, setExcelData] = useState<string[][]>([]);
const [excelSheets, setExcelSheets] = useState<string[]>([]);
const [selectedSheet, setSelectedSheet] = useState("");
const [excelLoading, setExcelLoading] = useState(false);

const [docxHtml, setDocxHtml] = useState("");
const [docxLoading, setDocxLoading] = useState(false);

const [pptxData, setPptxData] = useState<any>(null);

const [currentSlide, setCurrentSlide] = useState(0);

const [pptxLoading, setPptxLoading] =
  useState(false);

const [slideScale, setSlideScale] = useState(1);

const slidePreviewRef = useRef<HTMLDivElement>(null);

const thumbnailContainerRef =
  useRef<HTMLDivElement | null>(null);

const [isFullscreenPreview, setIsFullscreenPreview] =
  useState(false);

const [fullscreenSlideScale, setFullscreenSlideScale] =
  useState(1);

const fullscreenSlideContainerRef =
  useRef<HTMLDivElement | null>(null);

const activeThumbnailRef =
  useRef<HTMLButtonElement | null>(null);

  const [meetings, setMeetings] = useState<any[]>([]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [editingPayment, setEditingPayment] =
    useState<PaymentSchedule | null>(null);

const [showMeetingModal, setShowMeetingModal] = useState(false);

const [editingMeeting, setEditingMeeting] = useState<any>(null);

const [showMeetingDrawer, setShowMeetingDrawer] = useState(false);

const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

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
  publicReceiptToken: string | null;
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

const CHART_COLORS = {
  primary: "#7C3AED",   // violet-600
  secondary: "#8d3dd8", // purple-600
  light: "#A78BFA",     // violet-400
  muted: "#E5E7EB",
};

const PdfPreview = dynamic(
  () => import("@/components/PdfPreview"),
  {
    ssr: false,
  }
);

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
    name: "Overdue",
    value: invoices.filter(
      (invoice: any) =>
        String(invoice.status).trim().toLowerCase() === "overdue"
    ).length,
  },
  {
    name: "Paid",
    value: invoices.filter(
      (invoice: any) =>
        String(invoice.status).trim().toLowerCase() === "paid"
    ).length,
  },
  {
    name: "Pending",
    value: invoices.filter(
      (invoice: any) =>
        String(invoice.status).trim().toLowerCase() === "pending"
    ).length,
  },
];

// ========================================
// PROJECT PROGRESS ANALYTICS
// ========================================

const projectProgressStats = projects.reduce(
  (
    stats: {
      completed: number;
      pending: number;
      notStarted: number;
    },
    project: any
  ) => {
    const projectTasks = tasks.filter(
      (task: any) =>
        task.projectId === project.id
    );

    const progress =
      projectTasks.length > 0
        ? Math.round(
            projectTasks.reduce(
              (sum: number, task: any) =>
                sum + (task.progress || 0),
              0
            ) / projectTasks.length
          )
        : 0;

    if (progress === 100) {
      stats.completed++;
    } else if (progress === 0) {
      stats.notStarted++;
    } else {
      // In Progress → Pending
      stats.pending++;
    }

    return stats;
  },
  {
    completed: 0,
    pending: 0,
    notStarted: 0,
  }
);

const projectProgressData = [
  {
    name: "Completed",
    value: projectProgressStats.completed,
  },
  {
    name: "Pending",
    value: projectProgressStats.pending,
  },
  {
    name: "Not Started",
    value: projectProgressStats.notStarted,
  },
];

const totalProjects =
  projectProgressStats.completed +
  projectProgressStats.pending +
  projectProgressStats.notStarted;

const completedPercentage =
  totalProjects > 0
    ? Math.round(
        (projectProgressStats.completed /
          totalProjects) *
          100
      )
    : 0;

const pendingPercentage =
  totalProjects > 0
    ? Math.round(
        (projectProgressStats.pending /
          totalProjects) *
          100
      )
    : 0;

const notStartedPercentage =
  totalProjects > 0
    ? Math.round(
        (projectProgressStats.notStarted /
          totalProjects) *
          100
      )
    : 0;

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

    ||

    (invoice.project?.title || "")
        .toLowerCase()
        .includes(invoiceSearch.toLowerCase())

    ||

    Number(invoice.amount)
        .toString()
        .includes(invoiceSearch)

    ||

    Number(invoice.amount)
        .toLocaleString("en-IN")
        .includes(invoiceSearch)

    ||

    (invoice.status || "")
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

const getDocumentIcon = (
  fileType?: string | null,
  fileName?: string
) => {
  const type =
    (
      fileType ||
      fileName?.split(".").pop() ||
      ""
    ).toLowerCase();

  if (["pdf"].includes(type)) {
    return (
      <img
        src="/file-icons/pdf-icon.png"
        alt="PDF"
        className="h-12 w-12 object-contain"
      />
    );
  }

  if (["doc", "docx"].includes(type)) {
    return (
      <img
        src="/file-icons/word-icon.png"
        alt="Word document"
        className="h-12 w-12 object-contain"
      />
    );
  }

  if (["xls", "xlsx"].includes(type)) {
    return (
      <img
        src="/file-icons/excel-icon.png"
        alt="Excel"
        className="h-12 w-12 object-contain"
      />
    );
  }

  if (["csv"].includes(type)) {
    return (
      <img
        src="/file-icons/csv-icon.png"
        alt="CSV"
        className="h-12 w-12 object-contain"
      />
    );
  }

  // IMPORTANT: PPT + PPTX
  if (["ppt", "pptx"].includes(type)) {
    return (
      <img
        src="/file-icons/powerpoint-icon.png"
        alt="PowerPoint"
        className="h-12 w-12 object-contain"
      />
    );
  }

  // FALLBACK
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      <File className="h-7 w-7" />
    </div>
  );
};

const detectMeetingPlatform = (url: string) => {
  const link = url.trim().toLowerCase();

  if (link.includes("meet.google.com")) {
    return "Google Meet";
  }

  if (link.includes("zoom.us")) {
    return "Zoom";
  }

  if (
    link.includes("teams.microsoft.com") ||
    link.includes("teams.live.com")
  ) {
    return "Microsoft Teams";
  }

  if (link.includes("slack.com")) {
    return "Slack";
  }

  if (
    link.includes("zoho.com") ||
    link.includes("zoho.meet")
  ) {
    return "Zoho Meeting";
  }

  return "";
};

const getMeetingPlatform = (
  meeting: any
) => {
  // USE SAVED PLATFORM FIRST
  if (
    meeting.platform &&
    meeting.platform !== "Not specified"
  ) {
    return meeting.platform;
  }

  // FALLBACK FOR OLD MEETINGS
  const link =
    meeting.meetingLink
      ?.toLowerCase() || "";

  if (
    link.includes("meet.google.com") ||
    link.includes("google")
  ) {
    return "Google Meet";
  }

  if (
    link.includes("teams.microsoft.com") ||
    link.includes("microsoft")
  ) {
    return "Microsoft Teams";
  }

  if (
    link.includes("zoom.us") ||
    link.includes("zoom.com")
  ) {
    return "Zoom";
  }

  if (
    link.includes("zoho.com")
  ) {
    return "Zoho Meeting";
  }

  if (
    link.includes("slack.com")
  ) {
    return "Slack";
  }

  return null;
};

const getMeetingPlatformIcon = (
  platform?: string | null
) => {
  if (!platform) return null;

  const normalized =
    platform
      .toLowerCase()
      .trim();

  if (
    normalized.includes("google")
  ) {
    return "/Meetings_platform_icons/Google_meeting_icon.png";
  }

  if (
    normalized.includes("microsoft") ||
    normalized.includes("teams")
  ) {
    return "/Meetings_platform_icons/Microsoft_meeting_icon.png";
  }

  if (
    normalized.includes("zoom")
  ) {
    return "/Meetings_platform_icons/Zoom_meeting_icon.png";
  }

  if (
    normalized.includes("zoho")
  ) {
    return "/Meetings_platform_icons/Zoho_meeting_icon.png";
  }

  if (
    normalized.includes("slack")
  ) {
    return "/Meetings_platform_icons/Slack_meeting_icon.png";
  }

  return null;
};

// =====================================
// FORMAT MEETING DATE
// =====================================

const formatMeetingDate = (
  date?: string
) => {
  if (!date) return "No date";

  const parsedDate =
    new Date(`${date}T00:00:00`);

  if (isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// =====================================
// FORMAT TIME
// =====================================

const formatMeetingTime = (
  time?: string
) => {
  if (!time) return "";

  const [hours, minutes] =
    time.split(":").map(Number);

  const date = new Date();

  date.setHours(
    hours,
    minutes || 0,
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
};


// =====================================
// CALCULATE END TIME
// duration is assumed to be in minutes
// ===================================

const getMeetingEndTime = (
  time?: string | null,
  duration?: number | string | null
) => {
  if (!time || !duration) {
    return "";
  }

  const durationMinutes = Number(duration);

  if (
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0
  ) {
    return "";
  }

  // Expected input:
  // "02:07 PM"
  // "12:30 AM"
  const match = time
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return "";
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "";
  }

  // Convert 12-hour → minutes from midnight
  if (meridiem === "AM") {
    if (hours === 12) {
      hours = 0;
    }
  } else {
    if (hours !== 12) {
      hours += 12;
    }
  }

  let totalMinutes =
    hours * 60 +
    minutes +
    durationMinutes;

  // Keep inside a 24-hour day
  totalMinutes =
    totalMinutes % (24 * 60);

  let endHours = Math.floor(
    totalMinutes / 60
  );

  const endMinutes =
    totalMinutes % 60;

  const endMeridiem =
    endHours >= 12 ? "PM" : "AM";

  let displayHours =
    endHours % 12;

  if (displayHours === 0) {
    displayHours = 12;
  }

  return `${String(displayHours).padStart(2, "0")}:${String(
    endMinutes
  ).padStart(2, "0")} ${endMeridiem}`;
};

const getMeetingStartDateTime = (
  date?: string | null,
  time?: string | null
) => {
  if (!date || !time) {
    return null;
  }

  const match = time
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  // Convert 12-hour time to 24-hour internally
  if (meridiem === "AM") {
    if (hours === 12) {
      hours = 0;
    }
  } else {
    if (hours !== 12) {
      hours += 12;
    }
  }

  const [year, month, day] =
    date.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
    0
  );
};


const getMeetingStatus = (
  meeting: any
) => {
  const startTime =
    getMeetingStartDateTime(
      meeting.date,
      meeting.time
    );

  if (!startTime) {
    return "Scheduled";
  }

  const durationMinutes =
    Number(meeting.duration) || 0;

  const endTime =
    new Date(
      startTime.getTime() +
        durationMinutes * 60 * 1000
    );

  const now = new Date();

  // Before meeting
  if (now < startTime) {
    return "Scheduled";
  }

  // First 5 minutes after start
  const fiveMinutesAfterStart =
    new Date(
      startTime.getTime() +
        5 * 60 * 1000
    );

  if (
    now >= startTime &&
    now < fiveMinutesAfterStart
  ) {
    return "Meeting Started";
  }

  // After first 5 minutes but before end
  if (
    now >= fiveMinutesAfterStart &&
    now < endTime
  ) {
    return "Meeting In Progress";
  }

  // After meeting duration
  return "Meeting Adjourned";
};

const getMeetingStatusBadge = (
  status: string
) => {
  switch (status) {
    case "Scheduled":
      return "bg-indigo-100 text-indigo-600";

    case "Meeting Started":
      return "bg-indigo-100 text-indigo-600";

    case "Meeting In Progress":
      return "bg-green-100 text-green-600";

    case "Meeting Adjourned":
      return "bg-red-100 text-red-600";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "Unknown size";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const filteredDocuments = [...documents]
  .filter((document) =>
    document.name
      .toLowerCase()
      .includes(documentSearch.toLowerCase())
  )
  .sort((a, b) => {
    if (documentSort === "Newest") {
      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
    }

    if (documentSort === "name") {
      return a.name.localeCompare(b.name);
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

const sortedDocuments = [...filteredDocuments].sort((a, b) => {
  if (documentSort === "Newest") {
    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  }

  if (documentSort === "Oldest") {
    return (
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
    );
  }

  if (documentSort === "Name (A-Z)") {
    return a.name.localeCompare(b.name);
  }

  if (documentSort === "Name (Z-A)") {
    return b.name.localeCompare(a.name);
  }

  return 0;
});

useEffect(() => {
  const loadCsvFile = async () => {
    if (!selectedDocument) {
      setCsvData([]);
      return;
    }

    const fileType = getFileExtension(selectedDocument.fileType);

    if (fileType !== "csv") {
      setCsvData([]);
      return;
    }

    try {
      setCsvLoading(true);

      const response = await fetch(selectedDocument.fileUrl);

      if (!response.ok) {
        throw new Error("Failed to load CSV file");
      }

      const text = await response.text();

      const rows = text
        .trim()
        .split(/\r?\n/)
        .map((row) =>
          row.split(",").map((cell) => cell.trim())
        );

      setCsvData(rows);
    } catch (error) {
      console.error("CSV PREVIEW ERROR:", error);
      setCsvData([]);
    } finally {
      setCsvLoading(false);
    }
  };

  loadCsvFile();
}, [selectedDocument]);

useEffect(() => {
  const loadExcelFile = async () => {
    if (!selectedDocument) {
      setExcelData([]);
      setExcelSheets([]);
      setSelectedSheet("");
      return;
    }

    const fileType = getFileExtension(selectedDocument.fileType);

    if (!["xls", "xlsx"].includes(fileType)) {
      setExcelData([]);
      setExcelSheets([]);
      setSelectedSheet("");
      return;
    }

    try {
      setExcelLoading(true);

      const response = await fetch(selectedDocument.fileUrl);

      if (!response.ok) {
        throw new Error("Failed to load Excel file");
      }

      const arrayBuffer = await response.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
      });

      const sheets = workbook.SheetNames;

      setExcelSheets(sheets);

      if (sheets.length === 0) {
        setExcelData([]);
        return;
      }

      const firstSheet = sheets[0];

      setSelectedSheet(firstSheet);

      const worksheet = workbook.Sheets[firstSheet];

      const data = XLSX.utils.sheet_to_json(
        worksheet,
        {
          header: 1,
          defval: "",
        }
      ) as string[][];

      setExcelData(
        data.map((row) =>
          row.map((cell) => String(cell ?? ""))
        )
      );
    } catch (error) {
      console.error("EXCEL PREVIEW ERROR:", error);

      setExcelData([]);
      setExcelSheets([]);
      setSelectedSheet("");
    } finally {
      setExcelLoading(false);
    }
  };

  loadExcelFile();
}, [selectedDocument]);



useEffect(() => {
  const loadDocxFile = async () => {
    if (!selectedDocument) {
      setDocxHtml("");
      return;
    }

    const fileType = getFileExtension(
      selectedDocument.fileType
    );

    if (fileType !== "docx") {
      setDocxHtml("");
      return;
    }

    try {
      setDocxLoading(true);

      const response = await fetch(
        selectedDocument.fileUrl
      );

      if (!response.ok) {
        throw new Error("Failed to load DOCX file");
      }

      const arrayBuffer =
        await response.arrayBuffer();

      const result =
        await mammoth.convertToHtml({
          arrayBuffer,
        });

      setDocxHtml(result.value);
    } catch (error) {
      console.error("DOCX PREVIEW ERROR:", error);
      setDocxHtml("");
    } finally {
      setDocxLoading(false);
    }
  };

  loadDocxFile();
}, [selectedDocument]);

useEffect(() => {
  if (!pptxData?.slides?.length) return;

  const handleKeyDown = (
    event: KeyboardEvent
  ) => {
    // Don't change slides while typing
    const target = event.target as HTMLElement;

    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    ) {
      return;
    }

    // Previous slide
    if (event.key === "ArrowLeft") {
      setCurrentSlide((prev) =>
        Math.max(prev - 1, 0)
      );
    }

    // Next slide
    if (event.key === "ArrowRight") {
      setCurrentSlide((prev) =>
        Math.min(
          prev + 1,
          pptxData.slides.length - 1
        )
      );
    }
  };

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleKeyDown
    );
  };
}, [pptxData]);

useEffect(() => {
  const container =
    thumbnailContainerRef.current;

  if (!container) return;

  const activeThumbnail =
    container.querySelector(
      `[data-slide-index="${currentSlide}"]`
    );

  activeThumbnail?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}, [currentSlide]);

const slides = pptxData?.slides || [];

const safeCurrentSlide = Math.min(
  Math.max(currentSlide, 0),
  Math.max(slides.length - 1, 0)
);

const slide = slides[safeCurrentSlide];

const SLIDE_WIDTH = pptxData?.size?.width || 960;
const SLIDE_HEIGHT = pptxData?.size?.height || 540;

useEffect(() => {
  const updateSlideScale = () => {
    if (!slidePreviewRef.current) return;

    const container =
      slidePreviewRef.current;

    const containerWidth =
      container.clientWidth;

    const containerHeight =
      container.clientHeight;

    const widthScale =
      containerWidth / SLIDE_WIDTH;

    const heightScale =
      containerHeight / SLIDE_HEIGHT;

    setSlideScale(
      Math.min(widthScale, heightScale)
    );
  };

  updateSlideScale();

  const resizeObserver =
    new ResizeObserver(updateSlideScale);

  if (slidePreviewRef.current) {
    resizeObserver.observe(
      slidePreviewRef.current
    );
  }

  return () => {
    resizeObserver.disconnect();
  };
}, [SLIDE_WIDTH, SLIDE_HEIGHT, currentSlide]);

useEffect(() => {
  if (!isFullscreenPreview) return;

  activeThumbnailRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}, [
  currentSlide,
  isFullscreenPreview,
]);

useEffect(() => {
  const updateSlideScale = () => {
    const container = slidePreviewRef.current;

    if (!container || !pptxData) return;

    const slideWidth =
      Number(pptxData.size?.width) || 960;

    const slideHeight =
      Number(pptxData.size?.height) || 540;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (!containerWidth || !containerHeight) return;

    // Space around the slide
    const horizontalPadding = 24;
    const verticalPadding = 24;

    const availableWidth =
      containerWidth - horizontalPadding;

    const availableHeight =
      containerHeight - verticalPadding;

    const widthScale =
      availableWidth / slideWidth;

    const heightScale =
      availableHeight / slideHeight;

    // Use the smaller scale so the complete slide fits
    const nextScale = Math.min(
      widthScale,
      heightScale,
      1
    );

    setSlideScale(nextScale);
  };

  updateSlideScale();

  const resizeObserver = new ResizeObserver(() => {
    updateSlideScale();
  });

  if (slidePreviewRef.current) {
    resizeObserver.observe(slidePreviewRef.current);
  }

  window.addEventListener(
    "resize",
    updateSlideScale
  );

  return () => {
    resizeObserver.disconnect();

    window.removeEventListener(
      "resize",
      updateSlideScale
    );
  };
}, [pptxData]);

const handleExcelSheetChange = async (
  sheetName: string
) => {
  if (!selectedDocument) return;

  try {
    setSelectedSheet(sheetName);
    setExcelLoading(true);

    const response = await fetch(
      selectedDocument.fileUrl
    );

    if (!response.ok) {
      throw new Error("Failed to load Excel file");
    }

    const arrayBuffer =
      await response.arrayBuffer();

    const workbook = XLSX.read(
      arrayBuffer,
      {
        type: "array",
      }
    );

    const worksheet =
      workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(
      worksheet,
      {
        header: 1,
        defval: "",
      }
    ) as string[][];

    setExcelData(
      data.map((row) =>
        row.map((cell) => String(cell ?? ""))
      )
    );
  } catch (error) {
    console.error(
      "SHEET CHANGE ERROR:",
      error
    );
  } finally {
    setExcelLoading(false);
  }
};

const loadPptxPreview = async (document: any) => {
  try {
    setPptxLoading(true);
    setPptxData(null);
    setCurrentSlide(0);

    console.log("1. START LOADING");

    const response = await fetch(document.fileUrl);

    if (!response.ok) {
      throw new Error("Failed to load PPTX file");
    }

    console.log("2. FETCH COMPLETED");

    const arrayBuffer = await response.arrayBuffer();

    console.log(
      "3. ARRAY BUFFER MB:",
      (arrayBuffer.byteLength / 1024 / 1024).toFixed(2)
    );

    console.log("4. STARTING PARSE");

    const parsedData = await parse(arrayBuffer, {
      imageMode: "base64",
      videoMode: "none",
      audioMode: "none",
    });

    console.log("5. PARSE COMPLETED");

    console.log(
      "6. TOTAL SLIDES:",
      parsedData.slides?.length
    );

    console.log("7. BEFORE SET PPTX DATA");

    setPptxData(parsedData);

    console.log("8. SET PPTX DATA COMPLETED");

  } catch (error) {
    console.error("PPTX PREVIEW ERROR:", error);
    setPptxData(null);
  } finally {
    setPptxLoading(false);
  }
};

const handleShareDocument = async () => {
  if (!selectedDocument) return;

  const shareUrl =
  `${process.env.NEXT_PUBLIC_APP_URL}${selectedDocument.fileUrl}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: selectedDocument.name,
        text: `Check out this file: ${selectedDocument.name}`,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("File link copied to clipboard");
    }
  } catch (error) {
    // User cancelling the share dialog should not show an error
    console.log("Share cancelled or failed:", error);
  }
};

const handleDownload = () => {
  if (!selectedDocument?.fileUrl) {
    return;
  }

  const link = document.createElement("a");

  link.href = selectedDocument.fileUrl;
  link.download =
    selectedDocument.name ||
    `document.${selectedDocument.fileType}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getFileExtension = (fileType?: string | null) => {
  return (fileType || "").toLowerCase().replace(".", "");
};

function normalizePptHtml(html: string) {
  if (!html) return "";

  return html
    .replace(
      /font-size:\s*([\d.]+)pt/gi,
      (_, size) => {
        const px = Number(size) * (96 / 72);

        return `font-size:${px}px`;
      }
    )
    .replace(/margin-top:\s*[^;"]+;?/gi, "margin-top:0;")
    .replace(/margin-bottom:\s*[^;"]+;?/gi, "margin-bottom:0;")
    .replace(/margin-left:\s*[^;"]+;?/gi, "margin-left:0;")
    .replace(/margin-right:\s*[^;"]+;?/gi, "margin-right:0;");
}

function getPptText(html: string | undefined) {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

const ShapeRenderer = ({
  element,
}: {
  element: any;
}) => {
  const shapeType = String(
    element.shapeType ||
    element.geom ||
    "rect"
  ).toLowerCase();

  const fillColor =
    element.fill?.type === "color" &&
    element.fill?.value
      ? element.fill.value
      : "transparent";

  const borderWidth =
    Number(element.borderWidth) || 0;

  const borderColor =
    element.borderColor || "transparent";

  const borderType =
    element.borderType || "solid";

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,

    width: "100%",
    height: "100%",

    boxSizing: "border-box",

    backgroundColor: fillColor,

    border:
      borderWidth > 0
        ? `${borderWidth}px ${borderType} ${borderColor}`
        : "none",

    pointerEvents: "none",
  };

  /* =========================
     ELLIPSE / CIRCLE
  ========================= */

  if (
    shapeType.includes("ellipse") ||
    shapeType.includes("circle") ||
    shapeType === "oval"
  ) {
    return (
      <div
        style={{
          ...baseStyle,
          borderRadius: "50%",
        }}
      />
    );
  }

  /* =========================
     ROUNDED RECTANGLE
  ========================= */

  if (
    shapeType.includes("roundrect") ||
    shapeType.includes("round") ||
    shapeType.includes("rounded")
  ) {
    return (
      <div
        style={{
          ...baseStyle,
          borderRadius: "18%",
        }}
      />
    );
  }

  /* =========================
     LINE
  ========================= */

  if (
    shapeType === "line" ||
    shapeType.includes("line")
  ) {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",

          width: "100%",
          height: 0,

          borderTop:
            borderWidth > 0
              ? `${borderWidth}px ${borderType} ${borderColor}`
              : `1px solid ${borderColor}`,

          transform: "translateY(-50%)",
          transformOrigin: "center",
        }}
      />
    );
  }

  /* =========================
     TRIANGLE
  ========================= */

  if (shapeType.includes("triangle")) {
    return (
      <div
        style={{
          width: 0,
          height: 0,

          borderLeft: `${Number(element.width) / 2}px solid transparent`,
          borderRight: `${Number(element.width) / 2}px solid transparent`,
          borderBottom: `${Number(element.height)}px solid ${fillColor}`,
        }}
      />
    );
  }

  /* =========================
     DIAMOND
  ========================= */

  if (shapeType.includes("diamond")) {
    return (
      <div
        style={{
          ...baseStyle,

          width: "70.71%",
          height: "70.71%",

          left: "14.645%",
          top: "14.645%",

          transform: "rotate(45deg)",
          transformOrigin: "center",

          overflow: "hidden",
        }}
      />
    );
  }

  /* =========================
     ARC / CONNECTED / CUSTOM
     
     Safe fallback
  ========================= */

  return (
    <div
      style={baseStyle}
    />
  );
};
 
type SlideRendererProps = {
  slide: any;
  slideWidth: number;
  slideHeight: number;
  scale?: number;
};

const getPptTextData = (html: string | undefined) => {
  const fallback = {
    text: "",
    fontSize: 24,
    fontFamily: "Arial",
    color: "#000000",
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "left",
  };

  if (!html) return fallback;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const firstStyledElement =
    doc.querySelector("[style]") || doc.body;

  const styleText =
    firstStyledElement.getAttribute("style") || "";

  const getStyleValue = (property: string) => {
    const match = styleText.match(
      new RegExp(
        `${property}\\s*:\\s*([^;]+)`,
        "i"
      )
    );

    return match
      ? match[1].trim()
      : "";
  };

  return {
    text: doc.body.innerText?.trim() || "",

    // Keep as fallback only
    fontSize: 24,

    fontFamily:
      getStyleValue("font-family") ||
      fallback.fontFamily,

    color:
      getStyleValue("color") ||
      fallback.color,

    fontWeight:
      getStyleValue("font-weight") ||
      fallback.fontWeight,

    fontStyle:
      getStyleValue("font-style") ||
      fallback.fontStyle,

    textAlign:
      getStyleValue("text-align") ||
      fallback.textAlign,
  };
};

const PptTextRenderer = ({
  element,
  textData,
}: {
  element: any;
  textData: any;
}) => {
  const html =
    typeof element.content === "string"
      ? element.content
      : "";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,

        display: "flex",

        justifyContent:
          textData.textAlign === "center"
            ? "center"
            : textData.textAlign === "right"
            ? "flex-end"
            : "flex-start",

        alignItems:
          element.vAlign === "down"
            ? "flex-end"
            : element.vAlign === "mid"
            ? "center"
            : "flex-start",

        /*
          IMPORTANT:
          Do not clip PPT text.
        */
        overflow: "visible",

        padding: 0,
        margin: 0,

        zIndex: 10,
      }}
    >
      <div
        className="ppt-text-content"
        style={{
          width: "100%",

          /*
            Do not force text to remain inside
            an incorrect parsed height.
          */
          minHeight: "100%",
          height: "auto",

          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          wordBreak: "normal",

          fontSize: `${textData.fontSize}px`,
          fontFamily: textData.fontFamily,
          color: textData.color,
          fontWeight: textData.fontWeight,
          fontStyle: textData.fontStyle,

          lineHeight: 1.2,

          padding: 0,
          margin: 0,

          overflow: "visible",
        }}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
};

const SlideRenderer = ({
  slide,
  slideWidth,
  slideHeight,
  scale = 1,
}: SlideRendererProps) => {
  if (!slide) return null;

  const scaledWidth = slideWidth * scale;
  const scaledHeight = slideHeight * scale;
  const slideBackground =
  slide?.fill?.value ||
  slide?.fill?.color ||
  slide?.background?.value ||
  slide?.background?.color ||
  slide?.backgroundColor ||
  "#ffffff";

  return (
    <div
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* ORIGINAL PPT CANVAS */}
      <div
        className="absolute top-0 left-0 overflow-hidden"
        style={{
          width: `${slideWidth}px`,
          height: `${slideHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: slideBackground,
        }}
      >
        {(slide.elements || []).map(
          (element: any, index: number) => {
            const left = Number(element.left) || 0;
            const top = Number(element.top) || 0;
            const width = Number(element.width) || 0;
            const height = Number(element.height) || 0;

            const hasTextContent =
              typeof element.content === "string" &&
              element.content.trim().length > 0;

            const isImage =
              element.type === "image";

            const isShape =
              element.type === "shape";

            const isText =
              !isImage &&
              hasTextContent;

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  overflow: "hidden",

                  transform: `
                    rotate(${Number(element.rotate) || 0}deg)
                    scaleX(${element.isFlipH ? -1 : 1})
                    scaleY(${element.isFlipV ? -1 : 1})
                  `,

                  transformOrigin: "center center",
                }}
              >
                {/* IMAGE */}
                {isImage &&
                  (element.base64 || element.src) && (
                    <img
                      src={element.base64 || element.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  )}

                {/* SHAPE BACKGROUND */}
                {isShape && (
                  <ShapeRenderer element={element} />
                )}

                {/* TEXT */}
                {isText && (
                  <PptTextRenderer
                    element={element}
                    textData={getPptTextData(
                      element.content
                    )}
                  />
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

const renderSlideThumbnail = (
  slideItem: any,
  slideIndex: number,
  thumbnailWidth = 160
) => {
  const thumbnailScale = thumbnailWidth / SLIDE_WIDTH;

  const thumbnailHeight = SLIDE_HEIGHT * thumbnailScale;

  return (
    <button
      key={slideIndex}
      ref={
        slideIndex === safeCurrentSlide
          ? activeThumbnailRef
          : null
      }
      type="button"
      onClick={() => setCurrentSlide(slideIndex)}
      className={`
        relative
        flex-shrink-0
        overflow-hidden
        rounded-lg
        border-2
        bg-white
        transition
        ${
          slideIndex === safeCurrentSlide
            ? "border-purple-500"
            : "border-gray-700"
        }
      `}
      style={{
        width: `${thumbnailWidth}px`,
        height: `${thumbnailHeight}px`,
      }}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          width: `${thumbnailWidth}px`,
          height: `${thumbnailHeight}px`,
          overflow: "hidden",
        }}
      >
        <SlideRenderer
          slide={slideItem}
          slideWidth={SLIDE_WIDTH}
          slideHeight={SLIDE_HEIGHT}
          scale={thumbnailScale}
        />
      </div>

      <span
        className="
          absolute
          right-1
          bottom-1
          z-10
          min-w-5
          h-5
          px-1
          rounded
          bg-gray-700
          text-white
          text-xs
          flex
          items-center
          justify-center
        "
      >
        {slideIndex + 1}
      </span>
    </button>
  );
};

const pptSlides = pptxData?.slides || [];

const safeFullscreenSlideIndex =
  Math.min(
    Math.max(currentSlide, 0),
    Math.max(pptSlides.length - 1, 0)
  );

const fullscreenSlide =
  pptSlides[safeFullscreenSlideIndex];

const fullscreenSlideWidth =
  pptxData?.size?.width || 960;

const fullscreenSlideHeight =
  pptxData?.size?.height || 540;



useEffect(() => {
  if (!isFullscreenPreview) return;

  const handleFullscreenKeyDown = (
    event: KeyboardEvent
  ) => {
    if (event.key === "Escape") {
      setIsFullscreenPreview(false);
    }
  };

  window.addEventListener(
    "keydown",
    handleFullscreenKeyDown
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleFullscreenKeyDown
    );
  };
}, [isFullscreenPreview]);

useEffect(() => {
  if (!isFullscreenPreview) return;

  const originalOverflow =
    document.body.style.overflow;

  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow =
      originalOverflow;
  };
}, [isFullscreenPreview]);

useEffect(() => {
  if (!isFullscreenPreview) return;

  const container =
    fullscreenSlideContainerRef.current;

  if (!container) return;

  const updateFullscreenScale = () => {
    const { width, height } =
      container.getBoundingClientRect();

    const slides = pptxData?.slides || [];

    if (!slides.length) return;

    const slideWidth =
      pptxData?.size?.width || 960;

    const slideHeight =
      pptxData?.size?.height || 540;

    const widthScale =
      width / slideWidth;

    const heightScale =
      height / slideHeight;

    const nextScale = Math.min(
      widthScale,
      heightScale
    );

    setFullscreenSlideScale(
      Math.max(nextScale, 0.1)
    );
  };

  updateFullscreenScale();

  const resizeObserver =
    new ResizeObserver(() => {
      updateFullscreenScale();
    });

  resizeObserver.observe(container);

  return () => {
    resizeObserver.disconnect();
  };
}, [
  isFullscreenPreview,
  pptxData,
]);

const renderFileViewer = () => {
  if (!selectedDocument) return null;

  const fileType = getFileExtension(selectedDocument.fileType);

  // PDF
  if (fileType === "pdf") {
    return (
      <iframe
        src={selectedDocument.fileUrl}
        className="
          w-full
          h-full
          border-0
          bg-white
        "
        title={selectedDocument.name}
      />
    );
  }

  // IMAGES
  if (["png", "jpg", "jpeg", "webp"].includes(fileType)) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <img
          src={selectedDocument.fileUrl}
          alt={selectedDocument.name}
          className="
            max-w-full
            max-h-full
            object-contain
            rounded-xl
          "
        />
      </div>
    );
  }

  // CSV
if (fileType === "csv") {
  if (csvLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">
          Loading CSV preview...
        </p>
      </div>
    );
  }

  if (csvData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">
          Unable to preview this CSV file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-white">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr>
            {csvData[0].map((header, index) => (
              <th
                key={index}
                className="
                  border-b
                  border-gray-200
                  px-4
                  py-3
                  text-left
                  font-semibold
                  text-gray-700
                  whitespace-nowrap
                "
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {csvData.slice(1).map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition"
            >
              {csvData[0].map((_, columnIndex) => (
                <td
                  key={columnIndex}
                  className="
                    border-b
                    border-gray-100
                    px-4
                    py-3
                    text-gray-700
                    whitespace-nowrap
                  "
                >
                  {row[columnIndex] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// EXCEL
if (["xls", "xlsx"].includes(fileType)) {
  if (excelLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">
          Loading spreadsheet...
        </p>
      </div>
    );
  }

  if (excelData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">
          Unable to preview this spreadsheet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">

      {/* SHEET TABS */}
      {excelSheets.length > 1 && (
        <div
          className="
            shrink-0
            flex
            gap-2
            p-3
            border-b
            border-gray-200
            overflow-x-auto
          "
        >
          {excelSheets.map((sheet) => (
            <button
              key={sheet}
              onClick={() =>
                handleExcelSheetChange(sheet)
              }
              className={`
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                whitespace-nowrap
                transition
                ${
                  selectedSheet === sheet
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {sheet}
            </button>
          ))}
        </div>
      )}

      {/* SPREADSHEET */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-collapse text-sm">
          <tbody>
            {excelData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex === 0
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }
              >
                {row.map((cell, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={`
                      border
                      border-gray-200
                      px-4
                      py-3
                      whitespace-nowrap
                      ${
                        rowIndex === 0
                          ? "font-semibold text-gray-800"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// DOCX
if (fileType === "docx") {
  if (docxLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">
          Loading document...
        </p>
      </div>
    );
  }

  if (!docxHtml) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">
          Unable to preview this document.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        w-full
        h-full
        overflow-auto
        bg-gray-100
        p-6
      "
    >
      <div
        className="
          max-w-4xl
          mx-auto
          bg-white
          shadow-sm
          rounded-lg
          p-10
          min-h-full
        "
      >
        <div
          className="
            prose
            prose-sm
            max-w-none
          "
          dangerouslySetInnerHTML={{
            __html: docxHtml,
          }}
        />
      </div>
    </div>
  );
}

if (fileType === "ppt" || fileType === "pptx") {
  const pdfUrl = selectedDocument?.previewUrl;

  if (!pdfUrl) {
    return (
      <div
        className="
          h-full
          min-h-[300px]
          flex
          items-center
          justify-center
          text-gray-500
        "
      >
        PowerPoint preview is not available.
      </div>
    );
  }

  return <PdfPreview pdfUrl={pdfUrl} />;
}

  // WORD / EXCEL / POWERPOINT
if (
  [
    "doc",
    "ppt",
    "pptx",
  ].includes(fileType)
){
    return (
      <div
        className="
          w-full
          h-full
          flex
          flex-col
          items-center
          justify-center
          text-center
          p-8
        "
      >
        <div className="mb-6">
          {getDocumentIcon(fileType)}
        </div>

        <h3 className="text-xl font-bold text-gray-800">
          {selectedDocument.name}
        </h3>

        <p className="text-gray-500 mt-3 max-w-md">
          This file type cannot be previewed directly in the browser.
          You can download the file to view its complete contents.
        </p>

        <a
          href={selectedDocument.fileUrl}
          download
          className="
            mt-6
            px-6
            py-3
            rounded-xl
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            text-white
            font-medium
            hover:opacity-90
            transition
          "
        >
          Download File
        </a>
      </div>
    );
  }

  // UNKNOWN FILE TYPE
  return (
    <div
      className="
        w-full
        h-full
        flex
        flex-col
        items-center
        justify-center
        text-center
        p-8
      "
    >
      <div className="mb-6">
        {getDocumentIcon(fileType)}
      </div>

      <h3 className="text-xl font-bold text-gray-800">
        {selectedDocument.name}
      </h3>

      <p className="text-gray-500 mt-3">
        Preview is not available for this file type.
      </p>

      <a
        href={selectedDocument.fileUrl}
        download
        className="
          mt-6
          px-6
          py-3
          rounded-xl
          bg-indigo-600
          text-white
          font-medium
        "
      >
        Download File
      </a>
    </div>
  );
};


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
        ? `${client.name}`
        : index === 1
        ? `${client.name}`
        : index === 2
        ? `${client.name}`
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
    budget:"",
    status:""
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

  const [documentData, setDocumentData] = useState<{
  name: string;
  clientId: string;
  projectId: string;
  file: File | null;
}>({
  name: "",
  clientId: "",
  projectId: "",
  file: null,
});

const clientProjects = projects.filter(
  (project) => project.clientId === documentData.clientId
);

const [meetingData, setMeetingData] =
  useState({
    title: "",
    date: "",
    time: "",
    meetingLink: "",
    notes: "",
    status: "Scheduled",
    duration: "",
    platform: "",
    clientId: "",
    projectId: "",
  });

  // ==========================================
// MONTHLY TRACKING
// ==========================================

const getMonthRange = (offset: number = 0) => {
  const date = new Date();

  date.setMonth(date.getMonth() + offset);

  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 1),
  };
};

const getMonthlyCount = (
  items: any[],
  dateField = "createdAt"
) => {
  if (!Array.isArray(items)) {
    return 0;
  }

  const { start, end } = getMonthRange(0);

  return items.filter((item) => {
    if (!item?.[dateField]) return false;

    const date = new Date(item[dateField]);

    return (
      date >= start &&
      date < end
    );
  }).length;
};

const getPreviousMonthlyCount = (
  items: any[],
  dateField = "createdAt"
) => {
  if (!Array.isArray(items)) {
    return 0;
  }

  const { start, end } = getMonthRange(-1);

  return items.filter((item) => {
    if (!item?.[dateField]) return false;

    const date = new Date(item[dateField]);

    return (
      date >= start &&
      date < end
    );
  }).length;
};


// ==========================================
// MONTHLY CHANGE
// ==========================================

const getMonthlyChange = (
  current: number,
  previous: number
) => {

  if (previous === 0 && current === 0) {
    return {
      type: "same",
      value: 0,
    };
  }

  if (previous === 0) {
    return {
      type: "increase",
      value: 100,
    };
  }

  const percentage = Math.round(
    ((current - previous) / previous) * 100
  );

  if (percentage > 0) {
    return {
      type: "increase",
      value: percentage,
    };
  }

  if (percentage < 0) {
    return {
      type: "decrease",
      value: Math.abs(percentage),
    };
  }

  return {
    type: "same",
    value: 0,
  };
};

// ==========================================
// CURRENT MONTH
// ==========================================

const currentMonthClients =
  getMonthlyCount(clients);

const previousMonthClients =
  getPreviousMonthlyCount(clients);


// ==========================================
// PROJECTS
// ==========================================

const currentMonthProjects =
  getMonthlyCount(projects);

const previousMonthProjects =
  getPreviousMonthlyCount(projects);


// ==========================================
// PENDING INVOICES
// ==========================================

const currentMonthPendingInvoices =
  invoices.filter((invoice: any) => {

    if (
      String(invoice.status)
        .trim()
        .toLowerCase() !== "pending"
    ) {
      return false;
    }

    if (!invoice.createdAt) {
      return false;
    }

    const { start, end } =
      getMonthRange(0);

    const date =
      new Date(invoice.createdAt);

    return date >= start && date < end;
  }).length;


const previousMonthPendingInvoices =
  invoices.filter((invoice: any) => {

    if (
      String(invoice.status)
        .trim()
        .toLowerCase() !== "pending"
    ) {
      return false;
    }

    if (!invoice.createdAt) {
      return false;
    }

    const { start, end } =
      getMonthRange(-1);

    const date =
      new Date(invoice.createdAt);

    return date >= start && date < end;
  }).length;


  // ==========================================
// COMPLETED TASKS
// ==========================================

const completedTaskItems = Array.isArray(tasks)
  ? tasks.filter((task: any) => {

      const completedSubtasks =
        task.subtasks?.filter(
          (sub: any) => sub.completed
        ).length || 0;

      const totalSubtasks =
        task.subtasks?.length || 0;

      const progress =
        totalSubtasks > 0
          ? Math.round(
              (completedSubtasks / totalSubtasks) * 100
            )
          : 0;

      return progress === 100;
    })
  : [];


// ==========================================
// CURRENT MONTH COMPLETED TASKS
// ==========================================

const currentMonthCompletedTasks =
  completedTaskItems.filter((task: any) => {

    if (!task.createdAt) {
      return false;
    }

    const { start, end } =
      getMonthRange(0);

    const date =
      new Date(task.createdAt);

    return date >= start && date < end;

  }).length;


// ==========================================
// PREVIOUS MONTH COMPLETED TASKS
// ==========================================

const previousMonthCompletedTasks =
  completedTaskItems.filter((task: any) => {

    if (!task.createdAt) {
      return false;
    }

    const { start, end } =
      getMonthRange(-1);

    const date =
      new Date(task.createdAt);

    return date >= start && date < end;

  }).length;


const clientChange =
  getMonthlyChange(
    currentMonthClients,
    previousMonthClients
  );

const projectChange =
  getMonthlyChange(
    currentMonthProjects,
    previousMonthProjects
  );

const invoiceChange =
  getMonthlyChange(
    currentMonthPendingInvoices,
    previousMonthPendingInvoices
  );

const taskChange =
  getMonthlyChange(
    currentMonthCompletedTasks,
    previousMonthCompletedTasks
  );

const stats = [
  {
    title: "Total Clients",
    value: String(clients.length),
    icon: Users,
    section: "clients",
  },
  {
    title: "Projects",
    value: String(projects.length),
    icon: FolderKanban,
    section: "projects",
  },
  {
    title: "Pending Invoices",
    value: String(
      invoices.filter(isPendingPayment).length
    ),
    icon: CreditCard,
    section: "invoices",
  },
  {
    title: "Tasks Completed",
    value: String(
      Array.isArray(tasks)
        ? tasks.filter(
            (task: any) =>
              task.status === "Completed"
          ).length
        : 0
    ),
    icon: BarChart3,
    section: "tasks",
  },
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
console.log("Projects API response:", data);

setProjects(Array.isArray(data) ? data : []);
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
  try {
    const res = await fetch(
      `/api/subtasks?taskId=${taskId}`
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    setSubtasks(data);

    return data;
  } catch (error) {
    console.error(
      "Failed to fetch subtasks:",
      error
    );

    return [];
  }
};

const toggleSubtask = async (
  subtask: any
) => {
  try {
    const res = await fetch(
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

    if (!res.ok) {
      toast.error(
        "Failed to update subtask"
      );
      return;
    }

    await fetchSubtasks(
      selectedTask.id
    );

    await fetchTasks();

    await fetchProjects();

    await fetchActivities(
      selectedTask.id
    );

  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to update subtask"
    );
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
  setInvoices([]);
}
    }  catch (error) {
    console.error(error);
    }
  };

const fetchDocuments = async () => {
  if (!user?.id) return;

  try {
    const res = await fetch(
      `/api/documents?userId=${user.id}`
    );

    const data = await res.json();

    console.log("Documents API:", res.status, data);

    if (!res.ok) {
      console.error(
        "Failed to fetch documents:",
        data
      );
      return;
    }

    setDocuments(
      Array.isArray(data) ? data : []
    );
  } catch (error) {
    console.error(
      "Failed to fetch documents:",
      error
    );
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
  if (!user?.id) return;

  fetchDocuments();
}, [user?.id]);

useEffect(() => {
  if (!selectedTask) return;

  const latestTask = tasks.find(
    (t: any) => t.id === selectedTask.id
  );

  if (latestTask) {
    setSelectedTask(latestTask);
  }
}, [tasks]);

useEffect(() => {
  if (!user?.id) return;

  const timer = setTimeout(async () => {
    await fetch(
      "/api/notifications/welcome",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }
    );
  }, 20000);

  return () => clearTimeout(timer);
}, [user?.id]);

const visibleNotifications =
  notifications.filter((notification: any) => {
    const age =
      Date.now() -
      new Date(
        notification.createdAt
      ).getTime();

    return (
      age <
      12 * 60 * 60 * 1000
    );
  });

const markAllNotificationsAsRead =
  async () => {
    try {
      const unreadNotifications =
        visibleNotifications.filter(
          (notification: any) =>
            !notification.read
        );

      await Promise.all(
        unreadNotifications.map(
          (notification: any) =>
            markNotificationAsRead(
              notification.id
            )
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

const formatNotificationTime = (
  createdAt: string
) => {
  const date = new Date(createdAt);
  const now = new Date();

  const diff =
    now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return date.toLocaleDateString();
};

const hasUnreadNotifications =
  visibleNotifications.some(
    (notification: any) => !notification.read
  );

const fetchNotifications = async () => {
  if (!user?.id) return;

  try {
    const res = await fetch(
      `/api/notifications?userId=${user.id}`
    );

    if (!res.ok) return;

    const data = await res.json();

    setNotifications(data);
  } catch (error) {
    console.error(
      "Failed to fetch notifications:",
      error
    );
  }
};

const markNotificationAsRead = async (
  notificationId: string
) => {
  try {
    const res = await fetch(
      "/api/notifications",
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id: notificationId,
        }),
      }
    );

    if (!res.ok) {
      console.error(
        "Failed to mark notification as read"
      );
      return;
    }

    setNotifications((prev: any[]) =>
      prev.map((notification: any) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  } catch (error) {
    console.error(error);
  }
};

const handleNotificationClick = async (
  notification: any
) => {
  await markNotificationAsRead(
    notification.id
  );

  switch (notification.entityType) {
    case "client":
      setActiveSection("clients");
      break;

    case "project":
      setActiveSection("projects");
      break;

    case "task":
      setActiveSection("tasks");
      break;

    case "invoice":
      setActiveSection("invoices");
      break;

    case "meeting":
      setActiveSection("meetings");
      break;

    default:
      break;
  }

  setShowNotifications(false);
};

const createWelcomeNotification = async (
  userId: string
) => {
  try {
    const res = await fetch(
      "/api/notifications/welcome",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      }
    );

    return res.ok;
  } catch (error) {
    console.error(
      "WELCOME NOTIFICATION ERROR:",
      error
    );

    return false;
  }
};

const syncNotifications = async () => {
  if (!user?.id) return;

  try {
    const res = await fetch(
      "/api/notifications/sync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }
    );

    if (!res.ok) {
      console.error(
        "Notification sync failed:",
        res.status
      );
      return;
    }
  } catch (error) {
    console.error(
      "Failed to sync notifications:",
      error
    );
  }
};
  
useEffect(() => {
  if (!user?.id) return;

  const syncAndFetchNotifications = async () => {
    await syncNotifications();
    await fetchNotifications();
  };

  syncAndFetchNotifications();
}, [user?.id]);


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
      status: projectData.status,
    }),
  });

  if (res.ok) {

    toast.success("Project updated successfully");

    await fetchNotifications();

    fetchProjects();

    setEditingProject(null);

    setShowProjectModal(false);

    setProjectData({
      title: "",
      description: "",
      deadline: "",
      clientId: "",
      budget: "",
      status: "",
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
  budget: "",
  status: ""
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
  const toastId = toast.loading(
    "Checking project dependencies..."
  );

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

    const data = await res.json();

    if (res.ok) {
      toast.success(
        "Project deleted successfully",
        {
          id: toastId,
        }
      );

      fetchProjects();
      return;
    }

    if (res.status === 409) {
      const related = data.related;

      const items = [];

      if (related.tasks > 0) {
        items.push(
          `${related.tasks} task${
            related.tasks > 1 ? "s" : ""
          }`
        );
      }

      if (related.invoices > 0) {
        items.push(
          `${related.invoices} invoice${
            related.invoices > 1 ? "s" : ""
          }`
        );
      }

      if (related.documents > 0) {
        items.push(
          `${related.documents} document${
            related.documents > 1 ? "s" : ""
          }`
        );
      }

      if (related.meetings > 0) {
        items.push(
          `${related.meetings} meeting${
            related.meetings > 1 ? "s" : ""
          }`
        );
      }

      toast.error(
        `Delete the following related ${items.join(
          ", "
        )} before deleting this project.`,
        {
          id: toastId,
          duration: 5000,
        }
      );

      return;
    }

    toast.error(
      data.error || "Failed to delete project",
      {
        id: toastId,
      }
    );

  } catch (error) {
    console.error(error);

    toast.error(
      "Something went wrong",
      {
        id: toastId,
      }
    );
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
  status: project.status || "",
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
      const createdClient = await res.json();
      await fetch("/api/notifications/event", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: user.id,
    key: `client-${createdClient.id}-created`,
    type: "client_created",
    title: "Client Added",
    message: `Client "${createdClient.name}" has been added successfully.`,
    entityType: "client",
    entityId: createdClient.id,
    priority: "info",
  }),
});
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

      await fetchNotifications();

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
    status: task.status || "Not started",
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
      await fetchNotifications();
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

        const receiptUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}/r/${selectedInvoice.publicReceiptToken}`;

        await navigator.clipboard.writeText(receiptUrl);

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

const openEditDocument = (document: any) => {
  console.log("Editing document:", document);

  setEditingDocument(document);

  setDocumentData({
    name: document.name || "",
    file: null,
    clientId: document.clientId || "",
    projectId: document.projectId || "",
  });

  setShowDocumentModal(true);
};

const createDocument = async () => {
  try {
    if (
      !documentData.name ||
      !documentData.file ||
      !documentData.clientId ||
      !documentData.projectId
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // GET FILE TYPE
    const fileExtension =
      documentData.file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "document";

    // CHECK IF PPT / PPTX
    const isPresentation =
      fileExtension === "ppt" ||
      fileExtension === "pptx";

    // UPLOAD MESSAGE
    const uploadMessage = isPresentation
      ? "Uploading presentation..."
      : `Uploading ${fileExtension.toUpperCase()}...`;

    // SHOW UPLOADING TOAST
    const uploadToastId =
      toast.loading(uploadMessage);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.dismiss(uploadToastId);
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
    formData.append(
      "clientId",
      documentData.clientId
    );
    formData.append(
      "projectId",
      documentData.projectId
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
      // REMOVE LOADING TOAST
      toast.dismiss(uploadToastId);

      // SUCCESS MESSAGE
      if (isPresentation) {
        toast.success(
          "Presentation uploaded successfully"
        );
      } else {
        toast.success(
          `${fileExtension.toUpperCase()} uploaded successfully`
        );
      }
      
      await fetchNotifications();
      // CLOSE MODAL
      setShowDocumentModal(false);

      // ADD NEW DOCUMENT IMMEDIATELY
      setDocuments((prev: any[]) => [
        data,
        ...prev,
      ]);

      // RESET FORM
      setDocumentData({
        name: "",
        file: null,
        clientId: "",
        projectId: "",
      });

      // BACKGROUND SYNC
      fetchDocuments();

    } else {
      // REMOVE LOADING TOAST
      toast.dismiss(uploadToastId);

      toast.error(
        data.error || "Upload failed"
      );
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
  
const updateDocument = async () => {
  try {
    if (!documentData.name || !documentData.clientId) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingDocument) return;

    const formData = new FormData();

    formData.append("id", editingDocument.id);

    formData.append(
      "name",
      documentData.name
    );

    formData.append(
      "clientId",
      documentData.clientId
    );

    formData.append(
      "projectId",
      documentData.projectId || ""
    );

    // ONLY SEND FILE IF USER SELECTED A NEW FILE
    if (documentData.file) {
      formData.append(
        "file",
        documentData.file
      );

      console.log(
        "UPDATING WITH NEW FILE:",
        documentData.file.name
      );

      console.log(
        "NEW FILE SIZE MB:",
        (
          documentData.file.size /
          1024 /
          1024
        ).toFixed(2)
      );
    } else {
      console.log(
        "UPDATING WITHOUT CHANGING FILE"
      );
    }

    const res = await fetch("/api/documents", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();

    console.log("UPDATED DOCUMENT:", data);

    if (res.ok) {
      toast.success("Document updated successfully");

      setShowDocumentModal(false);

      setEditingDocument(null);

      setDocumentData({
        name: "",
        file: null,
        clientId: "",
        projectId: "",
      });

      await fetchDocuments();

    } else {
      toast.error(
        data.error || "Failed to update document"
      );
    }

  } catch (error) {
    console.error(error);

    toast.error("Failed to update document");
  }
};

const createMeeting = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (
      !meetingData.title ||
      !meetingData.clientId ||
      !meetingData.projectId ||
      !meetingData.date ||
      !meetingData.time ||
      !meetingData.duration ||
      !meetingData.meetingLink
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // =====================================
    // AUTO DETECT MEETING PLATFORM
    // =====================================

    const platform = detectMeetingPlatform(
      meetingData.meetingLink
    );

    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: meetingData.title,
        userId: user.id,
        date: meetingData.date,
        time: meetingData.time,
        duration: meetingData.duration,

        // Automatically detected
        platform,

        meetingLink: meetingData.meetingLink,
        notes: meetingData.notes,
        status: "Scheduled",

        clientId: meetingData.clientId,
        projectId: meetingData.projectId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.error || "Failed to create meeting"
      );
      return;
    }

    toast.success("Meeting created successfully");

    await fetchNotifications();

    setMeetings((prev) => [
      data,
      ...prev,
    ]);

    setShowMeetingModal(false);

    setMeetingData({
      title: "",
      clientId: "",
      projectId: "",
      date: "",
      time: "",
      duration: "",
      platform: "",
      meetingLink: "",
      notes: "",
      status: "Scheduled",
    });

  } catch (error) {
    console.error(
      "CREATE MEETING ERROR:",
      error
    );

    toast.error("Something went wrong");
  }
};

const handleEditMeeting = (meeting: any) => {
  setEditingMeeting(meeting);

  setMeetingData({
    title: meeting.title || "",
    clientId: meeting.clientId || "",
    projectId: meeting.projectId || "",
    date: meeting.date || "",
    time: meeting.time || "",
    duration: meeting.duration || "",
    platform: meeting.platform || "",
    meetingLink: meeting.meetingLink || "",
    notes: meeting.notes || "",
    status: meeting.status || "Scheduled",
  });

  setShowMeetingModal(true);
};

const updateMeeting = async () => {
  try {
    if (!editingMeeting) return;

    if (
      !meetingData.title ||
      !meetingData.clientId ||
      !meetingData.projectId ||
      !meetingData.date ||
      !meetingData.time ||
      !meetingData.duration ||
      !meetingData.meetingLink
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // =====================================
    // AUTO DETECT PLATFORM AGAIN
    // =====================================

    const platform = detectMeetingPlatform(
      meetingData.meetingLink
    );

    const res = await fetch("/api/meetings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingMeeting.id,

        title: meetingData.title,
        date: meetingData.date,
        time: meetingData.time,
        duration: meetingData.duration,

        // Re-detect when edited
        platform,

        meetingLink: meetingData.meetingLink,
        notes: meetingData.notes,
        status: meetingData.status,

        clientId: meetingData.clientId,
        projectId: meetingData.projectId,
      }),
    });

    const updatedMeeting =
      await res.json();

    if (!res.ok) {
      toast.error(
        updatedMeeting.error ||
        "Failed to update meeting"
      );
      return;
    }

    toast.success(
      "Meeting updated successfully"
    );

    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === updatedMeeting.id
          ? updatedMeeting
          : meeting
      )
    );

    setShowMeetingModal(false);
    setEditingMeeting(null);

    setMeetingData({
      title: "",
      clientId: "",
      projectId: "",
      date: "",
      time: "",
      duration: "",
      platform: "",
      meetingLink: "",
      notes: "",
      status: "Scheduled",
    });

  } catch (error) {
    console.error(
      "UPDATE MEETING ERROR:",
      error
    );

    toast.error("Something went wrong");
  }
};

const handleCopyMeetingLink = async (
  meetingLink: string
) => {
  try {
    await navigator.clipboard.writeText(
      meetingLink
    );

    toast.success("Meeting link copied");
  } catch (error) {
    console.error(
      "COPY MEETING LINK ERROR:",
      error
    );

    toast.error(
      "Failed to copy meeting link"
    );
  }
};


const handleDeleteMeeting = async (id: string) => {
  try {
    const response = await fetch("/api/meetings", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to delete meeting"
      );
    }

    setMeetings((prev) =>
      prev.filter((meeting) => meeting.id !== id)
    );

    toast.success("Meeting deleted successfully");

  } catch (error) {
    console.error("DELETE MEETING ERROR:", error);

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
        <div className="mb-9">
  <div className="flex items-center gap-2.5">

    {/* Logo */}
    <div
      className="
        w-9
        h-9
        rounded-xl
        bg-gradient-to-r
        from-indigo-700
        to-purple-600
        flex
        items-center
        justify-center
        text-white
        font-bold
        text-lg
        shadow-sm
      "
    >
      F
    </div>

    {/* Brand Name */}
    <h1 className="text-xl font-bold text-gray-900">
      FlowSync
    </h1>

  </div>
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
            onClick={() =>
              setActiveSection("ai-email")
            }
            className="w-full"
          >
            <SidebarItem
               icon={Astroid}
               label="AI Email"
               active={
                activeSection === "ai-email"
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
            {/* ======================================== */}
{/* DASHBOARD HEADER */}
{/* ======================================== */}

<div className="mb-10 flex items-start justify-between gap-6">

  {/* LEFT — WELCOME */}
  <div>

    <h2 className="text-3xl font-bold text-gray-900">
      Welcome back,{" "}
      {user?.user_metadata?.name ||
        user?.email?.split("@")[0]} 👋
    </h2>

    <p className="text-gray-500 mt-2">
      Manage your clients, projects, invoices, and workflow
      in one place.
    </p>

  </div>


  {/* RIGHT — NOTIFICATION + PROFILE */}
  <div className="shrink-0">

    {/* Put the notification/profile JSX here */}
    {/* ======================================== */}
{/* TOP RIGHT HEADER ACTIONS */}
{/* ======================================== */}

<div className="flex items-center gap-3">

  {/* ====================================== */}
  {/* NOTIFICATION */}
  {/* ====================================== */}

  <div className="relative">

    <button
      type="button"
      onClick={() => {
        setShowNotifications((prev) => !prev);
        setShowProfileMenu(false);
      }}
      className="
        relative
        w-10
        h-10
        rounded-full
        border
        border-gray-200
        bg-gray-50
        flex
        items-center
        justify-center
        text-gray-600
        hover:bg-gray-100
        transition
      "
      aria-label="Notifications"
    >

      <Bell
        size={18}
        strokeWidth={1.8}
      />

      {/* UNREAD DOT */}
      {hasUnreadNotifications && (
        <span
          className="
            absolute
            top-1
            right-1
            w-2.5
            h-2.5
            rounded-full
            bg-indigo-600
            border-2
            border-white
          "
        />
      )}

    </button>


    {/* NOTIFICATION DROPDOWN */}

    {showNotifications && (
      <div
        className="
          absolute
          right-0
          top-12
          w-[400px]
          bg-white
          border
          border-gray-200
          rounded-2xl
          shadow-xl
          z-50
          overflow-hidden
        "
      >


        {/* HEADER */}
<div
  className="
    px-5
    py-4
    border-b
    border-gray-100
  "
>
  <div className="flex items-center justify-between">
    <h3 className="font-semibold text-gray-900">
      Notifications
    </h3>

    <button
      onClick={markAllNotificationsAsRead}
      className="
        text-xs
        text-indigo-600
        hover:text-indigo-700
        hover:scale-105
        font-medium
        transition-transform
        duration-150
      "
    >
      Mark all as read
    </button>
  </div>

  <p className="
    text-[11px]
    text-gray-400
    mt-2
    leading-4
  ">
    Notifications expire after 12 hrs. View all in Profile → Notification History.
  </p>
</div>

{/* Notification items */}

<div className="max-h-[450px] overflow-y-auto">

  {visibleNotifications.length > 0 ? (
    visibleNotifications.map(
      (notification: any) => (
        <button
          key={notification.id}
          type="button"
          onClick={() =>
            handleNotificationClick(
              notification
            )
          }
          className={`
            w-full
            text-left
            px-5
            py-4
            hover:bg-gray-50
            transition
            border-b
            border-gray-100
            ${
              !notification.read
                ? "bg-indigo-50/30"
                : "bg-white"
            }
          `}
        >

          <div className="flex gap-3">

            {/* ICON */}

            <div
              className="
                w-9
                h-9
                shrink-0
                rounded-full
                bg-indigo-50
                flex
                items-center
                justify-center
              "
            >
              <Bell
                size={17}
                className="text-indigo-600"
              />
            </div>

            {/* CONTENT */}

            <div className="min-w-0 flex-1">

              <div className="flex items-start justify-between gap-2">

                <p
                  className={`
                    text-sm
                    ${
                      notification.read
                        ? "font-medium text-gray-800"
                        : "font-semibold text-gray-900"
                    }
                  `}
                >
                  {notification.title}
                </p>

                {/* UNREAD DOT */}

                {!notification.read && (
                  <span
                    className="
                      mt-1
                      w-2
                      h-2
                      shrink-0
                      rounded-full
                      bg-indigo-600
                    "
                  />
                )}

              </div>

              <p className="text-xs text-gray-500 mt-1 leading-5">
                {notification.message}
              </p>

              <p className="text-[11px] text-gray-400 mt-2">
                {formatNotificationTime(
                  notification.createdAt
                )}
              </p>

            </div>

          </div>

        </button>
      )
    )
  ) : (
    <div className="px-5 py-8 text-center">

      <p className="text-sm text-gray-500">
        No more notifications
      </p>

    </div>
  )}

</div>

      </div>
    )}

  </div>


  {/* ====================================== */}
  {/* PROFILE */}
  {/* ====================================== */}

  <div className="relative">

    <button
      type="button"
      onClick={() => {
        setShowProfileMenu((prev) => !prev);
        setShowNotifications(false);
      }}
      className="
        flex
        items-center
        gap-3
        pl-1
        pr-2
        py-1
        rounded-full
        hover:bg-gray-50
        transition
      "
    >

      {/* DESIGN 6 — GRADIENT CIRCLE INITIAL */}

      <div
        className="
          w-10
          h-10
          rounded-full
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          flex
          items-center
          justify-center
          text-white
          font-semibold
          text-lg
          shrink-0
        "
      >
        {(user?.user_metadata?.name ||
          user?.email?.split("@")[0] ||
          "T")
          .charAt(0)
          .toUpperCase()}
      </div>


      {/* USER INFO */}

      <div className="hidden lg:block text-left">

        <p className="text-sm font-semibold text-gray-900 leading-tight">
          {user?.user_metadata?.name ||
            user?.email?.split("@")[0] ||
            "User"}
        </p>

        <p className="text-xs text-gray-500 mt-0.5">
          Admin
        </p>

      </div>


{showProfileMenu ? (
  <ChevronUp
    size={17}
    className="text-gray-500"
  />
) : (
  <ChevronDown
    size={17}
    className="text-gray-500"
  />
)}

    </button>


    {/* PROFILE DROPDOWN */}

    {showProfileMenu && (
      <div
        className="
          absolute
          right-0
          top-14
          w-[230px]
          bg-white
          border
          border-gray-200
          rounded-2xl
          shadow-xl
          z-50
          p-2
        "
      >

        {/* PROFILE */}

        <button
          type="button"
          onClick={() => {
            setShowProfileMenu(false);
          }}
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-2.5
            rounded-xl
            text-left
            text-sm
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >
          <User
            size={17}
            className="text-gray-500"
          />

          <span>
            Profile
          </span>
        </button>


        {/* COMMUNITY */}

        <button
          type="button"
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-2.5
            rounded-xl
            text-left
            text-sm
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >
          <Users
            size={17}
            className="text-gray-500"
          />

          <span>
            Community
          </span>
        </button>


        {/* Notification History*/}

        <button
  type="button"
  onClick={() => {
    setShowProfileMenu(false);
    setActiveSection("notification-history");
  }}
  className="
    w-full
    flex
    items-center
    gap-3
    px-3
    py-2.5
    text-sm
    text-gray-700
    hover:bg-gray-50
    transition
    text-left
  "
>
  <Bell
    size={17}
    strokeWidth={1.8}
    className="text-gray-500"
  />

  <span>
    Notification History
  </span>
</button>


        {/* SETTINGS */}

        <button
          type="button"
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-2.5
            rounded-xl
            text-left
            text-sm
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >

          <Settings
            size={17}
            className="text-gray-500"
          />

          <span>
            Settings
          </span>

        </button>


        {/* DIVIDER */}

        <div className="border-t border-gray-100 my-2" />


        {/* HELP CENTER */}

        <button
          type="button"
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-2.5
            rounded-xl
            text-left
            text-sm
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >

          <CircleHelp
            size={17}
            className="text-gray-500"
          />

          <span>
            Help center
          </span>

        </button>


        {/* SIGN OUT */}

        <button
          type="button"
          onClick={() => {
            setShowProfileMenu(false);

            // add your sign-out function here
            // e.g. handleSignOut()
          }}
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-2.5
            rounded-xl
            text-left
            text-sm
            text-gray-700
            hover:bg-red-50
            hover:text-red-600
            transition
          "
        >

          <LogOut
            size={17}
            className="text-gray-500"
          />

          <span>
            Sign out
          </span>

        </button>

      </div>
    )}

  </div>

</div>

  </div>

</div>

{/* ========================================= */}
{/* KPI STATS */}
{/* ========================================= */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">

    {/* ===================================== */}
    {/* TOTAL CLIENTS */}
    {/* ===================================== */}

    <div
      className="
        group
        bg-gradient-to-r
        from-indigo-600
        to-purple-600
        rounded-3xl
        p-6
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-400
        translate-x-1
        translate-y-1
        text-white
      "
    >

      <div className="flex items-center justify-between">

        <span className="text-lg font-semibold">
          Total Clients
        </span>

        {/* Circular Arrow */}

        <button
  type="button"
  onClick={() => setActiveSection("clients")}
  aria-label="Go to Clients"
  className="
    w-8
    h-8
    rounded-full
    bg-white
    flex
    items-center
    justify-center
    text-indigo-700
    transition-transform
    duration-300
    group-hover:translate-x-1
    group-hover:-translate-y-1
    cursor-pointer
  "
>
  <ArrowUpRight className="w-4 h-4" />
</button>

      </div>


      {/* VALUE */}

      <h3
        className="
          text-4xl
          font-semibold
          mt-5
        "
      >
        {clients.length}
      </h3>


      {/* MONTHLY CHANGE */}

      <div
        className="
          flex
          items-center
          gap-2
          mt-5
          text-xs
        "
      >

        {clientChange.type === "increase" && (
          <ArrowUpRight className="w-4 h-4" />
        )}

        {clientChange.type === "decrease" && (
          <ArrowDownRight className="w-4 h-4" />
        )}

        {clientChange.type === "same" && (
          <Minus className="w-4 h-4" />
        )}

        <span>
          {clientChange.type === "same"
            ? "No change from last month"
            : `${clientChange.value}% ${
                clientChange.type === "increase"
                  ? "Increased"
                  : "Decreased"
              } from last month`}
        </span>

      </div>

    </div>


    {/* ===================================== */}
    {/* PROJECTS */}
    {/* ===================================== */}

    <div
      className="
        group
        bg-white
        border
        border-gray-200
        rounded-3xl
        p-6
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        translate-x-1
        translate-y-1
      "
    >

      <div className="flex items-center justify-between">

        <span
          className="
            text-lg
            font-semibold
            text-gray-900
          "
        >
          Projects
        </span>


        {/* Circular Arrow */}
        <button
  type="button"
  onClick={() => setActiveSection("projects")}
  aria-label="Go to Projects"
  className="
    w-8
    h-8
    rounded-full
    border
    border-gray-400
    flex
    items-center
    justify-center
    text-gray-900
    transition-transform
    duration-300
    group-hover:translate-x-1
    group-hover:-translate-y-1
    cursor-pointer
  "
>
  <ArrowUpRight className="w-4 h-4" />
</button>

      </div>


      {/* VALUE */}

      <h3
        className="
          text-4xl
          font-semibold
          text-gray-900
          mt-5
        "
      >
        {projects.length}
      </h3>


      {/* MONTHLY CHANGE */}

      <div
        className="
          flex
          items-center
          gap-2
          mt-5
          text-xs
          text-gray-500
        "
      >

        {projectChange.type === "increase" && (
          <ArrowUpRight
            className="w-4 h-4 text-green-600"
          />
        )}

        {projectChange.type === "decrease" && (
          <ArrowDownRight
            className="w-4 h-4 text-red-500"
          />
        )}

        {projectChange.type === "same" && (
          <Minus className="w-4 h-4" />
        )}

        <span>
          {projectChange.type === "same"
            ? "No change from last month"
            : `${projectChange.value}% ${
                projectChange.type === "increase"
                  ? "Increased"
                  : "Decreased"
              } from last month`}
        </span>

      </div>

    </div>


    {/* ===================================== */}
    {/* PENDING INVOICES */}
    {/* ===================================== */}

    <div
      className="
        group
        bg-white
        border
        border-gray-200
        rounded-3xl
        p-6
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        translate-x-1
        translate-y-1
      "
    >

      <div className="flex items-center justify-between">

        <span
          className="
            text-lg
            font-semibold
            text-gray-900
          "
        >
          Pending Invoices
        </span>


        {/* Circular Arrow */}
        <button
  type="button"
  onClick={() => setActiveSection("invoices")}
  aria-label="Go to Invoices"
  className="
    w-8
    h-8
    rounded-full
    border
    border-gray-400
    flex
    items-center
    justify-center
    text-gray-900
    transition-transform
    duration-300
    group-hover:translate-x-1
    group-hover:-translate-y-1
    cursor-pointer
  "
>
  <ArrowUpRight className="w-4 h-4" />
</button>

      </div>


      {/* VALUE */}

      <h3
        className="
          text-4xl
          font-semibold
          text-gray-900
          mt-5
        "
      >
        {
          invoices.filter(
            (invoice: any) =>
              String(invoice.status)
                .trim()
                .toLowerCase() === "pending"
          ).length
        }
      </h3>


      {/* MONTHLY CHANGE */}

      <div
        className="
          flex
          items-center
          gap-2
          mt-5
          text-xs
          text-gray-500
        "
      >

        {invoiceChange.type === "increase" && (
          <ArrowUpRight
            className="w-4 h-4 text-red-500"
          />
        )}

        {invoiceChange.type === "decrease" && (
          <ArrowDownRight
            className="w-4 h-4 text-green-600"
          />
        )}

        {invoiceChange.type === "same" && (
          <Minus className="w-4 h-4" />
        )}

        <span>
          {invoiceChange.type === "same"
            ? "No change from last month"
            : `${invoiceChange.value}% ${
                invoiceChange.type === "increase"
                  ? "Increased"
                  : "Decreased"
              } from last month`}
        </span>

      </div>

    </div>


    {/* ===================================== */}
    {/* TASKS COMPLETED */}
    {/* ===================================== */}

    <div
      className="
        group
        bg-white
        border
        border-gray-200
        rounded-3xl
        p-6
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        translate-x-1
        translate-y-1
      "
    >

      <div className="flex items-center justify-between">

        <span
          className="
            text-lg
            font-semibold
            text-gray-900
          "
        >
          Tasks Completed
        </span>


        {/* Circular Arrow */}
        <button
  type="button"
  onClick={() => setActiveSection("tasks")}
  aria-label="Go to Tasks"
  className="
    w-8
    h-8
    rounded-full
    border
    border-gray-400
    flex
    items-center
    justify-center
    text-gray-900
    transition-transform
    duration-300
    group-hover:translate-x-1
    group-hover:-translate-y-1
    cursor-pointer
  "
>
  <ArrowUpRight className="w-4 h-4" />
</button>

      </div>


      {/* VALUE */}

      <h3
        className="
          text-4xl
          font-semibold
          text-gray-900
          mt-5
        "
      >
        {completedTaskItems.length}
      </h3>


      {/* MONTHLY CHANGE */}

      <div
        className="
          flex
          items-center
          gap-2
          mt-5
          text-xs
          text-gray-500
        "
      >

        {taskChange.type === "increase" && (
          <ArrowUpRight
            className="w-4 h-4 text-green-600"
          />
        )}

        {taskChange.type === "decrease" && (
          <ArrowDownRight
            className="w-4 h-4 text-red-500"
          />
        )}

        {taskChange.type === "same" && (
          <Minus className="w-4 h-4" />
        )}

        <span>
          {taskChange.type === "same"
            ? "No change from last month"
            : `${taskChange.value}% ${
                taskChange.type === "increase"
                  ? "Increased"
                  : "Decreased"
              } from last month`}
        </span>

      </div>

    </div>

  </div>


            {/* Workflow */}
<section className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8 mb-10">
  <h3 className="text-2xl font-bold mb-6 text-gray-900">
    Workflow Pipeline
  </h3>

  <div className="flex items-center gap-3 text-sm font-medium whitespace-nowrap">
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

{/* ======================================== */}
{/* DASHBOARD ANALYTICS */}
{/* ======================================== */}

<section className="space-y-8 mb-10">

  {/* ======================================== */}
  {/* ROW 1 — REVENUE + INVOICE HEALTH */}
  {/* ======================================== */}

  <div className="grid lg:grid-cols-[2fr_1fr] gap-6">

    {/* ======================================== */}
    {/* REVENUE TREND */}
    {/* ======================================== */}

    <div
      className="
        bg-white
        rounded-3xl
        border
        border-gray-100
        shadow-sm
        p-6
        h-[390px]
      "
    >

      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Revenue Trend
      </h3>

      <div className="h-[310px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={revenueData}
            margin={{
              top: 10,
              right: 20,
              left: -3,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Line
  type="monotone"
  dataKey="value"
  stroke="#692fcc"
  strokeWidth={3}
/>

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>


    {/* ======================================== */}
    {/* INVOICE HEALTH */}
    {/* ======================================== */}

<div
  className="
    bg-white
    rounded-3xl
    border
    border-gray-100
    shadow-sm
    p-6
    h-96
  "
>
  <h3 className="text-2xl font-bold mb-4 text-gray-900">
    Invoice Health
  </h3>

  <ResponsiveContainer
    width="100%"
    height="85%"
  >
    <PieChart>

      <Pie
        data={invoiceChartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="42%"
        outerRadius={85}
        innerRadius={0}
        paddingAngle={1}
      >

        {/* ONLY ONE CELL MAP */}
        {invoiceChartData.map((entry, index) => (
          <Cell
            key={`invoice-${entry.name}`}
            fill={
              index === 0
                ? "#c6bee2"
                : index === 1
                ? "#7C3AED"
                : "#A78BFA"
            }
          />
        ))}

      </Pie>

      <Tooltip />

      <Legend
        verticalAlign="bottom"
        align="center"
        layout="horizontal"
        content={({ payload }) => (
          <div className="flex items-center justify-center gap-5 pt-4">

            {payload?.map((entry, index) => {

              const item = invoiceChartData[index];

              return (
                <div
                  key={`legend-${index}`}
                  className="flex items-center gap-1.5"
                >

                  {/* COLOR DOT */}
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: entry.color,
                    }}
                  />

                  {/* LABEL + COUNT */}
                  <span className="text-sm text-gray-600">
                    {item.name} ({item.value})
                  </span>

                </div>
              );
            })}

          </div>
        )}
      />

    </PieChart>
  </ResponsiveContainer>
</div>
</div>


  {/* ======================================== */}
  {/* ROW 2 — CLIENT EARNINGS + PROJECT */}
  {/* ======================================== */}

  <div className="grid lg:grid-cols-[2fr_1fr] gap-6">


    {/* ======================================== */}
    {/* LIFETIME EARNINGS BY CLIENT */}
    {/* ======================================== */}

    <div
      className="
        bg-white
        rounded-3xl
        border
        border-gray-100
        shadow-sm
        p-8
        h-[430px]
      "
    >

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Lifetime Earnings by Client
      </h3>

      <div className="h-[330px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={rankedClients}
            margin={{
              top: 20,
              right: 30,
              left: 10,
              bottom: 20,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            {/* CLIENTS */}
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
            />

            {/* AMOUNT */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `₹${value}`
              }
            />

            <Tooltip
              formatter={(value) =>
                `₹${value}`
              }
            />

            <Bar
  dataKey="revenue"
  fill="#7C3AED"
  radius={[8, 8, 0, 0]}
  animationDuration={1500}
  stroke="none"
></Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

    {/* ======================================== */}
{/* PROJECT PROGRESS */}
{/* ======================================== */}

<div
  className="
    bg-white
    rounded-3xl
    border
    border-gray-100
    shadow-sm
    p-8
    h-[430px]
  "
>

  <h3 className="text-2xl font-bold text-gray-900">
    Project Progress
  </h3>


  <div className="flex flex-col items-center">


    {/* ================================== */}
    {/* SEMI CIRCLE */}
    {/* ================================== */}

    <div className="relative w-[260px] h-[170px] mt-6">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>
            <Pie
  data={projectProgressData}
  dataKey="value"
  nameKey="name"

  startAngle={180}
  endAngle={0}

  cx="50%"
  cy="75%"

  innerRadius={65}
  outerRadius={105}

  paddingAngle={1}
  cornerRadius={4}

  stroke="none"
>

            {projectProgressData.map((entry, index) => (
  <Cell
    key={`project-progress-${entry.name}`}
    fill={
      index === 0
        ? "#7C3AED"   // Completed
        : index === 1
        ? "#A78BFA"   // Pending
        : "#E5E7EB"   // Not Started
    }
  />
))}

          </Pie>


          {/* HOVER TOOLTIP */}

          <Tooltip
            formatter={(value, name) => [
              value,
              name,
            ]}
          />

        </PieChart>

      </ResponsiveContainer>


      {/* ================================== */}
      {/* CENTER VALUE */}
      {/* ================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          bottom-0
          flex
          flex-col
          items-center
          pointer-events-none
        "
      >

        <span className="text-4xl font-bold text-gray-900">
          {completedPercentage}%
        </span>

        <span className="text-sm text-gray-500">
          Completed
        </span>

      </div>

    </div>


    {/* ================================== */}
    {/* LEGEND */}
    {/* ================================== */}

    <div className="w-full mt-6 space-y-4">


      {/* COMPLETED */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span
            className="
              w-3
              h-3
              rounded-full
              bg-indigo-900
            "
          />

          <span className="text-sm text-gray-600">
            Completed
          </span>

        </div>

        <span className="text-sm font-semibold text-gray-900">
          {projectProgressStats.completed}
        </span>

      </div>


      {/* PENDING */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span
            className="
              w-3
              h-3
              rounded-full
              bg-indigo-400
            "
          />

          <span className="text-sm text-gray-600">
            Pending
          </span>

        </div>

        <span className="text-sm font-semibold text-gray-900">
          {projectProgressStats.pending}
        </span>

      </div>


      {/* NOT STARTED */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span
            className="
              w-3
              h-3
              rounded-full
              bg-gray-200
              border
              border-gray-300
            "
          />

          <span className="text-sm text-gray-600">
            Not Started
          </span>

        </div>

        <span className="text-sm font-semibold text-gray-900">
          {projectProgressStats.notStarted}
        </span>

      </div>


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
  transition"
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
                          border-gray-100
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

      <div className="flex items-center gap-3 mt-1">

      
      <button
onClick={() => handleEditClient(client)}
>

  <Pencil
  className="
  h-5
  w-5
  flex gap-3 items-center
  text-gray-400
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
  text-gray-400
  hover:text-red-500
  "
  />

</button>

      </div>

    </div>

    <h3
  className="
    flex
    items-center
    gap-2
    text-2xl
    font-bold
    mt-6
  "
>
  <User className="h-5 w-5 text-muted-foreground" />
  {client.name}
</h3>

    <div className="flex items-center gap-2 text-gray-500 mt-2">
  <Building2 className="h-4 w-4 text-muted-foreground" />

  <span>
    {client.company}
  </span>
</div>


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

{/* ======================================== */}
{/* CLIENT PROFILE DRAWER */}
{/* ======================================== */}

{showClientProfile && selectedClient && (
  <div
    className="
      fixed
      inset-0
      z-50
    "
  >

    {/* BACKDROP */}
    <div
      className="
        absolute
        inset-0
        bg-black/20
      "
      onClick={() => setShowClientProfile(false)}
    />


    {/* DRAWER */}
    <div
      className="
        absolute
        top-0
        right-0
        h-full
        w-[500px]
        max-w-full
        bg-white
        shadow-2xl
        border-l
        border-gray-100
        overflow-y-auto
        p-8
      "
    >

      {/* ======================================== */}
      {/* HEADER */}
      {/* ======================================== */}

      <div className="flex justify-between items-start">

        <div className="min-w-0">

          {/* CLIENT NAME */}
          <div className="flex items-center gap-3">

            <User
              size={24}
              strokeWidth={1.8}
              className="text-gray-500 shrink-0"
            />

            <h1 className="text-4xl font-bold text-gray-900 truncate">
              {selectedClient.name}
            </h1>

          </div>


          {/* COMPANY */}
          <div className="flex items-center gap-2 mt-3">

            <Building2
              size={18}
              strokeWidth={1.8}
              className="text-gray-500 shrink-0"
            />

            <p className="text-gray-500 truncate">
              {selectedClient.company || "No Company"}
            </p>

          </div>

        </div>


        {/* CLOSE */}
        <button
          onClick={() => setShowClientProfile(false)}
          className="
            h-10
            w-10
            shrink-0
            rounded-xl
            flex
            items-center
            justify-center
            text-gray-500
            hover:bg-gray-100
            hover:text-gray-900
            transition
          "
          aria-label="Close client profile"
        >
          <X size={22} />
        </button>

      </div>


      {/* ======================================== */}
      {/* TABS */}
      {/* ======================================== */}

      <div
        className="
          flex
          gap-8
          mt-10
          border-b
          border-gray-200
        "
      >

        <button
          onClick={() =>
            setClientTab("overview")
          }
          className={`
            pb-3
            font-medium
            transition
            ${
              clientTab === "overview"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-900"
            }
          `}
        >
          Overview
        </button>


        <button
          onClick={() =>
            setClientTab("activity")
          }
          className={`
            pb-3
            font-medium
            transition
            ${
              clientTab === "activity"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-900"
            }
          `}
        >
          Activity
        </button>

      </div>


      {/* ======================================== */}
      {/* OVERVIEW */}
      {/* ======================================== */}

      {clientTab === "overview" && (
        <>
          {/*
           * Calculate everything from the current
           * application state.
           *
           * This makes the drawer update immediately
           * when projects/invoices/meetings/documents
           * state changes.
           */}

          {(() => {

            const clientId = selectedClient.id;


            /* ================================ */
            /* CURRENT COUNTS */
            /* ================================ */

            const currentClientProjects =
              projects.filter(
                (project: any) =>
                  project.clientId === clientId
              );

            const currentClientInvoices =
              invoices.filter(
                (invoice: any) =>
                  invoice.clientId === clientId
              );

            const currentClientMeetings =
              meetings.filter(
                (meeting: any) =>
                  meeting.clientId === clientId
              );

            const currentClientDocuments =
              documents.filter(
                (document: any) =>
                  document.clientId === clientId
              );


            /* ================================ */
            /* REVENUE */
            /* ================================ */

            const currentClientRevenue =
              currentClientInvoices.reduce(
                (
                  total: number,
                  invoice: any
                ) =>
                  total +
                  Number(invoice.amount || 0),
                0
              );


            return (
              <div>


                {/* ================================== */}
                {/* KPI CARDS */}
                {/* ================================== */}

                <div className="grid grid-cols-2 gap-4 mt-8">


                  {/* PROJECTS */}

                  <div
                    className="
                      bg-gray-50
                      rounded-2xl
                      p-5
                      border
                      border-gray-100
                    "
                  >

                    <FolderKanban
                      size={21}
                      strokeWidth={1.8}
                      className="text-gray-500"
                    />

                    <div className="text-3xl font-bold mt-5">
                      {currentClientProjects.length}
                    </div>

                    <div className="text-gray-500 mt-1">
                      Projects
                    </div>

                  </div>


                  {/* INVOICES */}

                  <div
                    className="
                      bg-gray-50
                      rounded-2xl
                      p-5
                      border
                      border-gray-100
                    "
                  >

                    <CreditCard
                      size={21}
                      strokeWidth={1.8}
                      className="text-gray-500"
                    />

                    <div className="text-3xl font-bold mt-5">
                      {currentClientInvoices.length}
                    </div>

                    <div className="text-gray-500 mt-1">
                      Invoices
                    </div>

                  </div>


                  {/* MEETINGS */}

                  <div
                    className="
                      bg-gray-50
                      rounded-2xl
                      p-5
                      border
                      border-gray-100
                    "
                  >

                    <CalendarDays
                      size={21}
                      strokeWidth={1.8}
                      className="text-gray-500"
                    />

                    <div className="text-3xl font-bold mt-5">
                      {currentClientMeetings.length}
                    </div>

                    <div className="text-gray-500 mt-1">
                      Meetings
                    </div>

                  </div>


                  {/* DOCUMENTS */}

                  <div
                    className="
                      bg-gray-50
                      rounded-2xl
                      p-5
                      border
                      border-gray-100
                    "
                  >

                    <FileText
                      size={21}
                      strokeWidth={1.8}
                      className="text-gray-500"
                    />

                    <div className="text-3xl font-bold mt-5">
                      {currentClientDocuments.length}
                    </div>

                    <div className="text-gray-500 mt-1">
                      Documents
                    </div>

                  </div>

                </div>


                {/* ================================== */}
                {/* CLIENT DETAILS */}
                {/* ================================== */}

                <div
                  className="
                    mt-8
                    bg-gray-50
                    rounded-2xl
                    p-6
                    border
                    border-gray-100
                  "
                >

                  <div className="flex items-center gap-2 mb-5">

                    <User
                      size={20}
                      strokeWidth={1.8}
                      className="text-gray-500"
                    />

                    <h3 className="text-xl font-bold text-gray-900">
                      Client Details
                    </h3>

                  </div>


                  <div className="space-y-5">

                    {/* EMAIL */}

                    <div>

                      <div className="text-sm text-gray-500">
                        Email
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                       <Mail
                          size={17}
                          strokeWidth={1.8}
                          className="text-gray-500"
                        />

                      <div className="text-gray-900">
                        {selectedClient.email ||
                          "No Email"}
                      </div>

                    </div>
                    </div>


                    {/* COMPANY */}

                    <div>

                      <div className="text-sm text-gray-500">
                        Company
                      </div>

                      <div className="flex items-center gap-2 mt-1">

                        <Building2
                          size={17}
                          strokeWidth={1.8}
                          className="text-gray-500"
                        />

                        <span className="text-gray-900">
                          {selectedClient.company ||
                            "No Company"}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>


                {/* ================================== */}
                {/* REVENUE SUMMARY */}
                {/* KEEPING YOUR EXISTING UI */}
                {/* ================================== */}

                <div
                  className="
                    mt-8
                    bg-gradient-to-r
                    from-indigo-500
                    to-purple-600
                    text-white
                    rounded-2xl
                    p-6
                  "
                >

                  <h3 className="text-xl font-bold">
                    Revenue Summary
                  </h3>

                  <div className="text-4xl font-bold mt-4">
                    ₹{currentClientRevenue}
                  </div>

                  <p className="mt-2">
                    Lifetime value from this client
                  </p>

                </div>


              </div>
            );

          })()}

        </>
      )}


      {/* ======================================== */}
      {/* ACTIVITY TAB */}
      {/* ======================================== */}

      {clientTab === "activity" && (

        <div className="mt-8">

          <div className="flex items-center gap-2 mb-6">

            <Clock3
              size={21}
              strokeWidth={1.8}
              className="text-gray-500"
            />

            <h2 className="text-2xl font-bold text-gray-900">
              Recent Activity
            </h2>

          </div>


          {clientActivities.length === 0 ? (

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

              <Clock3
                size={32}
                strokeWidth={1.6}
                className="
                  mx-auto
                  text-gray-400
                "
              />

              <h3 className="text-lg font-semibold text-gray-700 mt-4">
                No Activities Found
              </h3>

              <p className="text-gray-500 mt-2">
                This client doesn't have any recent
                activities yet.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {clientActivities.map(
                (activity: any, index: number) => {

                  let ActivityIcon = FileText;

                  if (activity.type === "project") {
                    ActivityIcon = FolderKanban;
                  }

                  if (activity.type === "invoice") {
                    ActivityIcon = CreditCard;
                  }

                  if (activity.type === "meeting") {
                    ActivityIcon = CalendarDays;
                  }

                  if (activity.type === "document") {
                    ActivityIcon = FileText;
                  }


                  return (

                    <div
                      key={
                        activity.id ||
                        `${activity.type}-${index}`
                      }
                      className="
                        bg-gray-50
                        rounded-2xl
                        p-5
                        border
                        border-gray-100
                      "
                    >

                      <div className="flex items-start gap-4">

                        {/* ACTIVITY ICON */}

                        <div
                          className="
                            w-10
                            h-10
                            shrink-0
                            rounded-xl
                            bg-gray-100
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <ActivityIcon
                            size={19}
                            strokeWidth={1.8}
                            className="text-gray-500"
                          />

                        </div>


                        {/* ACTIVITY CONTENT */}

                        <div className="min-w-0 flex-1">

                          <div className="font-semibold text-gray-900">

                            {activity.type === "project" &&
                              `Project: ${activity.title}`}

                            {activity.type === "invoice" &&
                              `Invoice: ${activity.title}`}

                            {activity.type === "meeting" &&
                              `Meeting: ${activity.title}`}

                            {activity.type === "document" &&
                              `Document: ${activity.title}`}

                          </div>


                          <p className="text-sm text-gray-500 mt-2">

                            {activity.createdAt
                              ? new Date(
                                  activity.createdAt
                                ).toLocaleString()
                              : "Date not available"}

                          </p>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      )}

    </div>

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
      status: ""
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

  {/* Project Image */}
  <div className="w-14 h-14 flex items-center justify-center">
    <img
      src="/project_1_icon.png"
      alt="Project Icon"
      className="w-full h-full object-contain block"
    />
  </div>

  {/* Actions */}
  <div className="flex gap-3">

    <button
      onClick={() => editProject(project)}
      className="
        text-gray-400
        hover:text-indigo-600
        transition
      "
    >
      <Pencil size={20} />
    </button>

    <button
      onClick={() => deleteProject(project.id)}
      className="
        text-gray-400
        hover:text-red-600
        transition
      "
    >
      <Trash2 size={20} />
    </button>

  </div>

</div>

  {/* Project Name */}
  <h3 className="text-xl font-bold mt-5">
    {project.title}
  </h3>

  {/* Client */}
  <div className="flex items-center gap-2 font-medium mt-1">
                <User className="h-5 w-4 text-muted-foreground" />
  <span className="text-gray-500 ">
    {project.client?.name}
  </span>
  </div>

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
         {

      project.deadline
? new Date(project.deadline).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )
: "Not Set"

    }
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
  <div className="fixed inset-0 z-50">

    {/* ======================================== */}
    {/* BACKDROP */}
    {/* ======================================== */}

    <div
      className="
        absolute
        inset-0
        bg-black/20
      "
      onClick={() => setShowProjectDrawer(false)}
    />


    {/* ======================================== */}
    {/* DRAWER */}
    {/* ======================================== */}

    <div
      className="
        absolute
        top-0
        right-0
        h-full
        w-[500px]
        max-w-full
        bg-white
        shadow-2xl
        overflow-y-auto
        p-8
      "
    >

      {/* ======================================== */}
{/* HEADER */}
{/* ======================================== */}

<div className="flex justify-between items-start">

  <div className="min-w-0">

    {/* Project Title */}
    <div className="flex items-center gap-3">

      <FolderKanban
        size={24}
        strokeWidth={1.8}
        className="text-gray-500 shrink-0"
      />

      <h1 className="text-4xl font-bold text-gray-900 truncate">
        {selectedProject?.title}
      </h1>

    </div>


    {/* Client */}
    <div className="flex items-center gap-2 mt-3">

      <User
        size={18}
        strokeWidth={1.8}
        className="text-gray-500 shrink-0"
      />

      <p className="text-gray-500">
        Client:{" "}
        <span className="text-gray-700 font-medium">
          {selectedProject?.client?.name || "No Client"}
        </span>
      </p>

    </div>

  </div>


  {/* Close */}
  <button
    onClick={() => setShowProjectDrawer(false)}
    className="
      h-10
      w-10
      shrink-0
      rounded-xl
      flex
      items-center
      justify-center
      text-gray-500
      hover:bg-gray-100
      hover:text-gray-900
      transition
    "
  >
    <X size={22} />
  </button>

</div>


      {/* ======================================== */}
      {/* TABS */}
      {/* ======================================== */}

      <div
        className="
          flex
          gap-10
          mt-10
          border-b
          border-gray-200
        "
      >

        <button
          onClick={() => setProjectTab("overview")}
          className={`
            pb-3
            font-medium
            transition
            ${
              projectTab === "overview"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          Overview
        </button>


        <button
          onClick={() => setProjectTab("tasks")}
          className={`
            pb-3
            font-medium
            transition
            ${
              projectTab === "tasks"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          Tasks
        </button>

      </div>


      {/* ======================================== */}
      {/* OVERVIEW TAB */}
      {/* ======================================== */}

      {projectTab === "overview" && (
        <>

          {/* ================================== */}
          {/* SUMMARY CARDS */}
          {/* ================================== */}

          <div className="grid grid-cols-2 gap-4 mt-8">


            {/* TASKS */}

            <div
              className="
                bg-gray-50
                rounded-2xl
                p-5
                border
                border-gray-100
              "
            >

              <Briefcase
                size={22}
                className="text-gray-500"
              />

              <h1 className="text-3xl font-bold mt-5">
                {
                  tasks.filter(
                    (task: any) =>
                      task.projectId === selectedProject?.id
                  ).length
                }
              </h1>

              <p className="text-gray-500 mt-1">
                Tasks
              </p>

            </div>


            {/* INVOICES */}

            <div
              className="
                bg-gray-50
                rounded-2xl
                p-5
                border
                border-gray-100
              "
            >

              <CreditCard
                size={22}
                className="text-gray-500"
              />

              <h1 className="text-3xl font-bold mt-5">
                {
                  invoices.filter(
                    (invoice: any) =>
                      invoice.projectId === selectedProject?.id
                  ).length
                }
              </h1>

              <p className="text-gray-500 mt-1">
                Invoices
              </p>

            </div>


            {/* MEETINGS */}

            <div
              className="
                bg-gray-50
                rounded-2xl
                p-5
                border
                border-gray-100
              "
            >

              <Calendar
                size={22}
                className="text-gray-500"
              />

              <h1 className="text-3xl font-bold mt-5">
                {
                  meetings.filter(
                    (meeting: any) =>
                      meeting.projectId === selectedProject?.id
                  ).length
                }
              </h1>

              <p className="text-gray-500 mt-1">
                Meetings
              </p>

            </div>


            {/* DOCUMENTS */}

            <div
              className="
                bg-gray-50
                rounded-2xl
                p-5
                border
                border-gray-100
              "
            >

              <FileText
                size={22}
                className="text-gray-500"
              />

              <h1 className="text-3xl font-bold mt-5">
                {
                  documents.filter(
                    (document: any) =>
                      document.projectId === selectedProject?.id
                  ).length
                }
              </h1>

              <p className="text-gray-500 mt-1">
                Documents
              </p>

            </div>

          </div>


          {/* ================================== */}
          {/* PROGRESS + REVENUE */}
          {/* ================================== */}

          <div className="grid grid-cols-2 gap-4 mt-8">


            {/* ============================== */}
            {/* PROGRESS */}
            {/* ============================== */}

            <div
              className="
                bg-gray-50
                rounded-3xl
                p-6
                border
                border-gray-100
              "
            >

              <div className="flex items-center gap-2">

                <BarChart3
                  size={20}
                  className="text-gray-500"
                />

                <h2 className="font-semibold text-gray-900">
                  Progress
                </h2>

              </div>


              {/* PROGRESS CIRCLE */}

              <div className="flex justify-center mt-6">

                <div
                  className={`
                    relative
                    w-28
                    h-28
                    rounded-full
                    border-[10px]
                    flex
                    items-center
                    justify-center
                    transition-colors
                    duration-300
                    ${
                      selectedProjectProgress === 100
                        ? "border-green-500"
                        : selectedProjectProgress > 0
                        ? "border-indigo-600"
                        : "border-red-500"
                    }
                  `}
                >

                  <span className="text-3xl font-bold text-gray-900">
                    {selectedProjectProgress}%
                  </span>

                </div>

              </div>


              {/* COMPLETED TASKS */}

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


            {/* ============================== */}
            {/* REVENUE */}
            {/* ============================== */}

            <div
              className="
                bg-gray-50
                rounded-3xl
                p-6
                border
                border-gray-100
              "
            >

              <div className="flex items-center gap-2">

                <Wallet
                  size={20}
                  className="text-gray-500"
                />

                <h2 className="font-semibold text-gray-900">
                  Revenue
                </h2>

              </div>


              <h1 className="text-4xl font-bold text-green-600 mt-8">
                ₹{projectRevenue}
              </h1>


              <p
                className={`
                  mt-4
                  font-medium
                  ${
                    revenuePercentage >= 80
                      ? "text-green-500"
                      : revenuePercentage >= 50
                      ? "text-yellow-500"
                      : "text-red-500"
                  }
                `}
              >
                {revenuePercentage}% of budget achieved
              </p>


              {/* REVENUE BARS */}

              <div className="mt-8 h-12 flex items-end gap-1">

                <div className="w-3 h-4 bg-green-300 rounded" />
                <div className="w-3 h-6 bg-green-400 rounded" />
                <div className="w-3 h-5 bg-green-300 rounded" />
                <div className="w-3 h-8 bg-green-500 rounded" />
                <div className="w-3 h-6 bg-green-400 rounded" />
                <div className="w-3 h-10 bg-green-600 rounded" />

              </div>

            </div>

          </div>


          {/* ================================== */}
          {/* DEADLINE + STATUS */}
          {/* ================================== */}

          <div className="grid grid-cols-2 gap-4 mt-4">


            {/* ============================== */}
            {/* DEADLINE */}
            {/* ============================== */}

            <div
              className="
                bg-gray-50
                rounded-3xl
                p-6
                min-h-[220px]
                border
                border-gray-100
                flex
                flex-col
              "
            >

              <div className="flex items-center gap-2">

                <CalendarDays
                  size={20}
                  className="text-gray-500"
                />

                <h2 className="font-semibold">
                  Deadline
                </h2>

              </div>


              <h1 className="text-2xl font-bold mt-6">
                {
selectedProject?.deadline
?
new Date(selectedProject.deadline).toLocaleDateString(
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

              </h1>


              <p
                className={`
                  text-sm
                  mt-5
                  font-medium
                  ${
                    daysRemaining === null
                      ? "text-gray-500"
                      : daysRemaining < 0
                      ? "text-red-600"
                      : daysRemaining <= 3
                      ? "text-red-500"
                      : daysRemaining <= 7
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                `}
              >

                {daysRemaining === null
                  ? "No Deadline"
                  : daysRemaining < 0
                  ? "Deadline is Over"
                  : daysRemaining === 0
                  ? "Due Today"
                  : daysRemaining === 1
                  ? "Due Tomorrow"
                  : `Due in ${daysRemaining} days`}

              </p>


              <div className="mt-auto pt-6">

                <span
                  className={`
                    inline-flex
                    items-center
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

                  {priority === "Overdue"
                    ? "🔴 Overdue"
                    : priority === "High Priority"
                    ? "🔴 High Priority"
                    : priority === "Medium Priority"
                    ? "🟡 Medium Priority"
                    : priority === "Low Priority"
                    ? "🟢 Low Priority"
                    : "⚪ No Priority"}

                </span>

              </div>

            </div>


            {/* ============================== */}
            {/* STATUS */}
            {/* ============================== */}

            <div
              className="
                bg-gray-50
                rounded-3xl
                p-6
                min-h-[220px]
                border
                border-gray-100
              "
            >

              <div className="flex items-center gap-2">

                <h2 className="font-semibold">
                  Status
                </h2>

              </div>


              <div className="flex items-center justify-center h-[150px]">

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
                        : "bg-indigo-100 text-indigo-700"
                    }
                  `}
                >

                  {selectedProjectProgress === 100 ? (
                    <>
                      <CheckCircle2 size={16} />
                      Completed
                    </>
                  ) : selectedProjectTasks.length === 0 ? (
                    <>
                      <Circle size={16} />
                      Not Started
                    </>
                  ) : (
                    <>
                      <Clock3 size={16} />
                      In Progress
                    </>
                  )}

                </span>

              </div>

            </div>

          </div>
          {/* ======================================== */}
          {/* DESCRIPTION */}
          {/* ======================================== */}

          <div
            className="
              bg-gray-50
              rounded-2xl
              p-6
              mt-8
            "
          >

            <div className="flex items-start gap-3">

              <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                <FileText
                  size={20}
                  strokeWidth={1.8}
                  className="text-gray-500"
                />
              </div>

              <div className="min-w-0">

                <h3 className="font-semibold text-gray-900">
                  Description
                </h3>

                <p className="text-gray-600 leading-7 mt-1">
                  {selectedProject?.description?.trim()
                    ? selectedProject.description
                    : "No description"}
                </p>

              </div>

            </div>

          </div>


          {/* ================================== */}
          {/* CLIENT + BUDGET */}
          {/* ================================== */}

          <div className="grid grid-cols-2 gap-4 mt-6">


            {/* ============================== */}
            {/* CLIENT */}
            {/* ============================== */}

            <div
              className="
                bg-gray-50
                rounded-3xl
                p-6
                min-h-[220px]
                border
                border-gray-100
              "
            >

              <div className="flex items-center gap-2">

                <User
                  size={20}
                  className="text-gray-500"
                />

                <h2 className="font-semibold">
                  Client Details
                </h2>

              </div>


              <div className="mt-6">

                <h3 className="font-bold text-lg truncate">
                  {selectedProject?.client?.name ||
                    "No Client"}
                </h3>

                <p className="text-gray-500 text-sm truncate mt-1">
                  {selectedProject?.client?.email ||
                    "No Email"}
                </p>


                <button
                  className="
                    text-indigo-600
                    mt-5
                    font-medium
                    hover:translate-x-1
                    transition
                  "
                >
                  View Client →
                </button>

              </div>

            </div>


            {/* ============================== */}
            {/* BUDGET */}
            {/* ============================== */}

            <div
              className="
                bg-gray-50
                rounded-3xl
                p-6
                min-h-[220px]
                border
                border-gray-100
              "
            >

              <div className="flex items-center gap-2">

                <Wallet
                  size={20}
                  className="text-gray-500"
                />

                <h2 className="font-semibold">
                  Budget
                </h2>

              </div>


              <h1 className="text-3xl font-bold mt-6">
                ₹{selectedProject?.budget || 0}
              </h1>

              <p className="text-gray-500 mt-2">
                Project Budget
              </p>


              <div className="w-full h-2 bg-gray-200 rounded-full mt-8">

                <div
                  className="
                    h-2
                    bg-green-500
                    rounded-full
                    transition-all
                    duration-300
                  "
                  style={{
                    width: `${Math.min(
                      spentPercentage,
                      100
                    )}%`,
                  }}
                />

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


      {/* ======================================== */}
      {/* TASKS TAB */}
      {/* ======================================== */}

      {projectTab === "tasks" && (

        <section className="mt-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <div className="flex items-center gap-2">

                <ListTodo
                  size={22}
                  className="text-gray-500"
                />

                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Tasks
                </h2>

              </div>

              <p className="text-gray-500 mt-1">
                Tasks associated with this project
              </p>

            </div>


            <span
              className="
                text-sm
                font-medium
                text-gray-500
                bg-gray-100
                px-3
                py-1.5
                rounded-full
              "
            >
              {projectTasks.length} total
            </span>

          </div>


          {/* ================================== */}
          {/* NO TASKS */}
          {/* ================================== */}

          {projectTasks.length === 0 ? (

            <div
              className="
                bg-gray-50
                rounded-3xl
                p-10
                text-center
                border
                border-gray-100
              "
            >

              <ListTodo
                size={36}
                className="
                  mx-auto
                  text-gray-400
                "
              />

              <p className="text-gray-500 mt-4">
                No tasks found
              </p>

            </div>

          ) : (

            /* ================================== */
            /* TASK LIST */
            /* ================================== */

            <div className="space-y-4">

              {projectTasks.map(
                (task: any) => {

                  /*
                   * Convert DB "Todo"
                   * to UI "Not Started"
                   */
                  const displayStatus =
                    task.status === "Todo"
                      ? "Not Started"
                      : task.status;


                  return (

                    <div
                      key={task.id}
                      className="
                        bg-gray-50
                        rounded-3xl
                        p-6
                        border
                        border-gray-100
                        hover:shadow-sm
                        transition
                      "
                    >

                      <div className="flex justify-between items-start gap-4">


                        {/* ======================== */}
                        {/* TASK INFORMATION */}
                        {/* ======================== */}

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">

                            <ListTodo
                              size={18}
                              className="text-gray-500 shrink-0"
                            />

                            <h3 className="font-semibold text-lg text-gray-900 truncate">
                              {task.title}
                            </h3>

                          </div>


                          {/* PRIORITY */}

                          <p className="text-gray-500 text-sm mt-3">

                            {task.priority || "No"} Priority

                          </p>


                          {/* CREATED DATE */}

                          <p className="text-gray-400 text-sm mt-3">

                            {task.createdAt
                              ? new Date(
                                  task.createdAt
                                ).toLocaleString()
                              : "Date not available"}

                          </p>

                        </div>


                        {/* ======================== */}
                        {/* STATUS */}
                        {/* ======================== */}

                        <div className="shrink-0">

                          <span
                            className={`
                              inline-flex
                              items-center
                              px-4
                              py-2
                              rounded-full
                              text-sm
                              font-medium
                              ${
                                displayStatus === "Completed"
                                  ? "bg-green-100 text-green-600"
                                  : displayStatus === "In Progress"
                                  ? "bg-indigo-100 text-indigo-600"
                                  : "bg-gray-100 text-gray-600"
                              }
                            `}
                          >

                            {displayStatus}

                          </span>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </section>

      )}

    </div>

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

<div className="w-14 h-14 flex items-center justify-center">
  <img
    src="/task_1_icon.png"
    alt="Task Icon"
    className="w-full h-full object-contain block"
  />
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
<Pencil size={20}/>
</button>

<button
onClick={() => deleteTask(task.id)}
className="
text-gray-400
hover:text-red-500
transition
"
>
<Trash2 size={20}/>
</button>

</div>

</div>

{/* Task Title */}

<h3 className="text-2xl font-bold mt-5">
{task.title}
</h3>

{/* Project */}
<div className="flex items-center gap-2 font-medium mt-2">
  <FolderKanban className="h-4 w-4 text-muted-foreground" />
  <p className="truncate">
                  {task.project?.title || "No Project"}
                </p>
</div>

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
  <div className="flex items-center gap-2 text-gray-500 text-sm">
    <CalendarDays
      size={16}
      strokeWidth={1.8}
      className="text-gray-500"
    />

    <span>
      {task.dueDate
        ? new Date(task.dueDate).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )
        : "Not Set"}
    </span>
  </div>
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
              title: "High Priority",
              subtitle: "Requires immediate attention",
              bg: "bg-red-100",
              text: "text-red-600",
              iconBg: "bg-red-100",
              iconColor: "text-red-600",
            }
          : selectedTask.priority === "Medium"
          ? {
              title: "Medium Priority",
              subtitle: "Important but not urgent",
              bg: "bg-yellow-100",
              text: "text-yellow-600",
              iconBg: "bg-yellow-100",
              iconColor: "text-yellow-600",
            }
          : {
              title: "Low Priority",
              subtitle: "Can be completed later",
              bg: "bg-green-100",
              text: "text-green-600",
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
            };

      const today = new Date();

      const dueDate = selectedTask?.dueDate
        ? new Date(selectedTask.dueDate)
        : null;

      const daysLeft = dueDate
        ? Math.ceil(
            (dueDate.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      const selectedTaskStatus = taskStatus;

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

{/* HEADER */}
<div className="flex justify-between items-start">

  {/* LEFT SIDE */}
  <div className="min-w-0">

    {/* ICON + TITLE — SAME ROW */}
    <div className="flex items-center gap-4">

      {/* Task Icon */}
      <div className="shrink-0 flex items-center justify-center">
        <ClipboardList
          size={25}
          strokeWidth={1.8}
          className="text-gray-500"
        />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 truncate">
        {selectedTask.title}
      </h2>

    </div>

    {/* PRIORITY + STATUS — BELOW TITLE */}
    <div className="flex items-center gap-3 mt-3 ml-[40px]">

      {/* Priority */}
      <span
        className={`
          px-3
          py-1
          rounded-full
          text-xs
          font-medium
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

      {/* Status */}
      <span
        className={`
          px-3
          py-1
          rounded-full
          text-xs
          font-medium
          ${
            selectedTaskStatus === "Completed"
              ? "bg-green-100 text-green-700"
              : selectedTaskStatus === "In Progress"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }
        `}
      >
        {selectedTaskStatus}
      </span>

    </div>

  </div>


  {/* CLOSE BUTTON */}
  <button
    onClick={() => setShowTaskDrawer(false)}
    className="
      h-10
      w-10
      shrink-0
      rounded-xl
      flex
      items-center
      justify-center
      text-gray-500
      hover:bg-gray-100
      hover:text-gray-900
      transition
    "
  >
    <X size={22} />
  </button>

</div>

          {/* ======================================== */}
          {/* DESCRIPTION */}
          {/* ======================================== */}

          <div
            className="
              bg-gray-50
              rounded-2xl
              p-6
              mt-8
            "
          >

            <div className="flex items-start gap-3">

              <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                <FileText
                  size={20}
                  strokeWidth={1.8}
                  className="text-gray-500"
                />
              </div>

              <div className="min-w-0">

                <h3 className="font-semibold text-gray-900">
                  Description
                </h3>

                <p className="text-gray-600 leading-7 mt-1">
                  {selectedTask.description?.trim()
                    ? selectedTask.description
                    : "No description"}
                </p>

              </div>

            </div>

          </div>


          {/* ======================================== */}
          {/* PROJECT + PRIORITY */}
          {/* ======================================== */}

          <div className="grid grid-cols-2 gap-4 mt-6">

            {/* PROJECT */}
            <div
              className="
                bg-gray-50
                rounded-2xl
                p-5
                min-w-0
                min-h-[165px]
                flex
                flex-col
              "
            >

              {/* ROW 1 — ICON + LABEL */}
              <div className="flex items-center gap-3">

                <FolderKanban
                  size={21}
                  strokeWidth={1.8}
                  className="text-gray-500 shrink-0"
                />

                <h3 className="font-semibold text-gray-900">
                  Project
                </h3>

              </div>

              {/* CENTERED CONTENT */}
              <div className="flex-1 flex flex-col justify-center min-w-0">

                <h3
                  className="
                    font-bold
                    text-lg
                    text-gray-900
                    Truncate
                  "
                  title={
                    selectedTask.project?.title ||
                    "No Project"
                  }
                >
                  {selectedTask.project?.title ||
                    "No Project"}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Active Workspace
                </p>

              </div>

            </div>


            {/* PRIORITY */}
            <div
              className="
                bg-gray-50
                rounded-2xl
                p-5
                min-w-0
                min-h-[165px]
                flex
                flex-col
              "
            >

              {/* ROW 1 — ICON + LABEL */}
              <div className="flex items-center gap-3">

                <div
                  className={`
                    w-8
                    h-8
                    shrink-0
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${priorityConfig.iconBg}
                  `}
                >
                  <Zap
                    size={19}
                    strokeWidth={1.8}
                    className={priorityConfig.iconColor}
                  />
                </div>

                <h3 className="font-semibold text-gray-900">
                  Priority
                </h3>

              </div>

              {/* CENTERED CONTENT */}
              <div className="flex-1 flex flex-col justify-center min-w-0">

                <h3
                  className={`
                    text-lg
                    font-bold
                    truncate
                    ${priorityConfig.text}
                  `}
                >
                  {priorityConfig.title}
                </h3>

                <p className="text-xs text-gray-400 mt-1 leading-4">
                  {priorityConfig.subtitle}
                </p>

              </div>

            </div>

          </div>


          {/* ======================================== */}
          {/* PROGRESS + DUE DATE */}
          {/* ======================================== */}

          <div className="grid grid-cols-2 gap-4 mt-6">

            {/* PROGRESS */}
            <div
              className="
                bg-gray-50
                rounded-2xl
                p-5
              "
            >

              <div className="flex items-center gap-2 mb-5">

                <BarChart3
                  size={19}
                  strokeWidth={1.8}
                  className="text-gray-600"
                />

                <h3 className="font-semibold text-gray-900">
                  Progress
                </h3>

              </div>

              <h2 className="text-2xl font-bold text-gray-900">
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
                    from-indigo-600
                    to-purple-600
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <p className="text-sm text-gray-500 mt-4">
                {completedSubtasks} of {subtasks.length} subtasks completed
              </p>

            </div>


            {/* DUE DATE */}
            <div
              className="
                bg-gray-50
                rounded-2xl
                p-6
              "
            >

              <div className="flex items-center gap-2 mb-4">

                <CalendarDays
                  size={19}
                  strokeWidth={1.8}
                  className="text-gray-600"
                />

                <h3 className="font-semibold text-gray-900">
                  Due Date
                </h3>

              </div>

              <p className="text-2xl font-bold text-gray-900">

                {dueDate
                  ? dueDate.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : "Not Set"}

              </p>

              <p
                className={`
                  text-sm
                  mt-3
                  ${
                    daysLeft !== null && daysLeft < 0
                      ? "text-red-500"
                      : daysLeft !== null && daysLeft <= 3
                      ? "text-yellow-600"
                      : "text-gray-500"
                  }
                `}
              >
                {daysLeft === null
                  ? "No deadline"
                  : daysLeft < 0
                  ? `${Math.abs(daysLeft)} days overdue`
                  : daysLeft === 0
                  ? "Due Today"
                  : `${daysLeft} days remaining`}
              </p>

            </div>

          </div>


          {/* ======================================== */}
          {/* SUBTASKS */}
          {/* KEEPING YOUR EXISTING SUBTASK CARD */}
          {/* ======================================== */}

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

            </div>


            <div className="flex gap-3 mt-4">

              <input
                type="text"
                placeholder="Add new subtask..."
                value={newSubtask}
                onChange={(e) =>
                  setNewSubtask(e.target.value)
                }
                className="
                  flex-1
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-indigo-500
                "
              />

              <button
                onClick={addSubtask}
                className="
                  bg-indigo-600
                  text-white
                  px-5
                  rounded-xl
                  hover:bg-indigo-700
                  transition
                "
              >
                + Add
              </button>

            </div>


            <div className="mt-5 space-y-3">

              {subtasks.map((subtask: any) => (

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

                    {editingSubtask === subtask.id ? (
                      <input
                        value={editSubtaskText}
                        onChange={(e) =>
                          setEditSubtaskText(e.target.value)
                        }
                        className="
                          border
                          rounded-lg
                          px-2
                          py-1
                          text-sm
                        "
                      />
                    ) : (
                      <span>
                        {subtask.title}
                      </span>
                    )}

                  </div>


                  <div className="flex gap-2">

                    <button
                      onClick={() => {
                        setEditingSubtask(subtask.id);
                        setEditSubtaskText(
                          subtask.title
                        );
                      }}
                      className="
                        text-gray-400
                        hover:text-gray-700
                        transition
                      "
                    >
                      <Pencil size={16} />
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
                      <Trash2 size={16} />
                    </button>


                    {editingSubtask === subtask.id && (
                      <button
                        onClick={() =>
                          updateSubtask(subtask.id)
                        }
                        className="
                          text-green-600
                          font-medium
                          text-sm
                        "
                      >
                        Save
                      </button>
                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* ======================================== */}
          {/* RECENT ACTIVITY */}
          {/* ======================================== */}

          <div className="mt-8">

            <div className="flex items-center gap-2 mb-6">

              <Clock3
                size={20}
                strokeWidth={1.8}
                className="text-gray-600"
              />

              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>

            </div>


            <div className="space-y-4">

              {activities.length === 0 ? (

                <div
                  className="
                    bg-gray-50
                    rounded-2xl
                    p-6
                    text-gray-500
                  "
                >
                  No recent activity
                </div>

              ) : (

                activities.map((activity: any) => {

                  const isCompleted =
                    activity.title
                      ?.toLowerCase()
                      .includes("completed");

                  return (

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

                      {/* Activity Icon */}

                      <div
                        className={`
                          w-10
                          h-10
                          shrink-0
                          rounded-full
                          flex
                          items-center
                          justify-center
                          ${
                            isCompleted
                              ? "bg-green-100"
                              : "bg-indigo-100"
                          }
                        `}
                      >

                        {isCompleted ? (

                          <CheckCircle2
                            size={19}
                            className="text-green-600"
                          />

                        ) : (

                          <Plus
                            size={20}
                            className="text-indigo-600"
                          />

                        )}

                      </div>


                      {/* Activity Details */}

                      <div className="flex-1 min-w-0">

                        <p className="font-medium text-gray-900">
                          {activity.title}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {activity.description}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(
                            activity.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  );

                })

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
<div className="w-14 h-14 flex items-center justify-center">
  <img
    src="/invoice-icon.png"
    alt="Invoice Icon"
    className="w-full h-full object-contain block"
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
        <Pencil size={20}/>
      </button>

<button
  onClick={() => deleteInvoice(invoice.id)}
  className="
    text-gray-400
    hover:text-red-500
    transition
  "
>
  <Trash2 size={20}/>
</button>

    </div>

  </div>

  {/* Invoice Number */}

  <h3 className="text-2xl font-semibold mt-5">

    {invoice.invoiceNumber}

  </h3>

  {/* Client */}
  <p className="text-xs text-gray-400 mt-2">
Client
</p>
 <div className="flex items-center gap-2 font-medium">
      <User className="h-4 w-4 text-muted-foreground" />

<p className="font-medium">
{invoice.client?.name}
</p>
</div>

  {/* Amount */}
<div className="mt-5 flex items-center gap-2">
    <h2 className="text-2xl text-indigo-800 font-bold">
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

  <div className="mt-4">
  <div className="flex items-center gap-2 text-gray-500 text-sm">
    <CalendarDays
      size={16}
      strokeWidth={1.8}
      className="text-gray-500"
    />

    <span>
      {invoice.dueDate
        ? new Date(invoice.dueDate).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )
        : "Not Set"}
    </span>
  </div>
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
  <section className="w-full">
    {/* HEADER */}
    <div className="w-full flex justify-between items-center mb-8">
      <div>
        <h2 className="text-4xl font-bold">
          Documents
        </h2>

        <p className="text-muted-foreground mt-2">
          Manage your files and attachments
        </p>
      </div>

      <button
        onClick={() => {
  setEditingDocument(null);

  setDocumentData({
    name: "",
    file: null,
    clientId: "",
    projectId: "",
  });

  setShowDocumentModal(true);
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
        + Upload Document
      </button>
    </div>

    {/* SEARCH + SORT */}
    <div className="flex gap-4 mb-8">
      <div className="relative flex-[8]">
        <Search
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
          value={documentSearch}
          onChange={(e) => setDocumentSearch(e.target.value)}
          placeholder="Search documents..."
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
    value={documentSort}
    onChange={(e)=>setDocumentSort(e.target.value)}
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

    <option value="Sort By">
      Sort By
    </option>

    <option value="Newest">
      Newest
    </option>

    <option value="Oldest">
      Oldest
    </option>
    
     <option value="name">Name A-Z</option>

  </select>
    </div>

    {/* EMPTY STATE */}
    {filteredDocuments.length === 0 ? (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">
          📄
        </div>

        <h3 className="text-2xl font-semibold">
          {documents.length === 0
            ? "No Documents Yet"
            : "No Documents Found"}
        </h3>

        <p className="text-muted-foreground mt-2">
          {documents.length === 0
            ? "Upload your first document"
            : "Try another search"}
        </p>
      </div>
    ) : (
      /* 3-COLUMN DOCUMENT GRID */
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedDocuments.map((document) => (
          <div
            key={document.id}
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
            {/* TOP SECTION */}
            <div className="flex items-start justify-between">
              {getDocumentIcon(
                document.fileType,
                document.name
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
  openEditDocument(document)
}
                  className="
                     text-gray-400
          hover:text-indigo-600
          transition
                    
                  "
                  title="Edit document"
                >
                  <Pencil className="h-5 w-5" />
                </button>

                <button
  onClick={() => deleteDocument(document.id)}
  className="
    text-gray-400
    hover:text-red-500
    transition
  "
  title="Delete document"
>
  <Trash2 className="h-5 w-5" />
</button>
              </div>
            </div>

            {/* DOCUMENT DETAILS */}
            <div className="mt-4">
              <h3
                className="
                  text-lg
                  font-bold
                  truncate
                "
                title={document.name}
              >
                {document.name}
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                {formatFileSize(document.fileSize)}
                {" • "}
                {new Date(
                  document.createdAt
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

            </div>

            {/* DIVIDER */}
            <div className="my-5 border-t border-border" />

            {/* CLIENT */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1">
                Client
              </p>

              <div className="flex items-center gap-2 font-medium">
                <User className="h-4 w-4 text-muted-foreground" />

                <span>
                  {document.client?.name || "No Client"}
                </span>
              </div>
            </div>

            {/* PROJECT */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Project
              </p>

              <div className="flex items-center gap-2 font-medium">
                <FolderKanban className="h-4 w-4 text-muted-foreground" />

                <span className="truncate">
                  {document.project?.title || "No Project"}
                </span>
              </div>
            </div>

            {/* CARD FOOTER */}
<div className="mt-auto pt-6 flex justify-end">
  <button
    onClick={() => {
  setSelectedDocument(document);
  setCurrentSlide(0);
  setPptxData(null);
  setShowDocumentDetails(true);

  const extension =
    document.fileType?.toLowerCase();

  if (
    extension === "ppt" ||
    extension === "pptx"
  ) {
    loadPptxPreview(document);
  }
}}
    className="
       text-indigo-600
        font-medium
        hover:translate-x-1
        transition
    "
  >
    View Details →
  </button>
</div>
          </div>
        ))}
      </div>
    )}
  </section>
)}
{/* DOCUMENT DETAILS DRAWER */}
{showDocumentDetails && selectedDocument && (
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
      p-8
    "
  >
    {/* CLOSE BUTTON */}
    <button
      onClick={() => {
        setShowDocumentDetails(false);
        setSelectedDocument(null);
      }}
      className="
        absolute
        top-5
        right-5
        w-10
        h-10
        rounded-xl
        flex
        items-center
        justify-center
        text-gray-500
        hover:bg-gray-100
        hover:text-gray-900
        transition
      "
      aria-label="Close document details"
    >
      <X size={22} />
    </button>

    {/* HEADER */}
<div className="pr-12 flex items-center gap-4">
  <div className="shrink-0">
    {getDocumentIcon(
      selectedDocument.fileType,
      selectedDocument.name
    )}
  </div>

  <div className="min-w-0">
    <h1
      className="text-xl font-bold truncate"
      title={selectedDocument.name}
    >
      {selectedDocument.name}
    </h1>

    <p className="text-sm text-gray-500 mt-1">
      {selectedDocument.fileType?.toUpperCase() || "DOCUMENT"}
      {" • "}
      {formatFileSize(selectedDocument.fileSize)}
    </p>
  </div>
</div>

    {/* FILE PREVIEW */}
<div
  className="
    relative
    mt-6
    h-64
    rounded-2xl
    border
    border-gray-200
    bg-gray-50
    overflow-hidden
    flex
    items-center
    justify-center
  "
>
  {/* EXPAND BUTTON */}
  <button
  onClick={() => setShowFullFile(true)}
  className="
    absolute
    top-4
    right-4
    z-10
    w-10
    h-10
    rounded-xl
    bg-white
    border
    border-gray-200
    shadow-sm
    flex
    items-center
    justify-center
    text-gray-600
    hover:bg-gray-100
    hover:text-indigo-600
    transition
  "
  title="View full file"
>
  <Maximize2 size={18} />
</button>

  {/* PREVIEW CONTENT */}
<div className="text-center px-6">
  <div className="flex justify-center mb-4">
    {getDocumentIcon(selectedDocument.fileType)}
  </div>

  <h3 className="font-semibold text-gray-800 text-lg">
    {selectedDocument.name}
  </h3>

  {(
    (selectedDocument.fileType === "ppt" ||
      selectedDocument.fileType === "pptx") &&
    !selectedDocument.previewUrl
  ) ? (
    <>
      <p className="text-sm font-medium text-gray-700 mt-3">
        Preview unavailable
      </p>

      <p className="text-sm text-gray-500 mt-1">
        You can still download or share the original PPTX.
      </p>
    </>
  ) : (
    <p className="text-sm text-gray-500 mt-2">
      Preview will be available here
    </p>
  )}
</div>
</div>

    {/* DETAILS */}
<div className="mt-8">
  <h2 className="text-lg font-bold mb-5">
    Details
  </h2>

  <div className="space-y-5">

    {/* FILE NAME */}
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-gray-500">
        <FileText className="h-5 w-5" />
        <span>File Name</span>
      </div>

      <span
        className="font-medium text-right truncate max-w-[230px]"
        title={selectedDocument.name}
      >
        {selectedDocument.name}
      </span>
    </div>

    {/* CLIENT */}
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-gray-500">
        <User className="h-5 w-5" />
        <span>Client</span>
      </div>

      <span className="font-medium text-right">
        {selectedDocument.client?.name || "No Client"}
      </span>
    </div>

    {/* PROJECT */}
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-gray-500">
        <FolderKanban className="h-5 w-5" />
        <span>Project</span>
      </div>

      <span className="font-medium text-right">
        {selectedDocument.project?.title || "No Project"}
      </span>
    </div>

    {/* FILE TYPE */}
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-gray-500">
        <FileType className="h-5 w-5" />
        <span>File Type</span>
      </div>

      <span className="font-medium text-right">
        {selectedDocument.fileType?.toUpperCase() || "Unknown"}
      </span>
    </div>

    {/* FILE URL */}
<div className="flex items-start justify-between gap-4">
  <div className="flex items-center gap-3 shrink-0">
    <LinkIcon className="w-5 h-5 text-gray-500" />

    <span className="text-gray-600">
      File URL
    </span>
  </div>

  <a
    href={selectedDocument.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="
      max-w-[260px]
      truncate
      text-sm
      text-purple-600
      hover:text-purple-700
      hover:underline
    "
    title={selectedDocument.fileUrl}
  >
    {selectedDocument.fileUrl}
  </a>
</div>

    {/* FILE SIZE */}
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-gray-500">
        <HardDrive className="h-5 w-5" />
        <span>File Size</span>
      </div>

      <span className="font-medium text-right">
        {formatFileSize(selectedDocument.fileSize)}
      </span>
    </div>

    {/* UPLOADED ON */}
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-gray-500">
        <Calendar className="h-5 w-5" />
        <span>Uploaded On</span>
      </div>

      <span className="font-medium text-right">
        {new Date(
          selectedDocument.createdAt
        ).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>

    {/* LAST MODIFIED */}
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-gray-500">
        <Clock className="h-5 w-5" />
        <span>Last Modified</span>
      </div>

      <span className="font-medium text-right">
        {new Date(
          selectedDocument.updatedAt ||
          selectedDocument.createdAt
        ).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>

  </div>
</div>

    {/* DIVIDER */}
    <div className="my-8 border-t border-gray-200" />

    {/* RELATED INFORMATION */}
    <div>
      <h2 className="text-lg font-bold mb-4">
        Related Information
      </h2>

      {/* CLIENT */}
      <div className="mb-5">
        <p className="text-sm text-gray-500 mb-2">
          Client
        </p>

        <div className="flex items-center gap-3 font-medium">
          <User className="h-5 w-5 text-gray-400" />

          {selectedDocument.client?.name || "No Client"}
        </div>
      </div>

      {/* PROJECT */}
      <div>
        <p className="text-sm text-gray-500 mb-2">
          Project
        </p>

        <div className="flex items-center gap-3 font-medium">
          <FolderKanban className="h-5 w-5 text-gray-400" />

          {selectedDocument.project?.title || "No Project"}
        </div>
      </div>
    </div>

{/* ACTIONS */}
<div className="mt-6 pt-5 border-t border-gray-200">
  <div className="flex items-center gap-3 w-full min-w-0">
    
    {/* DOWNLOAD */}
    <button
      type="button"
      onClick={handleDownload}
      className="
        flex-1
        min-w-0
        h-12
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-gradient-to-r
        from-violet-600
        to-purple-600
        text-white
        font-semibold
        hover:opacity-90
        transition
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>

      <span className="truncate">
        Download {selectedDocument.fileType?.toUpperCase()}
      </span>
    </button>

    {/* SHARE */}
    <button
      type="button"
      onClick={handleShareDocument}
      className="
        w-26
        h-12
        shrink-0
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-white
        border
        border-gray-200
        text-gray-700
        shadow-sm
        hover:bg-gray-50
        hover:text-indigo-600
        transition
      "
      aria-label="Share file"
    >
      <Share2 size={21} />
        Share
    </button>

  </div>
</div>
  </div>
)}


{/* FULL FILE VIEWER */}
{showFullFile && selectedDocument && (
  <div
    className="
      fixed
      inset-0
      z-[100]
      bg-black/50
      backdrop-blur-sm
      flex
      items-center
      justify-center
      p-6
    "
  >
    <div
      className="
        relative
        w-full
        h-full
        max-w-7xl
        bg-white
        rounded-2xl
        shadow-2xl
        overflow-hidden
        flex
        flex-col
      "
    >
      {/* VIEWER HEADER */}
      <div
        className="
          h-20
          px-6
          border-b
          border-gray-200
          flex
          items-center
          justify-between
          shrink-0
        "
      >
        {/* FILE INFORMATION */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0">
            {getDocumentIcon(selectedDocument.fileType)}
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold truncate">
              {selectedDocument.name}
            </h2>

            <p className="text-sm text-gray-500">
              {selectedDocument.fileType || "Unknown file"}
            </p>
          </div>
        </div>

        {/* CLOSE */}
        <button
          onClick={() => setShowFullFile(false)}
          className="
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            text-gray-500
            hover:bg-gray-100
            hover:text-gray-900
            transition
          "
          aria-label="Close file viewer"
        >
          <X size={22} />
        </button>
      </div>

      {/* FILE VIEWER */}
      <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
        <div
  className="
    w-full
    h-full
    rounded-xl
    border
    border-gray-200
    bg-white
    overflow-hidden
  "
>
  {renderFileViewer()}
</div>
      </div>
    </div>
  </div>
)}


{isFullscreenPreview && (() => {

  const slides = pptSlides;

const slide = fullscreenSlide;

const SLIDE_WIDTH = fullscreenSlideWidth;

const SLIDE_HEIGHT = fullscreenSlideHeight;

if (!slide) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        bg-black
        flex
        flex-col
      "
    >
      {/* FULLSCREEN HEADER */}
      <div className="h-16 flex items-center justify-between px-6 bg-black/80 border-b border-white/10">
        
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold text-white">
              {selectedDocument?.name || "Presentation"}
            </p>

            <p className="text-xs text-gray-400">
              Slide {safeCurrentSlide + 1} of {slides.length}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreenPreview(false)}
          className="
            w-10
            h-10
            rounded-lg
            flex
            items-center
            justify-center
            text-gray-300
            hover:text-white
            hover:bg-white/10
            transition
          "
          aria-label="Close fullscreen preview"
        >
          <X size={22} />
        </button>
      </div>

      {/* SLIDE AREA */}
  <div
  ref={fullscreenSlideContainerRef}
  className="
    flex-1
    min-h-0
    flex
    items-center
    justify-center
    overflow-hidden
  "
>
  <SlideRenderer
    slide={slide}
    slideWidth={SLIDE_WIDTH}
    slideHeight={SLIDE_HEIGHT}
    scale={fullscreenSlideScale}
  />
</div>

{/* FULLSCREEN SLIDE THUMBNAILS */}
<div
  className="
    flex-shrink-0
    px-6
    py-3
    bg-black/80
    border-t
    border-white/10
  "
>
  <div className="flex gap-3 overflow-x-auto pb-1">
    {slides.map(
  (slideItem: any, slideIndex: number) => {
    return renderSlideThumbnail(
      slideItem,
      slideIndex
    );
  }
)}
  </div>
  
</div>


      {/* NAVIGATION */}
      <div className="h-20 px-6 flex items-center justify-center gap-6 bg-black/80 border-t border-white/10">
        
        <button
          type="button"
          onClick={() =>
            setCurrentSlide((prev) =>
              Math.max(prev - 1, 0)
            )
          }
          disabled={safeCurrentSlide === 0}
          className="
            px-5
            py-2.5
            rounded-lg
            bg-white/10
            text-white
            text-sm
            hover:bg-white/20
            disabled:opacity-30
            disabled:cursor-not-allowed
          "
        >
          ← Previous
        </button>

        <div className="min-w-[110px] text-center text-sm font-medium text-gray-300">
          Slide {safeCurrentSlide + 1} / {slides.length}
        </div>

        <button
          type="button"
          onClick={() =>
            setCurrentSlide((prev) =>
              Math.min(
                prev + 1,
                slides.length - 1
              )
            )
          }
          disabled={
            safeCurrentSlide === slides.length - 1
          }
          className="
            px-5
            py-2.5
            rounded-lg
            bg-white/10
            text-white
            text-sm
            hover:bg-white/20
            disabled:opacity-30
            disabled:cursor-not-allowed
          "
        >
          Next →
        </button>

      </div>
    </div>
  );
})()}


{/* ===================================== */}
{/* MEETINGS */}
{/* ===================================== */}

{activeSection === "meetings" && (
  <section className="w-full">

    {/* ===================================== */}
    {/* HEADER */}
    {/* ===================================== */}

    <div
      className="
        w-full
        flex
        items-center
        justify-between
        mb-8
      "
    >
      <div>
        <h2
          className="
            text-4xl
            font-bold
            text-gray-900
          "
        >
          Meetings
        </h2>

        <p
          className="
            text-muted-foreground
            mt-2
          "
        >
          Schedule and track appointments
        </p>
      </div>

      <button
        onClick={() => {
  setEditingMeeting(null);
  setShowMeetingModal(true);
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
        + New Meeting
      </button>
    </div>

    {/* ===================================== */}
    {/* SEARCH + SORT */}
    {/* ===================================== */}

    <div
      className="
        flex
        gap-4
        mb-8
      "
    >
      {/* SEARCH */}

      <div className="relative flex-[8]">

        <Search
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            w-5
            h-5
          "
        />

        <input
          type="text"
          value={meetingSearch}
          onChange={(e) =>
            setMeetingSearch(e.target.value)
          }
          placeholder="Search meetings..."
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

      {/* SORT */}

      <select
        value={meetingSort}
        onChange={(e) =>
          setMeetingSort(e.target.value)
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
          cursor-pointer
        "
      >
        <option value="Sort By">
          Sort By
        </option>

        <option value="date-newest">
          Newest
        </option>

        <option value="date-oldest">
          Oldest
        </option>

        <option value="title">
          Title A-Z
        </option>

        <option value="platform">
          Platform
        </option>

      </select>

    </div>


    {/* ===================================== */}
    {/* EMPTY STATE */}
    {/* ===================================== */}

    {meetings.length === 0 ? (

      <div
        className="
          text-center
          py-20
        "
      >
        <div
          className="
            text-5xl
            mb-4
          "
        >
          📅
        </div>

        <h3
          className="
            text-2xl
            font-semibold
          "
        >
          No Meetings Yet
        </h3>

        <p
          className="
            text-muted-foreground
            mt-2
          "
        >
          Schedule your first meeting
        </p>
      </div>

    ) : (

      /* ===================================== */
      /* MEETING CARDS */
      /* ===================================== */

      <div
        className="
          w-full
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {meetings

          /* ===================================== */
          /* SEARCH FILTER */
          /* ===================================== */

          .filter((meeting) => {

            const search =
              meetingSearch
                ?.toLowerCase()
                .trim() || "";

            if (!search) {
              return true;
            }

            return (

              meeting.title
                ?.toLowerCase()
                .includes(search) ||

              meeting.client?.name
                ?.toLowerCase()
                .includes(search) ||

              meeting.project?.title
                ?.toLowerCase()
                .includes(search) ||

              meeting.platform
                ?.toLowerCase()
                .includes(search)

            );
          })


          /* ===================================== */
          /* SORT */
          /* ===================================== */

          .sort((a, b) => {

            if (
              meetingSort === "date-newest"
            ) {
              return (
                new Date(
                  `${b.date}T${b.time}`
                ).getTime() -

                new Date(
                  `${a.date}T${a.time}`
                ).getTime()
              );
            }


            if (
              meetingSort === "date-oldest"
            ) {
              return (
                new Date(
                  `${a.date}T${a.time}`
                ).getTime() -

                new Date(
                  `${b.date}T${b.time}`
                ).getTime()
              );
            }


            if (
              meetingSort === "title"
            ) {
              return (
                a.title || ""
              ).localeCompare(
                b.title || ""
              );
            }


            if (
              meetingSort === "platform"
            ) {
              return (
                a.platform || ""
              ).localeCompare(
                b.platform || ""
              );
            }


            return 0;

          })


          /* ===================================== */
          /* CARDS */
          /* ===================================== */
          
          .map((meeting) => {

    const detectedPlatform =
  getMeetingPlatform(meeting);

const platformIcon =
  getMeetingPlatformIcon(
    detectedPlatform
  );

  return (

<div
  key={meeting.id}
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

  {/* ===================================== */}
  {/* TOP: PLATFORM ICON + ACTIONS */}
  {/* ===================================== */}

  <div className="flex items-start justify-between">

    {/* PLATFORM ICON */}
    <div className="
      w-12
      h-12
      flex
      items-center
      justify-center
      shrink-0
    ">
      {platformIcon ? (
        <img
          src={platformIcon}
          alt={detectedPlatform || "Meeting platform"}
          className="
            w-11
            h-11
            object-contain
            shrink-0
          "
          onError={(e) => {
            console.error(
              "Platform icon failed to load:",
              platformIcon
            );

            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <Video
          className="
            w-5
            h-5
            text-gray-400
          "
        />
      )}
    </div>


    {/* EDIT + DELETE */}
    <div className="
      flex
      items-center
      gap-2
    ">

      {/* EDIT */}
      <button
        type="button"
        onClick={() =>
          handleEditMeeting(meeting)
        }
        className="
          p-1
          text-gray-400
          hover:text-blue-700
          transition
        "
        title="Edit meeting"
      >
        <Pencil className="w-5 h-5" />
      </button>


      {/* DELETE */}
      <button
        type="button"
        onClick={() =>
          handleDeleteMeeting(meeting.id)
        }
        className="
          p-1
          text-gray-400
          hover:text-red-500
          transition
        "
        title="Delete meeting"
      >
        <Trash2 className="w-5 h-5" />
      </button>

    </div>

  </div>

      {/* ===================================== */}
      {/* TITLE */}
      {/* ===================================== */}

      <div className="mt-3">

        <h3
          className="
            text-lg
            font-bold
            text-gray-800
            truncate
          "
        >
          {meeting.title}
        </h3>

      </div>


      {/* ===================================== */}
      {/* DIVIDER */}
      {/* ===================================== */}

      <div
        className="
          border-t
          border-gray-200
          my-4
        "
      />

      {/* ===================================== */}
      {/* DETAILS */}
      {/* VALUE BESIDE LABEL */}
      {/* ===================================== */}

      <div className="space-y-3">


        {/* DATE */}

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
          "
        >
          <Calendar
            className="
              w-4
              h-4
              text-gray-400
              shrink-0
            "
          />

          <span className="text-gray-500">
            Date:
          </span>

          <span className="font-medium text-gray-900">
            {meeting.date}
          </span>
        </div>


        {/* TIME */}

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
          "
        >
          <Clock
            className="
              w-4
              h-4
              text-gray-400
              shrink-0
            "
          />

          <span className="text-gray-500">
            Time:
          </span>

<span className="font-medium text-gray-900">
  {meeting.time}

  {meeting.duration &&
    getMeetingEndTime(
      meeting.time,
      meeting.duration
    ) && (
      <>
        {" - "}
        {getMeetingEndTime(
          meeting.time,
          meeting.duration
        )}
      </>
    )}
</span>

        </div>


        {/* CLIENT */}

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
          "
        >
          <User
            className="
              w-4
              h-4
              text-gray-400
              shrink-0
            "
          />

          <span className="text-gray-500">
            Client:
          </span>

          <span
            className="
              font-medium
              text-gray-900
              truncate
            "
          >
            {meeting.client?.name ||
              "No Client"}
          </span>
        </div>


        {/* PROJECT */}

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
          "
        >
          <FolderKanban
            className="
              w-4
              h-4
              text-gray-400
              shrink-0
            "
          />

          <span className="text-gray-500">
            Project:
          </span>

          <span
            className="
              font-medium
              text-gray-900
              truncate
            "
          >
            {meeting.project?.title ||
              "No Project"}
          </span>
        </div>


        {/* PLATFORM */}
        {/* ICON BESIDE PLATFORM LABEL */}

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
          "
        >
          {platformIcon ? (

            <img
              src={platformIcon}
              alt={
                meeting.platform ||
                "Platform"
              }
              className="
                w-4
                h-4
                object-contain
                shrink-0
              "
            />

          ) : (

            <Video
              className="
                w-4
                h-4
                text-gray-400
                shrink-0
              "
            />

          )}

          <span className="text-gray-500">
            Platform:
          </span>

          <span
            className="
              font-medium
              text-gray-900
              truncate
            "
          >
              {detectedPlatform || "Not specified"}
          </span>
        </div>

      </div>


      {/* ===================================== */}
      {/* VIEW DETAILS */}
      {/* ===================================== */}
<div className="mt-auto pt-6 flex justify-end">
      <button
      onClick={() => {
    setSelectedMeeting(meeting);
    setShowMeetingDrawer(true);
  }}
        className="
        text-indigo-600
        font-medium
        hover:translate-x-1
        transition
        "
      >
        View Details →
      </button>

    </div>
    </div>

  );
})
          }

      </div>

    )}

{/* ===================================== */}
{/* MEETING DETAILS DRAWER */}
{/* ===================================== */}

{showMeetingDrawer && selectedMeeting && (
  <div className="fixed inset-0 z-50">

    {/* BACKDROP */}
    <div
      className="
        absolute
        inset-0
        bg-black/40
      "
      onClick={() => {
        setShowMeetingDrawer(false);
        setSelectedMeeting(null);
      }}
    />

    {/* ================================= */}
    {/* DRAWER */}
    {/* ================================= */}

    <div
      className="
        fixed
        top-0
        right-0
        h-full
        w-[450px]
        max-w-full
        bg-white
        shadow-2xl
        z-50
        overflow-y-auto
        scrollbar-hide
        p-8
      "
    >

      {/* ================================= */}
      {/* CLOSE BUTTON */}
      {/* ================================= */}
       <button
      onClick={() => {
        setShowMeetingDrawer(false);
          setSelectedMeeting(null);
      }}
      className="
        absolute
        top-5
        right-5
        w-10
        h-10
        rounded-xl
        flex
        items-center
        justify-center
        text-gray-500
        hover:bg-gray-100
        hover:text-gray-900
        transition
      "
      aria-label="Close Meeting details"
    >
      <X size={22} />
    </button>


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="mb-6">

        <h2
          className="
            text-xl
            font-bold
            text-gray-900
          "
        >
          Meeting Details
        </h2>

      </div>

      {/* TITLE + PLATFORM ICON */}
<div className="flex items-center gap-3">
  {(() => {
    const platform =
      getMeetingPlatform(selectedMeeting);

    const platformIcon =
      getMeetingPlatformIcon(platform);

    return platformIcon ? (
      <img
        src={platformIcon}
        alt={platform || "Meeting platform"}
        className="
          w-12
          h-12
          object-contain
          shrink-0
        "
      />
    ) : null;
  })()}

  <h3
    className="
      text-xl
      font-semibold
      text-gray-900
    "
  >
    {selectedMeeting.title}
  </h3>
</div>

      {/* ================================= */}
{/* STATUS */}
{/* ================================= */}

<div className="mt-2">
  {(() => {
    const status =
      getMeetingStatus(selectedMeeting);

    return (
      <span
        className={`
          inline-flex
          px-2.5
          py-1
          rounded-md
          text-xs
          font-medium
          ${getMeetingStatusBadge(status)}
        `}
      >
        {status}
      </span>
    );
  })()}
</div>


      {/* ================================= */}
      {/* CLIENT */}
      {/* ================================= */}

      <div className="flex gap-3 mt-5">

        <User
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Client
          </p>

          <p className="text-base font-medium text-gray-800">
            {selectedMeeting.client?.name ||
              "No Client"}
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* PROJECT */}
      {/* ================================= */}

      <div className="flex gap-3 mt-4">

        <FolderKanban
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Project
          </p>

          <p className="text-base font-medium text-gray-800">
            {selectedMeeting.project?.title ||
              "No Project"}
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* DATE */}
      {/* ================================= */}

      <div className="flex gap-3 mt-4">

        <Calendar
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Date
          </p>

          <p className="text-base font-medium text-gray-800">
            {selectedMeeting.date}
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* TIME */}
      {/* ================================= */}

      <div className="flex gap-3 mt-4">

        <Clock
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Time
          </p>

<p className="text-base font-medium text-gray-800">
  {selectedMeeting.time}

  {selectedMeeting.duration &&
    getMeetingEndTime(
      selectedMeeting.time,
      selectedMeeting.duration
    ) && (
      <>
        {" - "}
        {getMeetingEndTime(
          selectedMeeting.time,
          selectedMeeting.duration
        )}
      </>
    )}
</p>

        </div>

      </div>


      {/* ================================= */}
      {/* DURATION */}
      {/* ================================= */}

      <div className="flex gap-3 mt-4">

        <Clock
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Duration
          </p>

          <p className="text-base font-medium text-gray-800">
            {selectedMeeting.duration
              ? `${selectedMeeting.duration} mins`
              : "Not specified"}
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* PLATFORM */}
      {/* ================================= */}

      <div className="flex gap-3 mt-4">

        <Video
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Platform
          </p>

          <div className="flex items-center gap-2 mt-1">

            {selectedMeeting.platform &&
              (() => {

                const platformIcon =
                  getMeetingPlatformIcon(
                    selectedMeeting.platform
                  );

                return platformIcon ? (
                  <img
                    src={platformIcon}
                    alt={selectedMeeting.platform}
                    className="
                      w-5
                      h-5
                      object-contain
                    "
                  />
                ) : null;

              })()}

            <p className="text-base font-medium text-gray-800">
              {selectedMeeting.platform ||
                "Not specified"}
            </p>

          </div>

        </div>

      </div>

      {/* MEETING LINK */}
<div className="flex gap-3 mt-4">

  <Link
    className="
      w-4
      h-4
      text-gray-400
      mt-1
      shrink-0
    "
  />

  <div className="min-w-0 flex-1">

    <p className="text-sm text-gray-500">
      Meeting URL
    </p>

    <div className="flex items-center gap-2 mt-1">

      {/* URL */}
      <a
        href={selectedMeeting.meetingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="
          text-base
          text-indigo-600
          hover:text-indigo-700
          hover:underline
          truncate
          min-w-0
        "
      >
        {selectedMeeting.meetingLink ||
          "No meeting link"}
      </a>

      {/* COPY BUTTON */}
      {selectedMeeting.meetingLink && (
        <button
          type="button"
          onClick={() =>
            handleCopyMeetingLink(
              selectedMeeting.meetingLink
            )
          }
          title="Copy meeting link"
          className="
            shrink-0
            p-1
            text-gray-400
            hover:text-gray-700
            transition
          "
        >
          <Copy
            className="
              w-4
              h-4
            "
          />
        </button>
      )}

    </div>

  </div>

</div>


      {/* ================================= */}
      {/* NOTES */}
      {/* ================================= */}

      <div className="flex gap-3 mt-4">

        <FileText
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Notes
          </p>

          <p className="text-base text-gray-700 mt-1 leading-5">
            {selectedMeeting.notes ||
              "No notes added."}
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* CREATED ON */}
      {/* ================================= */}

      <div className="flex gap-3 mt-4">

        <Clock
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Created On
          </p>

          <p className="text-base text-gray-700 mt-1">
            {selectedMeeting.createdAt
              ? new Date(
                  selectedMeeting.createdAt
                ).toLocaleString()
              : "—"}
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* LAST UPDATED */}
      {/* ================================= */}

      <div className="flex gap-3 mt-4">

        <Clock
          className="
            w-4
            h-4
            text-gray-400
            mt-0.5
            shrink-0
          "
        />

        <div>

          <p className="text-sm text-gray-500">
            Last Updated
          </p>

          <p className="text-base text-gray-700 mt-1">
             {selectedMeeting.updatedAt
      ? new Date(
          selectedMeeting.updatedAt
        ).toLocaleString()
      : "—"}
          </p>
          

        </div>

      </div>


      {/* ================================= */}
      {/* FOOTER / JOIN BUTTON */}
      {/* ================================= */}

      <div className="mt-6 pb-2">

        {(() => {

          const status =
            getMeetingStatus(
              selectedMeeting
            );

            const startTime =
  getMeetingStartDateTime(
    selectedMeeting.date,
    selectedMeeting.time
  );

const durationMinutes =
  Number(
    selectedMeeting.duration
  ) || 0;

const endTime =
  startTime
    ? new Date(
        startTime.getTime() +
          durationMinutes *
            60 *
            1000
      )
    : null;

const now = new Date();

const canJoin =
  !!startTime &&
  !!endTime &&
  now >= startTime &&
  now < endTime &&
  !!selectedMeeting.meetingLink;

          {/* ADJOURNED */}

          if (
            status === "Meeting Adjourned"
          ) {

            return (
              <>
                <button
                  disabled
                  className="
                    w-full
                    bg-red-50
                    text-red-500
                    py-2.5
                    rounded-lg
                    text-sm
                    font-medium
                  "
                >
                  Meeting Adjourned
                </button>

                <p
                  className="
                    text-center
                    text-[10px]
                    text-gray-400
                    mt-2
                  "
                >
                  This meeting ended at{" "}
                  {getMeetingEndTime(
                    selectedMeeting.time,
                    selectedMeeting.duration
                  )}
                </p>
              </>
            );

          }


          {/* JOIN */}

          return (
            <>
<a
  href={
    canJoin
      ? selectedMeeting.meetingLink
      : undefined
  }
  target="_blank"
  rel="noopener noreferrer"
  title={
    !canJoin
      ? "This button is available at the start of the meeting"
      : "Join Meeting"
  }
  className={`
    flex
    items-center
    justify-center
    gap-2
    w-full
    text-center
    py-2.5
    rounded-lg
    text-sm
    font-medium
    transition-all
    duration-200
    ${
      canJoin
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 cursor-pointer"
        : "bg-gray-100 text-gray-400 cursor-not-allowed"
    }
  `}
>
  <Video className="w-4 h-4 shrink-0" />

  <span>
    Join Meeting
  </span>
</a>
              <p
                className="
                  text-center
                  text-[12px]
                  text-gray-400
                  mt-3
                "
              >
                {status === "Scheduled"
                  ? `Meeting starts at ${selectedMeeting.time}`
                  : status === "Meeting Started"
                  ? "Meeting has started"
                  : "Meeting is currently in progress"}
              </p>
            </>
          );

        })()}


        {/* ================================= */}
        {/* BOTTOM NOTE */}
        {/* ================================= */}

        <p
          className="
            text-[12px]
            text-gray-400
            text-center
            mt-4
            leading-4
          "
        >
          Note: Meeting link will be active only
          during the scheduled time.
        </p>

      </div>

    </div>
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

    className="text-gray-400 hover:text-red-500"
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


{/* CREATE / EDIT DOCUMENT MODAL */}
{showDocumentModal && (
  <div className="
    fixed
    inset-0
    bg-black/50
    flex
    items-center
    justify-center
    z-50
    p-4
  ">

    <div className="
      bg-white
      rounded-2xl
      w-full
      max-w-md
      max-h-[90vh]
      shadow-2xl
      overflow-hidden
      flex
      flex-col
    ">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="
        flex
        items-center
        justify-between
        px-8
        py-9
        border-gray-200
        shrink-0
      ">

        <h2 className="
          text-2xl
          font-bold
          text-gray-900
        ">
          {editingDocument
            ? "Edit Document"
            : "Upload Document"}
        </h2>

        {/* CLOSE BUTTON */}

        <button
          onClick={() => {
            setShowDocumentModal(false);
            setEditingDocument(null);
          }}
          className="
            text-gray-400
            hover:text-red-500
            transition
            text-lg
          "
        >
          ✕
        </button>

      </div>


      {/* ===================================== */}
      {/* SCROLLABLE FORM BODY */}
      {/* ===================================== */}

        <div className="
  flex-1
  overflow-y-auto
  px-8
  pt-0
  pb-5
">

        <div className="space-y-5">

          {/* ===================================== */}
          {/* DOCUMENT NAME */}
          {/* ===================================== */}

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
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
            "
          />


          {/* ===================================== */}
          {/* CLIENT */}
          {/* ===================================== */}

          <select
            value={documentData.clientId}
            onChange={(e) =>
              setDocumentData({
                ...documentData,
                clientId: e.target.value,
                projectId: "",
              })
            }
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              bg-white
            "
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


          {/* ===================================== */}
          {/* PROJECT */}
          {/* ===================================== */}

          <select
            value={documentData.projectId}
            onChange={(e) =>
              setDocumentData({
                ...documentData,
                projectId: e.target.value,
              })
            }
            disabled={!documentData.clientId}
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              bg-white
            "
          >
            <option value="">
              Select Project
            </option>

            {Array.isArray(projects) &&
              projects
                .filter(
                  (project) =>
                    project.clientId ===
                    documentData.clientId
                )
                .map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.title}
                  </option>
                ))}
          </select>


          {/* ===================================== */}
          {/* FILE */}
          {/* ===================================== */}

          <div>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx"
              onChange={(e) =>
                setDocumentData({
                  ...documentData,
                  file:
                    e.target.files?.[0] ||
                    null,
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

            {editingDocument && (
              <p className="
                text-xs
                text-muted-foreground
                mt-2
              ">
                Leave the file unchanged to keep
                the current document.
              </p>
            )}

          </div>


          {/* ===================================== */}
          {/* ACTIONS */}
          {/* ===================================== */}

          <div className="
            flex
            gap-3
            pt-1
          ">

            {/* UPLOAD / SAVE */}

            <button
              onClick={
                editingDocument
                  ? updateDocument
                  : createDocument
              }
              className="
                flex-1
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                text-white
                py-3
                rounded-xl
                font-medium
                hover:opacity-90
                transition
              "
            >
              {editingDocument
                ? "Save Changes"
                : "Upload Document"}
            </button>


            {/* CANCEL */}

            <button
              onClick={() => {
                setShowDocumentModal(false);
                setEditingDocument(null);

                setDocumentData({
                  name: "",
                  file: null,
                  clientId: "",
                  projectId: "",
                });
              }}
              className="
                flex-1
                border
                border-gray-300
                py-3
                rounded-xl
                font-medium
                hover:bg-gray-50
                transition
              "
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>
)}


{/* CREATE / EDIT MEETING MODAL */}
{showMeetingModal && (
  <div className="
    fixed
    inset-0
    z-50
    bg-black/50
    flex
    items-center
    justify-center
    p-4
  ">

    <div className="
      bg-white
      rounded-2xl
      w-full
      max-w-md
      max-h-[90vh]
      shadow-2xl
      flex
      flex-col
      overflow-hidden
    ">

      {/* ===================================== */}
      {/* MODAL HEADER */}
      {/* ===================================== */}

      <div className="
        flex
        items-center
        justify-between
        px-8
        py-6
        border-b
        border-gray-200
        shrink-0
      ">

        <h2 className="
          text-2xl
          font-bold
          text-gray-900
        ">
          {editingMeeting
            ? "Edit Meeting"
            : "Create Meeting"}
        </h2>

        {/* CLOSE BUTTON */}
        <button
onClick={() => {
setShowMeetingModal(false);
setEditingMeeting(null);
}}
className="text-gray-400 hover:text-red-500"
>
✕
</button>

      </div>


      {/* ===================================== */}
      {/* SCROLLABLE FORM BODY */}
      {/* ===================================== */}

      <div className="
        flex-1
        overflow-y-auto
        px-8
        py-6
      ">

        <div className="space-y-4">

          {/* MEETING TITLE */}

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
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
            "
          />


          {/* CLIENT */}

          <select
  value={meetingData.clientId}
  onChange={(e) =>
    setMeetingData({
      ...meetingData,
      clientId: e.target.value,
      projectId: "",
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


          {/* PROJECT */}

          <select
  value={meetingData.projectId}
  onChange={(e) =>
    setMeetingData({
      ...meetingData,
      projectId: e.target.value,
    })
  }
  disabled={!meetingData.clientId}
  className="
    w-full
    border
    border-gray-300
    rounded-xl
    px-4
    py-3
    disabled:bg-gray-100
    disabled:text-gray-400
    disabled:cursor-not-allowed
  "
>
  <option value="">
    Select Project
  </option>

  {Array.isArray(projects) &&
    projects
      .filter(
        (project) =>
          project.clientId ===
          meetingData.clientId
      )
      .map((project) => (
        <option
          key={project.id}
          value={project.id}
        >
          {project.title}
        </option>
      ))}
</select>


          {/* DATE */}

          <input
            type="date"
            value={meetingData.date}
            onChange={(e) =>
              setMeetingData({
                ...meetingData,
                date: e.target.value,
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


          {/* TIME */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Time
              <span className="
                text-gray-400
                font-normal
                ml-1
              ">
                (Enter time like 02:30 PM)
              </span>
  </label>
  

  <input
  type="text"
  placeholder="e.g. 02:30 PM"
  value={meetingData.time}
  onChange={(e) =>
    setMeetingData({
      ...meetingData,
      time: e.target.value,
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
</div>

          {/* DURATION */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-1.5
            ">
              Duration
              <span className="
                text-gray-400
                font-normal
                ml-1
              ">
                (in minutes, e.g. 60)
              </span>
            </label>

            <input
              type="number"
              min="1"
              placeholder="e.g. 60"
              value={meetingData.duration}
              onChange={(e) =>
                setMeetingData({
                  ...meetingData,
                  duration: e.target.value,
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

          </div>


          {/* MEETING LINK */}

          <input
            type="url"
            placeholder="Meeting Link"
            value={meetingData.meetingLink}
            onChange={(e) =>
              setMeetingData({
                ...meetingData,
                meetingLink: e.target.value,
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


          {/* NOTES */}

          <textarea
            placeholder="Notes"
            value={meetingData.notes}
            onChange={(e) =>
              setMeetingData({
                ...meetingData,
                notes: e.target.value,
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
            "
          />

        </div>

      </div>


      {/* ===================================== */}
      {/* MODAL FOOTER */}
      {/* ===================================== */}

      <div className="
        flex
        gap-3
        px-8
        py-5
        border-t
        border-gray-200
        bg-white
        shrink-0
      ">

        {/* CREATE / UPDATE */}

        <button
          type="button"
          onClick={
  editingMeeting
    ? updateMeeting
    : createMeeting
}
          className="
            flex-1
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            py-3
            rounded-xl
            font-medium
            transition
          "
        >
        {editingMeeting ? "Save Changes" : "Schedule Meeting"}
        </button>


        {/* CANCEL */}

        <button
          type="button"
          onClick={() => {
            setShowMeetingModal(false);
            setEditingMeeting(null);
          }}
          className="
            flex-1
            border
            border-gray-300
            py-3
            rounded-xl
            font-medium
            hover:bg-gray-50
            transition
          "
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}

{/* ======================================== */}
{/* AI EMAIL */}
{/* ======================================== */}

{activeSection === "ai-email" && (
  <section className="w-full min-h-[70vh] flex items-center justify-center">

    <div className="text-center">

      <div
        className="
          w-16
          h-16
          mx-auto
          rounded-2xl
          bg-indigo-50
          flex
          items-center
          justify-center
          mb-5
        "
      >
        <Astroid
          size={30}
          strokeWidth={1.8}
          className="text-indigo-600"
        />
      </div>

      <h2 className="text-3xl font-bold text-gray-900">
        AI Email
      </h2>

      <p className="text-gray-500 mt-2">
        AI-powered email automation is coming soon.
      </p>

      <span
        className="
          inline-flex
          items-center
          mt-5
          px-5
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
        Coming Soon
      </span>

    </div>

  </section>
)}

{/* ====================================== */}
{/* NOTIFICATION HISTORY */}
{/* ====================================== */}

{activeSection === "notification-history" && (
  <div className="pl-0 pr-8 py-8 -ml-4">

    {/* HEADER */}

    <div className="flex items-start justify-between mb-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Notification History
        </h1>

        <p className="text-gray-500 mt-2">
          View all your notifications and activity.
        </p>
      </div>

      {/* CLOSE / BACK TO DASHBOARD */}

      <button
        type="button"
        onClick={() =>
          setActiveSection("dashboard")
        }
        className="
          w-10
          h-10
          rounded-full
          border
          border-gray-200
          bg-white
          flex
          items-center
          justify-center
          text-gray-500
          hover:text-gray-700
          hover:bg-gray-50
          transition
        "
        aria-label="Back to Dashboard"
        title="Back to Dashboard"
      >
        <X
          size={18}
          strokeWidth={2}
        />
      </button>

    </div>

    {/* NOTIFICATION HISTORY CARD */}

    <div
      className="
        w-full
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-sm
        overflow-hidden
      "
    >

      {notifications.length > 0 ? (

        <div
          className="
            h-[calc(100vh-205px)]
            overflow-y-auto
          "
        >

          {notifications.map(
            (notification: any) => (

              <button
                key={notification.id}
                type="button"
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
                className={`
                  w-full
                  text-left
                  px-6
                  py-5
                  border-b
                  border-gray-100
                  hover:bg-gray-50
                  transition
                  ${
                    !notification.read
                      ? "bg-indigo-50/30"
                      : "bg-white"
                  }
                `}
              >

                <div className="flex gap-4">

                  {/* ICON */}

                  <div
                    className="
                      w-10
                      h-10
                      shrink-0
                      rounded-full
                      bg-indigo-50
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Bell
                      size={18}
                      strokeWidth={1.8}
                      className="text-indigo-600"
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1 min-w-0">

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <h3
                        className={`
                          text-sm
                          ${
                            notification.read
                              ? "font-medium text-gray-800"
                              : "font-semibold text-gray-900"
                          }
                        `}
                      >
                        {notification.title}
                      </h3>

                      {/* UNREAD DOT */}

                      {!notification.read && (
                        <span
                          className="
                            w-2.5
                            h-2.5
                            mt-1.5
                            shrink-0
                            rounded-full
                            bg-indigo-600
                          "
                        />
                      )}

                    </div>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-1
                        leading-6
                      "
                    >
                      {notification.message}
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mt-2
                      "
                    >
                      {formatNotificationTime(
                        notification.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </button>
            )
          )}

        </div>

      ) : (

        <div
          className="
            h-[calc(100vh-205px)]
            flex
            items-center
            justify-center
            text-center
          "
        >
          <div>

            <Bell
              size={36}
              strokeWidth={1.5}
              className="
                mx-auto
                text-gray-300
              "
            />

            <h3
              className="
                text-base
                font-medium
                text-gray-700
                mt-4
              "
            >
              No notifications yet
            </h3>

            <p
              className="
                text-sm
                text-gray-400
                mt-1
              "
            >
              Your notifications will appear here.
            </p>

          </div>
        </div>

      )}

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