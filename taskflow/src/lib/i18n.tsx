'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type Language = 'en' | 'de' | 'vi';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Tasks',
    'nav.projects': 'Projects',
    'nav.tags': 'Tags',
    'nav.statistics': 'Statistics',
    'nav.settings': 'Settings',
    'nav.signOut': 'Sign Out',

    // Sidebar
    'sidebar.quickActions': 'Quick Actions',
    'sidebar.newTask': 'New Task',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome':
      "Welcome to TaskFlow. Here's an overview of your tasks and projects.",
    'dashboard.totalTasks': 'Total Tasks',
    'dashboard.allTasks': 'All tasks in the system',
    'dashboard.inProgress': 'In Progress',
    'dashboard.activeTasks': 'Currently active tasks',
    'dashboard.projects': 'Projects',
    'dashboard.activeProjects': 'Active projects',
    'dashboard.completionRate': 'Completion Rate',
    'dashboard.tasksCompleted': 'Tasks completed',
    'dashboard.priorityTasks': 'Priority Tasks',
    'dashboard.tasksRequiringAttention': 'Tasks requiring attention',
    'dashboard.viewAll': 'View all',
    'dashboard.noActiveTasks': 'No active tasks',
    'dashboard.createFirstTask': 'Create your first task to get started',
    'dashboard.start': 'Start',
    'dashboard.stop': 'Stop',
    'dashboard.done': 'Done',
    'dashboard.undo': 'Undo',
    'dashboard.due': 'Due',
    'dashboard.quickStart': 'Quick Start',
    'dashboard.quickStartDesc': 'Get started with TaskFlow in a few easy steps',
    'dashboard.tipsTricks': 'Tips & Tricks',
    'dashboard.tipsTricksDesc': 'Make the most out of TaskFlow',
    'dashboard.step1Title': 'Create a Project',
    'dashboard.step1Desc': 'Organize your tasks into projects',
    'dashboard.step2Title': 'Add Tasks',
    'dashboard.step2Desc': 'Create tasks with priorities and due dates',
    'dashboard.step3Title': 'Track Time',
    'dashboard.step3Desc': 'Use time tracking to monitor productivity',
    'dashboard.tip1Title': 'Use Tags',
    'dashboard.tip1Desc': 'Tag tasks to categorize and filter them easily',
    'dashboard.tip2Title': 'Set Priorities',
    'dashboard.tip2Desc': 'Mark tasks as Urgent, High, Medium, or Low priority',
    'dashboard.tip3Title': 'View Statistics',
    'dashboard.tip3Desc': 'Check your productivity stats regularly',

    // Settings
    'settings.title': 'Settings',
    'settings.description': 'Manage your application settings and data',
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select your preferred language',
    'settings.english': 'English',
    'settings.german': 'German',
    'settings.vietnamese': 'Vietnamese',
    'settings.appearance': 'Appearance',
    'settings.themeDescription': 'Choose your preferred theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    'settings.dataManagement': 'Data Management',
    'settings.exportTitle': 'Export Data',
    'settings.exportDesc':
      'Download a backup of all your tasks, projects, and tags',
    'settings.exportIncludes': 'This will export all your data including',
    'settings.exportTasks': 'All tasks with descriptions and status',
    'settings.exportProjects': 'Projects and their associations',
    'settings.exportTags': 'Tags and task-tag relationships',
    'settings.exportTimeEntries': 'Time entries and tracking history',
    'settings.export': 'Export',
    'settings.exporting': 'Exporting...',
    'settings.exportSuccess': 'Export successful',
    'settings.exportSuccessDesc':
      'Exported {tasks} tasks, {projects} projects, {tags} tags',
    'settings.exportError': 'Export failed',
    'settings.exportErrorDesc': 'Could not export your data. Please try again.',
    'settings.resetTitle': 'Reset Data',
    'settings.resetDesc': 'Clear all your data permanently',
    'settings.resetWarning': 'Warning: This action cannot be undone',
    'settings.reset': 'Reset All Data',
    'settings.resetting': 'Resetting...',
    'settings.resetConfirmTitle': 'Are you absolutely sure?',
    'settings.resetConfirmDesc':
      'This will permanently delete all tasks, projects, tags, and time entries. This action cannot be undone.',
    'settings.resetConfirmYes': 'Yes, delete everything',
    'settings.cancel': 'Cancel',
    'settings.resetSuccess': 'Data reset complete',
    'settings.resetSuccessDesc':
      'All your data has been cleared. The page will reload.',
    'settings.resetError': 'Reset failed',
    'settings.resetErrorDesc': 'Could not reset your data. Please try again.',
    'settings.account': 'Account',
    'settings.accountDesc': 'Manage your account settings',
    'settings.signedInAs': 'Signed in as',
    'settings.signOut': 'Sign Out',
    'settings.signOutDesc': 'Sign out of your account on this device',

    // Tasks
    'tasks.title': 'Tasks',
    'tasks.description': 'Manage and organize your tasks',
    'tasks.newTask': 'New Task',
    'tasks.search': 'Search tasks...',
    'tasks.filter': 'Filter',
    'tasks.noTasks': 'No tasks yet',
    'tasks.createFirstTask':
      'Start by creating your first task to track your work',
    'tasks.createTask': 'Create Task',
    'tasks.loading': 'Loading...',
    'tasks.clearFilters': 'Clear Filters',
    'tasks.clearAll': 'Clear all',
    'tasks.activeFilters': 'Active filters',
    'tasks.status': 'Status',
    'tasks.priority': 'Priority',
    'tasks.project': 'Project',
    'tasks.tag': 'Tag',
    'tasks.allStatus': 'All Status',
    'tasks.allPriorities': 'All Priorities',
    'tasks.allProjects': 'All Projects',
    'tasks.allTags': 'All Tags',
    'tasks.statusTodo': 'To Do',
    'tasks.statusInProgress': 'In Progress',
    'tasks.statusDone': 'Done',
    'tasks.statusCancelled': 'Cancelled',
    'tasks.priorityLow': 'Low',
    'tasks.priorityMedium': 'Medium',
    'tasks.priorityHigh': 'High',
    'tasks.priorityUrgent': 'Urgent',
    'tasks.tracking': 'Tracking',
    'tasks.due': 'Due',
    'tasks.stop': 'Stop',
    'tasks.track': 'Track',
    'tasks.completed': 'Completed',
    'tasks.deleteConfirm': 'Are you sure you want to delete this task?',
    'tasks.deleteSuccess': 'Task deleted',
    'tasks.deleteSuccessDesc': 'The task has been successfully deleted.',
    'tasks.deleteError': 'Error',
    'tasks.deleteErrorDesc': 'Failed to delete task.',
    'tasks.deleteErrorGeneric': 'An error occurred while deleting the task.',
    'tasks.stopTracking': 'Stop tracking',
    'tasks.startTracking': 'Start tracking',
    'tasks.edit': 'Edit',
    'tasks.delete': 'Delete',
    'tasks.hideCompleted': 'Hide completed tasks',

    // Task Dialog
    'taskDialog.editTask': 'Edit Task',
    'taskDialog.createTask': 'Create Task',
    'taskDialog.title': 'Title',
    'taskDialog.titleRequired': 'Title *',
    'taskDialog.titlePlaceholder': 'Enter task title...',
    'taskDialog.description': 'Description',
    'taskDialog.descriptionPlaceholder': 'Add a description...',
    'taskDialog.status': 'Status',
    'taskDialog.priority': 'Priority',
    'taskDialog.project': 'Project',
    'taskDialog.selectProject': 'Select project...',
    'taskDialog.noProject': 'No Project',
    'taskDialog.dueDate': 'Due Date',
    'taskDialog.tags': 'Add Tags',
    'taskDialog.noTagsYet': 'No tags yet.',
    'taskDialog.createTagsFirst': 'Create tags first →',
    'taskDialog.cancel': 'Cancel',
    'taskDialog.saveChanges': 'Save Changes',

    // Priority Tasks
    'priorityTasks.noActiveTasks': 'No active tasks',
    'priorityTasks.createFirstTask': 'Create your first task to get started',
    'priorityTasks.tracking': 'Tracking',
    'priorityTasks.undo': 'Undo',
    'priorityTasks.start': 'Start',
    'priorityTasks.stop': 'Stop',

    // Error Boundary
    'errorBoundary.title': 'Something went wrong',
    'errorBoundary.description':
      'An unexpected error occurred. Please try again or contact support if the problem persists.',
    'errorBoundary.retry': 'Try Again',
    'errorBoundary.reload': 'Reload Page',

    // Projects
    'projects.title': 'Projects',
    'projects.description': 'Organize your tasks into projects',
    'projects.newProject': 'New Project',
    'projects.noProjects': 'No projects yet',
    'projects.createFirstProject':
      'Create your first project to organize your tasks',
    'projects.createProject': 'Create Project',
    'projects.loading': 'Loading...',
    'projects.editProjectName': 'Edit project name...',
    'projects.newProjectName': 'New project name...',
    'projects.update': 'Update',
    'projects.create': 'Create',
    'projects.cancel': 'Cancel',
    'projects.nameRequired': 'Project name is required',
    'projects.createError': 'Error creating project',
    'projects.updateError': 'Error updating project',
    'projects.deleteConfirm':
      'Are you sure you want to delete this project? All associated tasks will also be deleted.',
    'projects.deleteError': 'Failed to delete project',
    'projects.tasks': 'tasks',
    'projects.viewTasks': 'View tasks',
    'projects.edit': 'Edit',
    'projects.delete': 'Delete',

    // Tags
    'tags.title': 'Tags',
    'tags.description': 'Manage tags to categorize your tasks',
    'tags.newTag': 'New Tag',
    'tags.noTags': 'No tags yet',
    'tags.createFirstTag': 'Create tags to categorize and filter your tasks',
    'tags.loading': 'Loading...',
    'tags.createNewTag': 'Create New Tag',
    'tags.editTag': 'Edit Tag',
    'tags.tagName': 'Tag name...',
    'tags.selectColor': 'Select Color',
    'tags.create': 'Create',
    'tags.update': 'Update',
    'tags.cancel': 'Cancel',
    'tags.nameRequired': 'Tag name is required',
    'tags.alreadyExists': 'Tag with this name already exists',
    'tags.deleteConfirm': 'Are you sure you want to delete this tag?',
    'tags.viewTasks': 'View tasks',
    'tags.tasks': 'tasks',
    'tags.edit': 'Edit',
    'tags.delete': 'Delete',

    // Statistics
    'stats.title': 'Statistics',
    'stats.description': 'Track your productivity and task completion',
    'stats.loading': 'Loading...',
    'stats.totalTasks': 'Total Tasks',
    'stats.completed': 'Completed',
    'stats.completionRate': 'completion rate',
    'stats.inProgress': 'In Progress',
    'stats.timeTracked': 'Time Tracked',
    'stats.tasksByPriority': 'Tasks by Priority',
    'stats.recentActivity': 'Recent Activity',
    'stats.noData': 'No data available',
    'stats.noRecentActivity': 'No recent activity',
    'stats.tasks': 'tasks',
    'stats.noProject': 'No project',
  },
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Aufgaben',
    'nav.projects': 'Projekte',
    'nav.tags': 'Tags',
    'nav.statistics': 'Statistiken',
    'nav.settings': 'Einstellungen',
    'nav.signOut': 'Abmelden',

    // Sidebar
    'sidebar.quickActions': 'Schnellaktionen',
    'sidebar.newTask': 'Neue Aufgabe',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome':
      'Willkommen bei TaskFlow. Hier ist eine Übersicht Ihrer Aufgaben und Projekte.',
    'dashboard.totalTasks': 'Gesamtaufgaben',
    'dashboard.allTasks': 'Alle Aufgaben im System',
    'dashboard.inProgress': 'In Bearbeitung',
    'dashboard.activeTasks': 'Aktuell aktive Aufgaben',
    'dashboard.projects': 'Projekte',
    'dashboard.activeProjects': 'Aktive Projekte',
    'dashboard.completionRate': 'Abschlussrate',
    'dashboard.tasksCompleted': 'Abgeschlossene Aufgaben',
    'dashboard.priorityTasks': 'Prioritätsaufgaben',
    'dashboard.tasksRequiringAttention':
      'Aufgaben die Aufmerksamkeit erfordern',
    'dashboard.viewAll': 'Alle anzeigen',
    'dashboard.noActiveTasks': 'Keine aktiven Aufgaben',
    'dashboard.createFirstTask':
      'Erstellen Sie Ihre erste Aufgabe um loszulegen',
    'dashboard.start': 'Tracken',
    'dashboard.stop': 'Stoppen',
    'dashboard.done': 'Erledigt',
    'dashboard.undo': 'Rückgängig',
    'dashboard.due': 'Fällig',
    'dashboard.quickStart': 'Schnellstart',
    'dashboard.quickStartDesc':
      'Lernen Sie TaskFlow mit wenigen einfachen Schritten kennen',
    'dashboard.tipsTricks': 'Tipps & Tricks',
    'dashboard.tipsTricksDesc': 'Nutzen Sie TaskFlow optimal',
    'dashboard.step1Title': 'Projekt erstellen',
    'dashboard.step1Desc': 'Organisieren Sie Ihre Aufgaben in Projekten',
    'dashboard.step2Title': 'Aufgaben hinzufügen',
    'dashboard.step2Desc':
      'Erstellen Sie Aufgaben mit Prioritäten und Fälligkeitsdaten',
    'dashboard.step3Title': 'Zeit tracken',
    'dashboard.step3Desc':
      'Verwenden Sie Zeiterfassung um Produktivität zu überwachen',
    'dashboard.tip1Title': 'Tags verwenden',
    'dashboard.tip1Desc':
      'Taggen Sie Aufgaben um sie zu kategorisieren und filtern',
    'dashboard.tip2Title': 'Prioritäten setzen',
    'dashboard.tip2Desc':
      'Markieren Sie Aufgaben als Dringend, Hoch, Mittel oder Niedrig',
    'dashboard.tip3Title': 'Statistiken ansehen',
    'dashboard.tip3Desc':
      'Überprüfen Sie regelmäßig Ihre Produktivitätsstatistiken',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.description':
      'Verwalten Sie Ihre Anwendungseinstellungen und Daten',
    'settings.language': 'Sprache',
    'settings.selectLanguage': 'Wählen Sie Ihre bevorzugte Sprache',
    'settings.english': 'Englisch',
    'settings.german': 'Deutsch',
    'settings.vietnamese': 'Vietnamesisch',
    'settings.appearance': 'Erscheinungsbild',
    'settings.themeDescription': 'Wählen Sie Ihr bevorzugtes Theme',
    'settings.light': 'Hell',
    'settings.dark': 'Dunkel',
    'settings.system': 'System',
    'settings.dataManagement': 'Datenverwaltung',
    'settings.exportTitle': 'Daten exportieren',
    'settings.exportDesc':
      'Laden Sie ein Backup aller Aufgaben, Projekte und Tags herunter',
    'settings.exportIncludes': 'Dies exportiert alle Ihre Daten inklusive',
    'settings.exportTasks': 'Alle Aufgaben mit Beschreibungen und Status',
    'settings.exportProjects': 'Projekte und deren Zuordnungen',
    'settings.exportTags': 'Tags und Aufgaben-Tag-Beziehungen',
    'settings.exportTimeEntries': 'Zeiteinträge und Tracking-Verlauf',
    'settings.export': 'Exportieren',
    'settings.exporting': 'Exportiere...',
    'settings.exportSuccess': 'Export erfolgreich',
    'settings.exportSuccessDesc':
      '{tasks} Aufgaben, {projects} Projekte, {tags} Tags exportiert',
    'settings.exportError': 'Export fehlgeschlagen',
    'settings.exportErrorDesc':
      'Daten konnten nicht exportiert werden. Bitte versuchen Sie es erneut.',
    'settings.resetTitle': 'Daten zurücksetzen',
    'settings.resetDesc': 'Löschen Sie alle Daten dauerhaft',
    'settings.resetWarning':
      'Warnung: Diese Aktion kann nicht rückgängig gemacht werden',
    'settings.reset': 'Alle Daten zurücksetzen',
    'settings.resetting': 'Setze zurück...',
    'settings.resetConfirmTitle': 'Sind Sie sich absolut sicher?',
    'settings.resetConfirmDesc':
      'Dies löscht dauerhaft alle Aufgaben, Projekte, Tags und Zeiteinträge. Diese Aktion kann nicht rückgängig gemacht werden.',
    'settings.resetConfirmYes': 'Ja, alles löschen',
    'settings.cancel': 'Abbrechen',
    'settings.resetSuccess': 'Zurücksetzen abgeschlossen',
    'settings.resetSuccessDesc':
      'Alle Daten wurden gelöscht. Die Seite wird neu geladen.',
    'settings.resetError': 'Zurücksetzen fehlgeschlagen',
    'settings.resetErrorDesc':
      'Daten konnten nicht zurückgesetzt werden. Bitte versuchen Sie es erneut.',
    'settings.account': 'Konto',
    'settings.accountDesc': 'Verwalten Sie Ihre Kontoeinstellungen',
    'settings.signedInAs': 'Angemeldet als',
    'settings.signOut': 'Abmelden',
    'settings.signOutDesc': 'Melden Sie sich von diesem Gerät ab',

    // Tasks
    'tasks.title': 'Aufgaben',
    'tasks.description': 'Verwalten und organisieren Sie Ihre Aufgaben',
    'tasks.newTask': 'Neue Aufgabe',
    'tasks.search': 'Aufgaben suchen...',
    'tasks.filter': 'Filter',
    'tasks.noTasks': 'Noch keine Aufgaben',
    'tasks.createFirstTask':
      'Erstellen Sie Ihre erste Aufgabe um Ihre Arbeit zu verfolgen',
    'tasks.createTask': 'Aufgabe erstellen',
    'tasks.loading': 'Lade...',
    'tasks.clearFilters': 'Filter zurücksetzen',
    'tasks.clearAll': 'Alle zurücksetzen',
    'tasks.activeFilters': 'Aktive Filter',
    'tasks.status': 'Status',
    'tasks.priority': 'Priorität',
    'tasks.project': 'Projekt',
    'tasks.tag': 'Tag',
    'tasks.allStatus': 'Alle Status',
    'tasks.allPriorities': 'Alle Prioritäten',
    'tasks.allProjects': 'Alle Projekte',
    'tasks.allTags': 'Alle Tags',
    'tasks.statusTodo': 'Zu erledigen',
    'tasks.statusInProgress': 'In Bearbeitung',
    'tasks.statusDone': 'Erledigt',
    'tasks.statusCancelled': 'Abgebrochen',
    'tasks.priorityLow': 'Niedrig',
    'tasks.priorityMedium': 'Mittel',
    'tasks.priorityHigh': 'Hoch',
    'tasks.priorityUrgent': 'Dringend',
    'tasks.tracking': 'Tracking',
    'tasks.due': 'Fällig',
    'tasks.stop': 'Stop',
    'tasks.track': 'Tracken',
    'tasks.completed': 'Abgeschlossen',
    'tasks.deleteConfirm': 'Möchten Sie diese Aufgabe wirklich löschen?',
    'tasks.deleteSuccess': 'Aufgabe gelöscht',
    'tasks.deleteSuccessDesc': 'Die Aufgabe wurde erfolgreich gelöscht.',
    'tasks.deleteError': 'Fehler',
    'tasks.deleteErrorDesc': 'Aufgabe konnte nicht gelöscht werden.',
    'tasks.deleteErrorGeneric':
      'Ein Fehler ist beim Löschen der Aufgabe aufgetreten.',
    'tasks.stopTracking': 'Tracking stoppen',
    'tasks.startTracking': 'Tracking starten',
    'tasks.edit': 'Bearbeiten',
    'tasks.delete': 'Löschen',
    'tasks.hideCompleted': 'Abgeschlossene ausblenden',

    // Task Dialog
    'taskDialog.editTask': 'Aufgabe bearbeiten',
    'taskDialog.createTask': 'Aufgabe erstellen',
    'taskDialog.title': 'Titel',
    'taskDialog.titleRequired': 'Titel *',
    'taskDialog.titlePlaceholder': 'Aufgabentitel eingeben...',
    'taskDialog.description': 'Beschreibung',
    'taskDialog.descriptionPlaceholder': 'Beschreibung hinzufügen...',
    'taskDialog.status': 'Status',
    'taskDialog.priority': 'Priorität',
    'taskDialog.project': 'Projekt',
    'taskDialog.selectProject': 'Projekt auswählen...',
    'taskDialog.noProject': 'Kein Projekt',
    'taskDialog.dueDate': 'Fälligkeitsdatum',
    'taskDialog.tags': 'Tags hinzufügen',
    'taskDialog.noTagsYet': 'Noch keine Tags.',
    'taskDialog.createTagsFirst': 'Erstelle zuerst Tags →',
    'taskDialog.cancel': 'Abbrechen',
    'taskDialog.saveChanges': 'Änderungen speichern',

    // Priority Tasks
    'priorityTasks.noActiveTasks': 'Keine aktiven Aufgaben',
    'priorityTasks.createFirstTask':
      'Erstelle deine erste Aufgabe, um loszulegen',
    'priorityTasks.tracking': 'Tracking',
    'priorityTasks.undo': 'Rückgängig',
    'priorityTasks.start': 'Starten',
    'priorityTasks.stop': 'Stoppen',

    // Error Boundary
    'errorBoundary.title': 'Etwas ist schiefgelaufen',
    'errorBoundary.description':
      'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut oder kontaktiere den Support, wenn das Problem weiterhin besteht.',
    'errorBoundary.retry': 'Erneut versuchen',
    'errorBoundary.reload': 'Seite neu laden',

    // Projects
    'projects.title': 'Projekte',
    'projects.description': 'Organisieren Sie Ihre Aufgaben in Projekten',
    'projects.newProject': 'Neues Projekt',
    'projects.noProjects': 'Noch keine Projekte',
    'projects.createFirstProject':
      'Erstellen Sie Ihr erstes Projekt um Aufgaben zu organisieren',
    'projects.createProject': 'Projekt erstellen',
    'projects.loading': 'Lade...',
    'projects.editProjectName': 'Projektnamen bearbeiten...',
    'projects.newProjectName': 'Neuer Projektname...',
    'projects.update': 'Aktualisieren',
    'projects.create': 'Erstellen',
    'projects.cancel': 'Abbrechen',
    'projects.nameRequired': 'Projektname ist erforderlich',
    'projects.createError': 'Fehler beim Erstellen des Projekts',
    'projects.updateError': 'Fehler beim Aktualisieren des Projekts',
    'projects.deleteConfirm':
      'Möchten Sie dieses Projekt wirklich löschen? Alle zugehörigen Aufgaben werden ebenfalls gelöscht.',
    'projects.deleteError': 'Projekt konnte nicht gelöscht werden',
    'projects.tasks': 'Aufgaben',
    'projects.viewTasks': 'Aufgaben anzeigen',
    'projects.edit': 'Bearbeiten',
    'projects.delete': 'Löschen',

    // Tags
    'tags.title': 'Tags',
    'tags.description': 'Verwalten Sie Tags um Ihre Aufgaben zu kategorisieren',
    'tags.newTag': 'Neues Tag',
    'tags.noTags': 'Noch keine Tags',
    'tags.createFirstTag':
      'Erstellen Sie Tags um Aufgaben zu kategorisieren und zu filtern',
    'tags.loading': 'Lade...',
    'tags.createNewTag': 'Neues Tag erstellen',
    'tags.editTag': 'Tag bearbeiten',
    'tags.tagName': 'Tag-Name...',
    'tags.selectColor': 'Farbe auswählen',
    'tags.create': 'Erstellen',
    'tags.update': 'Aktualisieren',
    'tags.cancel': 'Abbrechen',
    'tags.nameRequired': 'Tag-Name ist erforderlich',
    'tags.alreadyExists': 'Ein Tag mit diesem Namen existiert bereits',
    'tags.deleteConfirm': 'Möchten Sie dieses Tag wirklich löschen?',
    'tags.viewTasks': 'Aufgaben anzeigen',
    'tags.tasks': 'Aufgaben',
    'tags.edit': 'Bearbeiten',
    'tags.delete': 'Löschen',

    // Statistics
    'stats.title': 'Statistiken',
    'stats.description':
      'Verfolgen Sie Ihre Produktivität und Aufgabenabschlüsse',
    'stats.loading': 'Lade...',
    'stats.totalTasks': 'Gesamtaufgaben',
    'stats.completed': 'Abgeschlossen',
    'stats.completionRate': 'Abschlussrate',
    'stats.inProgress': 'In Bearbeitung',
    'stats.timeTracked': 'Zeit erfasst',
    'stats.tasksByPriority': 'Aufgaben nach Priorität',
    'stats.recentActivity': 'Letzte Aktivität',
    'stats.noData': 'Keine Daten verfügbar',
    'stats.noRecentActivity': 'Keine kürzliche Aktivität',
    'stats.tasks': 'Aufgaben',
    'stats.noProject': 'Kein Projekt',
  },
  vi: {
    // Navigation
    'nav.dashboard': 'Bảng điều khiển',
    'nav.tasks': 'Công việc',
    'nav.projects': 'Dự án',
    'nav.tags': 'Thẻ',
    'nav.statistics': 'Thống kê',
    'nav.settings': 'Cài đặt',
    'nav.signOut': 'Đăng xuất',

    // Sidebar
    'sidebar.quickActions': 'Thao tác nhanh',
    'sidebar.newTask': 'Công việc mới',

    // Dashboard
    'dashboard.title': 'Bảng điều khiển',
    'dashboard.welcome':
      'Chào mừng đến với TaskFlow. Đây là tổng quan về công việc và dự án của bạn.',
    'dashboard.totalTasks': 'Tổng số công việc',
    'dashboard.allTasks': 'Tất cả công việc trong hệ thống',
    'dashboard.inProgress': 'Đang thực hiện',
    'dashboard.activeTasks': 'Công việc đang hoạt động',
    'dashboard.projects': 'Dự án',
    'dashboard.activeProjects': 'Dự án đang hoạt động',
    'dashboard.completionRate': 'Tỷ lệ hoàn thành',
    'dashboard.tasksCompleted': 'Công việc đã hoàn thành',
    'dashboard.priorityTasks': 'Công việc ưu tiên',
    'dashboard.tasksRequiringAttention': 'Công việc cần chú ý',
    'dashboard.viewAll': 'Xem tất cả',
    'dashboard.noActiveTasks': 'Không có công việc nào đang hoạt động',
    'dashboard.createFirstTask': 'Tạo công việc đầu tiên để bắt đầu',
    'dashboard.start': 'Theo dõi',
    'dashboard.stop': 'Dừng',
    'dashboard.done': 'Xong',
    'dashboard.undo': 'Hoàn tác',
    'dashboard.due': 'Hạn',
    'dashboard.quickStart': 'Bắt đầu nhanh',
    'dashboard.quickStartDesc':
      'Làm quen với TaskFlow chỉ trong vài bước đơn giản',
    'dashboard.tipsTricks': 'Mẹo & Thủ thuật',
    'dashboard.tipsTricksDesc': 'Tận dụng tối đa TaskFlow',
    'dashboard.step1Title': 'Tạo dự án',
    'dashboard.step1Desc': 'Tổ chức công việc của bạn thành các dự án',
    'dashboard.step2Title': 'Thêm công việc',
    'dashboard.step2Desc': 'Tạo công việc với mức độ ưu tiên và ngày hết hạn',
    'dashboard.step3Title': 'Theo dõi thời gian',
    'dashboard.step3Desc': 'Sử dụng theo dõi thời gian để giám sát năng suất',
    'dashboard.tip1Title': 'Sử dụng thẻ',
    'dashboard.tip1Desc': 'Gắn thẻ công việc để phân loại và lọc dễ dàng',
    'dashboard.tip2Title': 'Đặt mức ưu tiên',
    'dashboard.tip2Desc':
      'Đánh dấu công việc là Khẩn cấp, Cao, Trung bình hoặc Thấp',
    'dashboard.tip3Title': 'Xem thống kê',
    'dashboard.tip3Desc': 'Kiểm tra thống kê năng suất của bạn thường xuyên',

    // Settings
    'settings.title': 'Cài đặt',
    'settings.description': 'Quản lý cài đặt ứng dụng và dữ liệu của bạn',
    'settings.language': 'Ngôn ngữ',
    'settings.selectLanguage': 'Chọn ngôn ngữ ưa thích',
    'settings.english': 'Tiếng Anh',
    'settings.german': 'Tiếng Đức',
    'settings.vietnamese': 'Tiếng Việt',
    'settings.appearance': 'Giao diện',
    'settings.themeDescription': 'Chọn chủ đề ưa thích',
    'settings.light': 'Sáng',
    'settings.dark': 'Tối',
    'settings.system': 'Hệ thống',
    'settings.dataManagement': 'Quản lý dữ liệu',
    'settings.exportTitle': 'Xuất dữ liệu',
    'settings.exportDesc':
      'Tải xuống bản sao lưu tất cả công việc, dự án và thẻ',
    'settings.exportIncludes': 'Bao gồm tất cả dữ liệu của bạn',
    'settings.exportTasks': 'Tất cả công việc với mô tả và trạng thái',
    'settings.exportProjects': 'Dự án và liên kết của chúng',
    'settings.exportTags': 'Thẻ và mối quan hệ công việc-thẻ',
    'settings.exportTimeEntries': 'Mục nhập thời gian và lịch sử theo dõi',
    'settings.export': 'Xuất',
    'settings.exporting': 'Đang xuất...',
    'settings.exportSuccess': 'Xuất thành công',
    'settings.exportSuccessDesc':
      'Đã xuất {tasks} công việc, {projects} dự án, {tags} thẻ',
    'settings.exportError': 'Xuất thất bại',
    'settings.exportErrorDesc': 'Không thể xuất dữ liệu. Vui lòng thử lại.',
    'settings.resetTitle': 'Đặt lại dữ liệu',
    'settings.resetDesc': 'Xóa vĩnh viễn tất cả dữ liệu của bạn',
    'settings.resetWarning': 'Cảnh báo: Hành động này không thể hoàn tác',
    'settings.reset': 'Đặt lại tất cả dữ liệu',
    'settings.resetting': 'Đang đặt lại...',
    'settings.resetConfirmTitle': 'Bạn có chắc chắn không?',
    'settings.resetConfirmDesc':
      'Hành động này sẽ xóa vĩnh viễn tất cả công việc, dự án, thẻ và mục nhập thời gian. Hành động này không thể hoàn tác.',
    'settings.resetConfirmYes': 'Có, xóa tất cả',
    'settings.cancel': 'Hủy',
    'settings.resetSuccess': 'Đặt lại dữ liệu hoàn tất',
    'settings.resetSuccessDesc':
      'Tất cả dữ liệu của bạn đã bị xóa. Trang sẽ tải lại.',
    'settings.resetError': 'Đặt lại thất bại',
    'settings.resetErrorDesc': 'Không thể đặt lại dữ liệu. Vui lòng thử lại.',
    'settings.account': 'Tài khoản',
    'settings.accountDesc': 'Quản lý cài đặt tài khoản của bạn',
    'settings.signedInAs': 'Đăng nhập với',
    'settings.signOut': 'Đăng xuất',
    'settings.signOutDesc': 'Đăng xuất khỏi tài khoản trên thiết bị này',

    // Tasks
    'tasks.title': 'Công việc',
    'tasks.description': 'Quản lý và tổ chức công việc của bạn',
    'tasks.newTask': 'Công việc mới',
    'tasks.search': 'Tìm kiếm công việc...',
    'tasks.filter': 'Bộ lọc',
    'tasks.noTasks': 'Chưa có công việc nào',
    'tasks.createFirstTask':
      'Bắt đầu bằng cách tạo công việc đầu tiên để theo dõi',
    'tasks.createTask': 'Tạo công việc',
    'tasks.loading': 'Đang tải...',
    'tasks.clearFilters': 'Xóa bộ lọc',
    'tasks.clearAll': 'Xóa tất cả',
    'tasks.activeFilters': 'Bộ lọc đang hoạt động',
    'tasks.status': 'Trạng thái',
    'tasks.priority': 'Mức ưu tiên',
    'tasks.project': 'Dự án',
    'tasks.tag': 'Thẻ',
    'tasks.allStatus': 'Tất cả trạng thái',
    'tasks.allPriorities': 'Tất cả mức ưu tiên',
    'tasks.allProjects': 'Tất cả dự án',
    'tasks.allTags': 'Tất cả thẻ',
    'tasks.statusTodo': 'Cần làm',
    'tasks.statusInProgress': 'Đang làm',
    'tasks.statusDone': 'Xong',
    'tasks.statusCancelled': 'Đã hủy',
    'tasks.priorityLow': 'Thấp',
    'tasks.priorityMedium': 'Trung bình',
    'tasks.priorityHigh': 'Cao',
    'tasks.priorityUrgent': 'Khẩn cấp',
    'tasks.tracking': 'Đang theo dõi',
    'tasks.due': 'Hạn',
    'tasks.stop': 'Dừng',
    'tasks.track': 'Theo dõi',
    'tasks.completed': 'Hoàn thành',
    'tasks.deleteConfirm': 'Bạn có chắc muốn xóa công việc này không?',
    'tasks.deleteSuccess': 'Đã xóa công việc',
    'tasks.deleteSuccessDesc': 'Công việc đã được xóa thành công.',
    'tasks.deleteError': 'Lỗi',
    'tasks.deleteErrorDesc': 'Không thể xóa công việc.',
    'tasks.deleteErrorGeneric': 'Đã xảy ra lỗi khi xóa công việc.',
    'tasks.stopTracking': 'Dừng theo dõi',
    'tasks.startTracking': 'Bắt đầu theo dõi',
    'tasks.edit': 'Sửa',
    'tasks.delete': 'Xóa',
    'tasks.hideCompleted': 'Ẩn công việc đã hoàn thành',

    // Task Dialog
    'taskDialog.editTask': 'Sửa công việc',
    'taskDialog.createTask': 'Tạo công việc',
    'taskDialog.title': 'Tiêu đề',
    'taskDialog.titleRequired': 'Tiêu đề *',
    'taskDialog.titlePlaceholder': 'Nhập tiêu đề công việc...',
    'taskDialog.description': 'Mô tả',
    'taskDialog.descriptionPlaceholder': 'Thêm mô tả...',
    'taskDialog.status': 'Trạng thái',
    'taskDialog.priority': 'Mức ưu tiên',
    'taskDialog.project': 'Dự án',
    'taskDialog.selectProject': 'Chọn dự án...',
    'taskDialog.noProject': 'Không có dự án',
    'taskDialog.dueDate': 'Ngày hết hạn',
    'taskDialog.tags': 'Thêm thẻ',
    'taskDialog.noTagsYet': 'Chưa có thẻ nào.',
    'taskDialog.createTagsFirst': 'Tạo thẻ trước →',
    'taskDialog.cancel': 'Hủy',
    'taskDialog.saveChanges': 'Lưu thay đổi',

    // Priority Tasks
    'priorityTasks.noActiveTasks': 'Không có công việc đang hoạt động',
    'priorityTasks.createFirstTask': 'Tạo công việc đầu tiên để bắt đầu',
    'priorityTasks.tracking': 'Đang theo dõi',
    'priorityTasks.undo': 'Hoàn tác',
    'priorityTasks.start': 'Theo dõi',
    'priorityTasks.stop': 'Dừng',

    // Error Boundary
    'errorBoundary.title': 'Đã xảy ra lỗi',
    'errorBoundary.description':
      'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.',
    'errorBoundary.retry': 'Thử lại',
    'errorBoundary.reload': 'Tải lại trang',

    // Projects
    'projects.title': 'Dự án',
    'projects.description': 'Tổ chức công việc của bạn thành các dự án',
    'projects.newProject': 'Dự án mới',
    'projects.noProjects': 'Chưa có dự án nào',
    'projects.createFirstProject':
      'Tạo dự án đầu tiên để tổ chức công việc của bạn',
    'projects.createProject': 'Tạo dự án',
    'projects.loading': 'Đang tải...',
    'projects.editProjectName': 'Sửa tên dự án...',
    'projects.newProjectName': 'Tên dự án mới...',
    'projects.update': 'Cập nhật',
    'projects.create': 'Tạo',
    'projects.cancel': 'Hủy',
    'projects.nameRequired': 'Tên dự án là bắt buộc',
    'projects.createError': 'Lỗi khi tạo dự án',
    'projects.updateError': 'Lỗi khi cập nhật dự án',
    'projects.deleteConfirm':
      'Bạn có chắc muốn xóa dự án này không? Tất cả công việc liên quan cũng sẽ bị xóa.',
    'projects.deleteError': 'Không thể xóa dự án',
    'projects.tasks': 'công việc',
    'projects.viewTasks': 'Xem công việc',
    'projects.edit': 'Sửa',
    'projects.delete': 'Xóa',

    // Tags
    'tags.title': 'Thẻ',
    'tags.description': 'Quản lý thẻ để phân loại công việc',
    'tags.newTag': 'Thẻ mới',
    'tags.noTags': 'Chưa có thẻ nào',
    'tags.createFirstTag': 'Tạo thẻ để phân loại và lọc công việc',
    'tags.loading': 'Đang tải...',
    'tags.createNewTag': 'Tạo thẻ mới',
    'tags.editTag': 'Sửa thẻ',
    'tags.tagName': 'Tên thẻ...',
    'tags.selectColor': 'Chọn màu',
    'tags.create': 'Tạo',
    'tags.update': 'Cập nhật',
    'tags.cancel': 'Hủy',
    'tags.nameRequired': 'Tên thẻ là bắt buộc',
    'tags.alreadyExists': 'Thẻ với tên này đã tồn tại',
    'tags.deleteConfirm': 'Bạn có chắc muốn xóa thẻ này không?',
    'tags.viewTasks': 'Xem công việc',
    'tags.tasks': 'công việc',
    'tags.edit': 'Sửa',
    'tags.delete': 'Xóa',

    // Statistics
    'stats.title': 'Thống kê',
    'stats.description': 'Theo dõi năng suất và hoàn thành công việc của bạn',
    'stats.loading': 'Đang tải...',
    'stats.totalTasks': 'Tổng số công việc',
    'stats.completed': 'Đã hoàn thành',
    'stats.completionRate': 'tỷ lệ hoàn thành',
    'stats.inProgress': 'Đang thực hiện',
    'stats.timeTracked': 'Thời gian đã theo dõi',
    'stats.tasksByPriority': 'Công việc theo mức ưu tiên',
    'stats.recentActivity': 'Hoạt động gần đây',
    'stats.noData': 'Không có dữ liệu',
    'stats.noRecentActivity': 'Không có hoạt động gần đây',
    'stats.tasks': 'công việc',
    'stats.noProject': 'Không có dự án',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const saved = localStorage.getItem('language');
  return saved === 'de' || saved === 'vi' || saved === 'en' ? saved : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const translation =
      translations[language][key as keyof typeof translations.en];
    if (!translation) return key;

    if (params) {
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
        translation
      );
    }

    return translation;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
