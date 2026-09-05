import { prisma } from "@/lib/prisma";

type NotificationInput = {
  userId: string;
  key: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  priority?: string;
};

async function createNotification(
  notification: NotificationInput
) {
  try {
    await prisma.notification.create({
      data: {
        userId: notification.userId,
        key: notification.key,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        entityType: notification.entityType ?? null,
        entityId: notification.entityId ?? null,
        priority: notification.priority ?? "info",
      },
    });
  } catch (error: any) {
    // Duplicate key means notification already exists.
    // We intentionally ignore it.
    if (error?.code !== "P2002") {
      console.error("CREATE NOTIFICATION ERROR:", error);
    }
  }
}

function getDateOnly(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function parseDate(value?: string | null) {
  if (!value) return null;

  // Handle YYYY-MM-DD directly
  const match = value
    .trim()
    .match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function getDaysDifference(
  targetDate: Date
) {
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const difference =
    target.getTime() -
    today.getTime();

  return Math.round(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

export async function generateNotifications(
  userId: string
) {
  const [
    projects,
    tasks,
    invoices,
    meetings,
  ] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
    }),

    prisma.task.findMany({
      where: { userId },
      include: {
        project: true,
        subtasks: true,
      },
    }),

    prisma.invoice.findMany({
      where: { userId },
      include: {
        project: true,
      },
    }),

    prisma.meeting.findMany({
      where: { userId },
      include: {
        project: true,
      },
    }),
  ]);

  /*
   * PROJECT NOTIFICATIONS
   */

  for (const project of projects) {
     console.log(
    "PROJECT:",
    project.title,
    "DEADLINE:",
    project.deadline
  );
    const deadline = parseDate(project.deadline);
     console.log(
    "PARSED DEADLINE:",
    deadline
  );

    if (deadline) {
      const days = getDaysDifference(deadline);
       console.log(
      "DAYS LEFT:",
      days
    );

      if (days === 3) {
        await createNotification({
          userId,
          key: `project-${project.id}-3-days`,
          type: "project_deadline",
          title: "Project Deadline",
          message: `Your project "${project.title}" is due in 3 days. Review the remaining tasks and make sure everything is completed on time.`,
          entityType: "project",
          entityId: project.id,
          priority: "medium",
        });
      }

      if (days === 1) {
        await createNotification({
          userId,
          key: `project-${project.id}-1-day`,
          type: "project_deadline",
          title: "Project Due Tomorrow",
          message: `"${project.title}" is due tomorrow. Complete the remaining work and make sure the project is ready before the deadline.`,
          entityType: "project",
          entityId: project.id,
          priority: "high",
        });
      }

      if (days < 0 && project.status !== "Completed") {
        await createNotification({
          userId,
          key: `project-${project.id}-overdue`,
          type: "project_overdue",
          title: "Project Overdue",
          message: `The deadline for "${project.title}" has passed. Complete the remaining work and update the project status as soon as possible.`,
          entityType: "project",
          entityId: project.id,
          priority: "high",
        });
      }
    }

    if (
      String(project.status).toLowerCase() ===
      "completed"
    ) {
      await createNotification({
        userId,
        key: `project-${project.id}-completed`,
        type: "project_completed",
        title: "Project Completed",
        message: `"${project.title}" has been successfully completed. Before sharing the final project with the client, make sure the outstanding payment has been received.`,
        entityType: "project",
        entityId: project.id,
        priority: "success",
      });
    }

    const projectInvoices = invoices.filter(
      (invoice) => invoice.projectId === project.id
    );

    const paidInvoice = projectInvoices.some(
      (invoice) => invoice.status === "Paid"
    );

    if (
      paidInvoice &&
      String(project.status).toLowerCase() ===
        "completed"
    ) {
      await createNotification({
        userId,
        key: `project-${project.id}-payment-received`,
        type: "project_payment_received",
        title: "Project Payment Received",
        message: `Payment for "${project.title}" has been successfully received. The completed project is now ready to be shared with the client.`,
        entityType: "project",
        entityId: project.id,
        priority: "success",
      });
    }
  }

  /*
   * TASK NOTIFICATIONS
   */

  for (const task of tasks) {
    const dueDate = parseDate(task.dueDate);

    if (dueDate) {
      const days = getDaysDifference(dueDate);

      if (days === 3) {
        await createNotification({
          userId,
          key: `task-${task.id}-3-days`,
          type: "task_deadline",
          title: "Task Deadline",
          message: `The task "${task.title}" is due in 3 days. Complete the remaining work before the deadline.`,
          entityType: "task",
          entityId: task.id,
          priority: "medium",
        });
      }

      if (days === 1) {
        await createNotification({
          userId,
          key: `task-${task.id}-1-day`,
          type: "task_deadline",
          title: "Task Due Tomorrow",
          message: `"${task.title}" is due tomorrow. Finish this task to keep the project on schedule.`,
          entityType: "task",
          entityId: task.id,
          priority: "high",
        });
      }

      if (
        days < 0 &&
        String(task.status).toLowerCase() !==
          "completed"
      ) {
        await createNotification({
          userId,
          key: `task-${task.id}-overdue`,
          type: "task_overdue",
          title: "Task Overdue",
          message: `The deadline for "${task.title}" has passed. Complete the task as soon as possible to avoid delaying the project.`,
          entityType: "task",
          entityId: task.id,
          priority: "high",
        });
      }
    }

    /*
     * Completion is based on subtasks, matching
     * your current task UI logic.
     */
    const completedSubtasks =
      task.subtasks.filter(
        (subtask) => subtask.completed
      ).length;

    const totalSubtasks =
      task.subtasks.length;

    const progress =
      totalSubtasks > 0
        ? Math.round(
            (completedSubtasks / totalSubtasks) * 100
          )
        : task.progress;

    if (
      progress === 100 ||
      String(task.status).toLowerCase() ===
        "completed"
    ) {
      await createNotification({
        userId,
        key: `task-${task.id}-completed`,
        type: "task_completed",
        title: "Task Completed",
        message: `You have completed "${task.title}" successfully. Complete the remaining tasks to finish the project within the deadline.`,
        entityType: "task",
        entityId: task.id,
        priority: "success",
      });
    }
  }

  /*
   * INVOICE NOTIFICATIONS
   */

  for (const invoice of invoices) {
    const invoiceNumber =
      invoice.invoiceNumber || invoice.id;

    if (
      invoice.status === "Pending" ||
      invoice.status === "Sent"
    ) {
      await createNotification({
        userId,
        key: `invoice-${invoice.id}-pending`,
        type: "invoice_pending",
        title: "Invoice Pending",
        message: `Invoice "${invoiceNumber}" has not been paid yet. Open the Invoices section and send it to the client.`,
        entityType: "invoice",
        entityId: invoice.id,
        priority: "medium",
      });
    }

    if (invoice.dueDate) {
      const days = getDaysDifference(
        invoice.dueDate
      );

      if (days === 3) {
        await createNotification({
          userId,
          key: `invoice-${invoice.id}-3-days`,
          type: "invoice_deadline",
          title: "Invoice Payment Due",
          message: `The payment deadline for invoice "${invoiceNumber}" is in 3 days. Make sure the client receives the payment request before the deadline.`,
          entityType: "invoice",
          entityId: invoice.id,
          priority: "medium",
        });
      }

      if (days === 1) {
        await createNotification({
          userId,
          key: `invoice-${invoice.id}-1-day`,
          type: "invoice_deadline",
          title: "Invoice Due Tomorrow",
          message: `The payment deadline for invoice "${invoiceNumber}" is tomorrow. Send a payment reminder to the client and request the total amount before the deadline.`,
          entityType: "invoice",
          entityId: invoice.id,
          priority: "high",
        });
      }

      if (
        days < 0 &&
        invoice.status !== "Paid"
      ) {
        await createNotification({
          userId,
          key: `invoice-${invoice.id}-overdue`,
          type: "invoice_overdue",
          title: "Invoice Overdue",
          message: `Invoice "${invoiceNumber}" has passed its payment deadline. Follow up with the client and request the outstanding amount.`,
          entityType: "invoice",
          entityId: invoice.id,
          priority: "high",
        });
      }
    }

    if (
      invoice.status === "Paid" ||
      invoice.paidDate
    ) {
      await createNotification({
        userId,
        key: `invoice-${invoice.id}-paid`,
        type: "invoice_paid",
        title: "Payment Received",
        message: `The payment for invoice "${invoiceNumber}" has been successfully received.`,
        entityType: "invoice",
        entityId: invoice.id,
        priority: "success",
      });
    }
  }

  /*
   * MEETING NOTIFICATIONS
   */

  for (const meeting of meetings) {
    const start = getMeetingStartDateTime(
      meeting.date,
      meeting.time
    );

    if (!start) continue;

    const now = new Date();

    const diff =
      start.getTime() - now.getTime();

    const minutes = Math.floor(
      diff / (1000 * 60)
    );

    if (minutes > 0 && minutes <= 15) {
      await createNotification({
        userId,
        key: `meeting-${meeting.id}-soon`,
        type: "meeting_soon",
        title: "Meeting Starting Soon",
        message: `Your meeting "${meeting.title}" starts soon. Open the Meetings section to review the details or join the meeting.`,
        entityType: "meeting",
        entityId: meeting.id,
        priority: "medium",
      });
    }

    if (
      Math.abs(minutes) <= 1
    ) {
      await createNotification({
        userId,
        key: `meeting-${meeting.id}-started`,
        type: "meeting_started",
        title: "Meeting Starting",
        message: `"${meeting.title}" is starting now. Join the meeting using the meeting link.`,
        entityType: "meeting",
        entityId: meeting.id,
        priority: "high",
      });
    }

    const duration =
      Number(meeting.duration) || 0;

    const end =
      new Date(
        start.getTime() +
          duration * 60 * 1000
      );

    if (
      duration > 0 &&
      now >= end
    ) {
      await createNotification({
        userId,
        key: `meeting-${meeting.id}-adjourned`,
        type: "meeting_adjourned",
        title: "Meeting Adjourned",
        message: `"${meeting.title}" has ended. Review the meeting details and add any notes or follow-up actions.`,
        entityType: "meeting",
        entityId: meeting.id,
        priority: "info",
      });
    }
  }
}

function getMeetingStartDateTime(
  date?: string | null,
  time?: string | null
) {
  if (!date || !time) return null;

  const match = time
    .trim()
    .match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);

  const meridiem =
    match[3].toUpperCase();

  if (
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  if (meridiem === "AM") {
    if (hours === 12) hours = 0;
  } else {
    if (hours !== 12) hours += 12;
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
}