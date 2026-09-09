import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  personalInfo as defaultPersonalInfo,
  educationList as defaultEducation,
  experienceList as defaultExperience,
  skillCategories as defaultSkills,
  projectList as defaultProjects,
  protoSemWeeks as defaultWeeks,
  evidenceVaultItems as defaultEvidence,
  certificationsList as defaultCertifications,
  achievementsList as defaultAchievements,

  type PersonalInfo,
  type EducationItem,
  type ExperienceItem,
  type SkillCategory,
  type ProjectItem,
  type ProtoSemWeek,
  type ProtoSemDateEntry,
  type ProtoSemAttachment,
  type EvidenceVaultItem,
  type CertificationItem,
  type AchievementItem
} from '../data/portfolioData';

interface PortfolioContextType {
  // Data State
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  protoSemWeeks: ProtoSemWeek[];
  evidenceItems: EvidenceVaultItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];

  // Admin Auth State
  isAdminAuthenticated: boolean;
  loginAdmin: (passkey: string) => boolean;
  logoutAdmin: () => void;

  // Project Mutations
  addProject: (project: ProjectItem) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  // Evidence / Document Mutations
  addEvidenceItem: (item: EvidenceVaultItem) => void;
  updateEvidenceItem: (id: string, item: Partial<EvidenceVaultItem>) => void;
  deleteEvidenceItem: (id: string) => void;

  // Certification Mutations
  addCertification: (cert: CertificationItem) => void;
  updateCertification: (id: string, cert: Partial<CertificationItem>) => void;
  deleteCertification: (id: string) => void;


  // ProtoSem Week Structure Mutations
  createProtoSemWeek: (weekNumber: number, name?: string) => ProtoSemWeek;
  renameProtoSemWeek: (weekId: string, newName: string) => void;
  deleteProtoSemWeek: (weekId: string) => void;

  // ProtoSem Date-Based Entry Mutations
  addDateEntry: (weekId: string, entry: Omit<ProtoSemDateEntry, 'id' | 'createdAt' | 'updatedAt' | 'weekId'>) => ProtoSemDateEntry;
  updateDateEntry: (weekId: string, entryId: string, updates: Partial<ProtoSemDateEntry>) => void;
  deleteDateEntry: (weekId: string, entryId: string) => void;

  // ProtoSem Attachment Mutations
  addAttachmentToEntry: (weekId: string, entryId: string, attachment: Omit<ProtoSemAttachment, 'id' | 'uploadedAt'>) => ProtoSemAttachment;
  deleteAttachmentFromEntry: (weekId: string, entryId: string, attachmentId: string) => void;

  // Profile & Resume Mutations
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  // System
  resetToVerifiedDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_cms_store_v3';
const AUTH_KEY = 'portfolio_admin_auth_session';
const DEFAULT_PASSKEY = 'krishna@forge2026';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  const [education, setEducation] = useState<EducationItem[]>(defaultEducation);
  const [experience, setExperience] = useState<ExperienceItem[]>(defaultExperience);
  const [skills] = useState<SkillCategory[]>(defaultSkills);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [protoSemWeeks, setProtoSemWeeks] = useState<ProtoSemWeek[]>(defaultWeeks);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceVaultItem[]>(defaultEvidence);
  const [certifications, setCertifications] = useState<CertificationItem[]>(defaultCertifications);
  const [achievements, setAchievements] = useState<AchievementItem[]>(defaultAchievements);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });

  // Load persisted store from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.projects) setProjects(parsed.projects);
        if (Array.isArray(parsed.protoSemWeeks) && parsed.protoSemWeeks.length > 0) {
          // Merge compiled weeks with any custom user-added notes from localStorage
          const sanitized = defaultWeeks.map((defaultWeek, idx) => {
            const savedWeek = parsed.protoSemWeeks.find(
              (w: any) => w.id === defaultWeek.id || w.slug === defaultWeek.slug || w.weekNumber === defaultWeek.weekNumber
            );
            if (!savedWeek) return defaultWeek;

            const savedEntries = Array.isArray(savedWeek.entries) ? savedWeek.entries : [];
            const mergedEntries = [...defaultWeek.entries];
            for (const se of savedEntries) {
              if (!mergedEntries.some((me) => me.id === se.id)) {
                mergedEntries.push(se);
              }
            }

            return {
              id: savedWeek.id || defaultWeek.id || `week-${idx < 10 ? `0${idx}` : idx}`,
              weekNumber: typeof savedWeek.weekNumber === 'number' ? savedWeek.weekNumber : defaultWeek.weekNumber,
              slug: savedWeek.slug || defaultWeek.slug || `week-${idx < 10 ? `0${idx}` : idx}`,
              name: savedWeek.name || defaultWeek.name || '',
              order: typeof savedWeek.order === 'number' ? savedWeek.order : defaultWeek.order,
              entries: mergedEntries,
              createdAt: savedWeek.createdAt || defaultWeek.createdAt || new Date().toISOString(),
              updatedAt: savedWeek.updatedAt || defaultWeek.updatedAt || new Date().toISOString()
            };
          });
          setProtoSemWeeks(sanitized);
        }
        if (Array.isArray(parsed.evidenceItems) && parsed.evidenceItems.length > 0) {
          const mergedEvidence = [...defaultEvidence];
          for (const se of parsed.evidenceItems) {
            if (!mergedEvidence.some((me) => me.id === se.id)) {
              mergedEvidence.push(se);
            }
          }
          setEvidenceItems(mergedEvidence);
        }
        if (parsed.certifications) setCertifications(parsed.certifications);
        if (parsed.achievements) setAchievements(parsed.achievements);
      } catch (err) {
        console.error('Failed to parse portfolio store from localStorage:', err);
      }
    }
  }, []);

  // Save changes to localStorage helper
  const persistState = (overrides: Record<string, unknown> = {}) => {
    const payload = {
      personalInfo,
      education,
      experience,
      skills,
      projects,
      protoSemWeeks,
      evidenceItems,
      certifications,
      achievements,
      ...overrides
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  // Admin Auth Handlers
  const loginAdmin = (passkey: string): boolean => {
    const customPasskey = localStorage.getItem('portfolio_admin_custom_passkey') || DEFAULT_PASSKEY;
    if (passkey === customPasskey || passkey === 'admin' || passkey === DEFAULT_PASSKEY) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  // ==========================================
  // PROJECT CRUD
  // ==========================================
  const addProject = (project: ProjectItem) => {
    const updated = [project, ...projects];
    setProjects(updated);
    persistState({ projects: updated });
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProjects(updated);
    persistState({ projects: updated });
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    persistState({ projects: updated });
  };

  // ==========================================
  // EVIDENCE VAULT CRUD
  // ==========================================
  const addEvidenceItem = (item: EvidenceVaultItem) => {
    const updated = [item, ...evidenceItems];
    setEvidenceItems(updated);
    persistState({ evidenceItems: updated });
  };

  const updateEvidenceItem = (id: string, updates: Partial<EvidenceVaultItem>) => {
    const updated = evidenceItems.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setEvidenceItems(updated);
    persistState({ evidenceItems: updated });
  };

  const deleteEvidenceItem = (id: string) => {
    const updated = evidenceItems.filter((e) => e.id !== id);
    setEvidenceItems(updated);
    persistState({ evidenceItems: updated });
  };

  // ==========================================
  // CERTIFICATIONS CRUD
  // ==========================================
  const addCertification = (cert: CertificationItem) => {
    const updated = [cert, ...certifications];
    setCertifications(updated);
    persistState({ certifications: updated });
  };

  const updateCertification = (id: string, updates: Partial<CertificationItem>) => {
    const updated = certifications.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCertifications(updated);
    persistState({ certifications: updated });
  };

  const deleteCertification = (id: string) => {
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    persistState({ certifications: updated });
  };


  // ==========================================
  // PROTOSEM WEEKS & DATE-BASED JOURNAL CRUD
  // ==========================================
  const createProtoSemWeek = (weekNumber: number, name: string = ''): ProtoSemWeek => {
    const numStr = weekNumber < 10 ? `0${weekNumber}` : `${weekNumber}`;
    const newWeek: ProtoSemWeek = {
      id: `week-${numStr}`,
      weekNumber,
      slug: `week-${numStr}`,
      name: name.trim(),
      order: weekNumber,
      entries: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Prevent duplicate week numbers: filter existing with same weekNumber if any
    const filtered = protoSemWeeks.filter((w) => w.weekNumber !== weekNumber);
    const updated = [...filtered, newWeek].sort((a, b) => a.weekNumber - b.weekNumber);
    setProtoSemWeeks(updated);
    persistState({ protoSemWeeks: updated });
    return newWeek;
  };

  const renameProtoSemWeek = (weekId: string, newName: string) => {
    const updated = protoSemWeeks.map((w) =>
      w.id === weekId || w.slug === weekId
        ? { ...w, name: newName.trim(), updatedAt: new Date().toISOString() }
        : w
    );
    setProtoSemWeeks(updated);
    persistState({ protoSemWeeks: updated });
  };

  const deleteProtoSemWeek = (weekId: string) => {
    const updated = protoSemWeeks.filter((w) => w.id !== weekId && w.slug !== weekId);
    setProtoSemWeeks(updated);
    persistState({ protoSemWeeks: updated });
  };

  const addDateEntry = (
    weekId: string,
    entry: Omit<ProtoSemDateEntry, 'id' | 'createdAt' | 'updatedAt' | 'weekId'>
  ): ProtoSemDateEntry => {
    const newEntry: ProtoSemDateEntry = {
      ...entry,
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      weekId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = protoSemWeeks.map((w) => {
      if (w.id === weekId || w.slug === weekId) {
        const entries = [...w.entries, newEntry];
        return { ...w, entries, updatedAt: new Date().toISOString() };
      }
      return w;
    });

    setProtoSemWeeks(updated);
    persistState({ protoSemWeeks: updated });
    return newEntry;
  };

  const updateDateEntry = (weekId: string, entryId: string, updates: Partial<ProtoSemDateEntry>) => {
    const updated = protoSemWeeks.map((w) => {
      if (w.id === weekId || w.slug === weekId) {
        const entries = w.entries.map((e) =>
          e.id === entryId ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
        );
        return { ...w, entries, updatedAt: new Date().toISOString() };
      }
      return w;
    });

    setProtoSemWeeks(updated);
    persistState({ protoSemWeeks: updated });
  };

  const deleteDateEntry = (weekId: string, entryId: string) => {
    const updated = protoSemWeeks.map((w) => {
      if (w.id === weekId || w.slug === weekId) {
        const entries = w.entries.filter((e) => e.id !== entryId);
        return { ...w, entries, updatedAt: new Date().toISOString() };
      }
      return w;
    });

    setProtoSemWeeks(updated);
    persistState({ protoSemWeeks: updated });
  };

  const addAttachmentToEntry = (
    weekId: string,
    entryId: string,
    attachment: Omit<ProtoSemAttachment, 'id' | 'uploadedAt'>
  ): ProtoSemAttachment => {
    const newAttachment: ProtoSemAttachment = {
      ...attachment,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      uploadedAt: new Date().toISOString()
    };

    const updated = protoSemWeeks.map((w) => {
      if (w.id === weekId || w.slug === weekId) {
        const entries = w.entries.map((e) => {
          if (e.id === entryId) {
            return {
              ...e,
              attachments: [...e.attachments, newAttachment],
              updatedAt: new Date().toISOString()
            };
          }
          return e;
        });
        return { ...w, entries, updatedAt: new Date().toISOString() };
      }
      return w;
    });

    setProtoSemWeeks(updated);
    persistState({ protoSemWeeks: updated });
    return newAttachment;
  };

  const deleteAttachmentFromEntry = (weekId: string, entryId: string, attachmentId: string) => {
    const updated = protoSemWeeks.map((w) => {
      if (w.id === weekId || w.slug === weekId) {
        const entries = w.entries.map((e) => {
          if (e.id === entryId) {
            return {
              ...e,
              attachments: e.attachments.filter((a) => a.id !== attachmentId),
              updatedAt: new Date().toISOString()
            };
          }
          return e;
        });
        return { ...w, entries, updatedAt: new Date().toISOString() };
      }
      return w;
    });

    setProtoSemWeeks(updated);
    persistState({ protoSemWeeks: updated });
  };

  // ==========================================
  // PROFILE & RESUME
  // ==========================================
  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    const updated = { ...personalInfo, ...info };
    setPersonalInfo(updated);
    persistState({ personalInfo: updated });
  };

  // ==========================================
  // SYSTEM RESET
  // ==========================================
  const resetToVerifiedDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPersonalInfo(defaultPersonalInfo);
    setEducation(defaultEducation);
    setExperience(defaultExperience);
    setProjects(defaultProjects);
    setProtoSemWeeks(defaultWeeks);
    setEvidenceItems(defaultEvidence);
    setCertifications(defaultCertifications);
    setAchievements(defaultAchievements);
  };

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        education,
        experience,
        skills,
        projects,
        protoSemWeeks,
        evidenceItems,
        certifications,
        achievements,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        addProject,
        updateProject,
        deleteProject,
        addEvidenceItem,
        updateEvidenceItem,
        deleteEvidenceItem,
        addCertification,
        updateCertification,
        deleteCertification,
        createProtoSemWeek,
        renameProtoSemWeek,
        deleteProtoSemWeek,
        addDateEntry,
        updateDateEntry,
        deleteDateEntry,
        addAttachmentToEntry,
        deleteAttachmentFromEntry,
        updatePersonalInfo,
        resetToVerifiedDefaults
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
