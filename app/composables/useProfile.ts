import { computed } from "vue";

export const useProfile = (targetUserId?: any) => {
  const { user: sessionUser } = useUserSession();

  // Resolve ID: explicit target or current session
  const userId = computed(() => {
    if (targetUserId) return toValue(targetUserId);
    return sessionUser.value?.id;
  });

  // Shared state for the profile
  const {
    data: profileResponse,
    pending,
    error,
    refresh,
  } = useFetch(
    () => (userId.value ? `/api/applicants/${userId.value}/profile` : null),
    { key: computed(() => `applicant-profile-${userId.value || "guest"}`) }
  );

  const profile = computed(() => profileResponse.value?.data || {});

  const tabStatus = computed(() => {
    const p = profile.value;
    if (!p || Object.keys(p).length === 0) return [];

    return [
      {
        label: "Personal Information",
        icon: "pi pi-user",
        complete: !!(
          p.firstName &&
          p.lastName &&
          p.dateOfBirth &&
          p.addresses?.length > 0 &&
          p.emergencyContacts?.length > 0
        ),
      },
      {
        label: "Academic Qualifications",
        icon: "pi pi-book",
        complete: p.educationHistory?.length > 0,
      },
      {
        label: "Work Experience",
        icon: "pi pi-briefcase",
        complete: p.workExperience?.length > 0,
      },
      {
        label: "Tests",
        icon: "pi pi-check-square",
        complete: p.englishProficiency?.length > 0,
      },
    ];
  });

  const completionPercentage = computed(() => {
    let score = 0;
    const p = profile.value;
    if (!p || Object.keys(p).length === 0) return 0;

    // 1. Personal & Identity (30%)
    if (p.firstName) score += 5;
    if (p.lastName) score += 5;
    if (p.dateOfBirth) score += 5;
    if (p.gender) score += 5;
    if (p.nationality) score += 5;
    if (p.passportNo) score += 5;

    // 2. Residential & Social (20%)
    if (p.addresses?.length > 0) score += 10;
    if (p.emergencyContacts?.length > 0) score += 10;

    // 3. Academic Integrity (30%)
    if (p.educationHistory?.length > 0) {
      score += 20;
      if (p.educationHistory.length > 1) score += 10;
    }

    // 4. Professional & Language (20%)
    if (p.englishProficiency?.length > 0) score += 10;
    if (p.workExperience?.length > 0) score += 10;

    return Math.min(score, 100);
  });

  const nextAction = computed(() => {
    const tabs = tabStatus.value;
    if (!tabs || tabs.length === 0) return null;
    const pendingTab = tabs.find((t) => !t.complete);
    if (!pendingTab) return null;

    return {
      label: pendingTab.label,
      msg: `Complete your ${pendingTab.label.toLowerCase()} to strengthen your institutional identity.`,
      tab: tabs.indexOf(pendingTab),
    };
  });

  return {
    profile,
    pending,
    error,
    refresh,
    completionPercentage,
    tabStatus,
    nextAction,
  };
};
